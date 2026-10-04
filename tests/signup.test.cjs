const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

// Exercise submission without sending test subscribers to the live mailing list.
function setup({ valid = true } = {}) {
  const listeners = {};
  const scripts = [];
  const redirects = [];
  const timers = new Map();
  const button = { textContent: 'get a love letter when the cafe is open', disabled: false };
  const status = { textContent: '' };
  const help = { hidden: true };
  const form = {
    action: 'https://assets.mailerlite.com/jsonp/2016721/forms/175685961394423216/subscribe',
    querySelector: () => button,
    reportValidity: () => valid,
    addEventListener: (name, callback) => { listeners[name] = callback; },
    setAttribute() {},
    removeAttribute() {},
  };
  const track = {
    parentElement: { classList: { remove() {} } },
    replaceChildren() {},
    style: {},
  };
  const elements = { 'signup-form': form, 'form-status': status, 'form-help': help, 'marquee-track': track };
  const window = {
    location: { assign: (url) => redirects.push(url) },
    matchMedia: () => ({ matches: true, addEventListener() {} }),
    addEventListener() {},
  };
  const document = {
    getElementById: (id) => elements[id],
    createElement: () => ({ remove() { this.removed = true; } }),
    head: { appendChild: (script) => scripts.push(script) },
    addEventListener() {},
    fonts: { ready: { then: (callback) => callback() } },
  };
  const fields = [
    ['fields[name]', 'A & B'], ['fields[last_name]', 'O’Neil'],
    ['fields[email]', 'test+signup@example.com'], ['ml-submit', '1'], ['anticsrf', 'true'],
  ];
  let timerId = 0;
  vm.runInNewContext(source, {
    window, document, URL,
    FormData: class { constructor() { return fields; } },
    setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
    clearTimeout(id) { timers.delete(id); },
    cancelAnimationFrame() {},
  });
  return {
    scripts, redirects, button, status, help, fields, window,
    submit: () => listeners.submit({ preventDefault() {} }),
    respond(response, index = scripts.length - 1) {
      window[new URL(scripts[index].src).searchParams.get('callback')](response);
    },
    timeout() { [...timers.values()].find((timer) => timer.delay === 15000).callback(); },
  };
}

test('fields exist in HTML and page load needs no MailerLite script', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  for (const field of ['name', 'last_name', 'email']) {
    assert.ok(html.includes(`name="fields[${field}]"`));
  }
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
  assert.equal(setup().scripts.length, 0);
});

test('invalid form never contacts the signup service', () => {
  const page = setup({ valid: false });
  page.submit();
  assert.equal(page.scripts.length, 0);
  assert.equal(page.button.disabled, false);
});

test('submission encodes all fields and prevents duplicate requests', () => {
  const page = setup();
  page.submit();
  page.submit();
  assert.equal(page.scripts.length, 1);
  const url = new URL(page.scripts[0].src);
  for (const [key, value] of page.fields) assert.equal(url.searchParams.get(key), value);
  assert.equal(url.searchParams.get('ajax'), '1');
  assert.equal(page.button.disabled, true);
});

test('confirmed success cleans up and redirects to the existing YouTube video', () => {
  const page = setup();
  page.submit();
  page.respond({ success: true });
  assert.deepEqual(page.redirects, ['https://www.youtube.com/watch?v=pNj9bXKGOiI&autoplay=1']);
  assert.equal(page.scripts[0].removed, true);
  assert.match(page.status.textContent, /on the list/);
});

test('server rejection preserves the form and allows a retry', () => {
  const page = setup();
  page.submit();
  page.respond({ success: false, errors: { fields: { email: ['Invalid email'] } } });
  assert.equal(page.redirects.length, 0);
  assert.equal(page.button.disabled, false);
  assert.equal(page.help.hidden, false);
  assert.match(page.status.textContent, /Check your details/);
  page.submit();
  assert.equal(page.scripts.length, 2);
  assert.notEqual(page.scripts[0].src, page.scripts[1].src);
});

test('blocked script shows an error instead of pretending signup succeeded', () => {
  const page = setup();
  page.submit();
  page.scripts[0].onerror();
  assert.equal(page.redirects.length, 0);
  assert.equal(page.button.disabled, false);
  assert.match(page.status.textContent, /couldn’t reach/);
});

test('timeout allows retry and ignores late responses from the old request', () => {
  const page = setup();
  page.submit();
  page.timeout();
  assert.equal(page.button.disabled, false);
  page.submit();
  page.respond({ success: true }, 0);
  assert.equal(page.redirects.length, 0);
  assert.equal(page.button.disabled, true);
  page.respond({ success: true }, 1);
  assert.equal(page.redirects.length, 1);
});
