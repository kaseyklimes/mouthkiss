// The form is usable before this file or any third-party resource loads.
(() => {
  const form = document.getElementById('signup-form');
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const help = document.getElementById('form-help');
  const buttonText = button.textContent;
  let pending = false;
  let requestId = 0;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;

    pending = true;
    button.disabled = true;
    button.textContent = 'sending...';
    form.setAttribute('aria-busy', 'true');
    status.textContent = '';
    help.hidden = true;

    const callbackName = `mouthkissSignup_${Date.now()}_${++requestId}`;
    const url = new URL(form.action);
    for (const [name, value] of new FormData(form)) {
      url.searchParams.set(name, value);
    }
    url.searchParams.set('ajax', '1');
    url.searchParams.set('callback', callbackName);

    const script = document.createElement('script');
    let settled = false;
    const finish = (response) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      script.remove();
      // Ignore a late JSONP response after a timeout without throwing an error.
      window[callbackName] = () => {};
      setTimeout(() => delete window[callbackName], 60000);
      form.removeAttribute('aria-busy');

      if (response && response.success === true) {
        status.textContent = 'You’re on the list. See you at the cafe!';
        window.location.assign('https://www.youtube.com/watch?v=pNj9bXKGOiI&autoplay=1');
        return;
      }

      pending = false;
      button.disabled = false;
      button.textContent = buttonText;
      status.textContent = response
        ? 'We couldn’t complete your signup. Check your details and try again.'
        : 'We couldn’t reach the signup service. Please try again.';
      help.hidden = false;
    };

    const timeout = setTimeout(() => finish(null), 15000);
    window[callbackName] = finish;
    script.onerror = () => finish(null);
    script.src = url.href;
    document.head.appendChild(script);
  });
})();

// Preserve the wavy marquee, with a static fallback for reduced motion or no JS.
(() => {
  const track = document.getElementById('marquee-track');
  const marquee = track.parentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phrase = "it's a cafe in our apartment 〰️ ";
  let frame;
  let resizeTimer;
  let chars = [];
  let positions = [];
  let trackWidth = 0;
  let offset = 0;
  let lastTime = 0;

  function animate(time) {
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;
    offset = (offset + 50 * delta) % trackWidth;
    for (let i = 0; i < chars.length; i++) {
      const phase = (positions[i] - offset) * 0.012;
      const y = Math.sin(phase) * 12;
      const angle = Math.atan(12 * 0.012 * Math.cos(phase)) * (180 / Math.PI);
      chars[i].style.transform = `translateY(${y}px) rotate(${angle}deg)`;
    }
    track.style.transform = `translateX(${-offset}px)`;
    frame = requestAnimationFrame(animate);
  }

  function build() {
    cancelAnimationFrame(frame);
    marquee.classList.remove('is-animated');
    track.replaceChildren();
    track.style.transform = '';
    offset = 0;
    lastTime = 0;
    if (motion.matches) return;

    // Measure one phrase in the actual font instead of estimating character widths.
    for (const char of phrase) {
      const span = document.createElement('span');
      span.className = 'wave-char';
      span.textContent = char === ' ' ? '\u00a0' : char;
      track.appendChild(span);
    }
    const phraseWidth = track.getBoundingClientRect().width;
    if (!phraseWidth) return;
    const phraseNodes = Array.from(track.children);
    const copies = Math.ceil(marquee.clientWidth / phraseWidth) + 1;
    for (let i = 1; i < copies; i++) {
      phraseNodes.forEach((node) => track.appendChild(node.cloneNode(true)));
    }
    trackWidth = track.getBoundingClientRect().width;
    Array.from(track.children).forEach((node) => track.appendChild(node.cloneNode(true)));
    chars = Array.from(track.children);
    positions = chars.map((char) => char.offsetLeft);
    marquee.classList.add('is-animated');
    if (!document.hidden) frame = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 150);
  });
  motion.addEventListener('change', build);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame);
    lastTime = 0;
    if (!document.hidden && !motion.matches && trackWidth) {
      frame = requestAnimationFrame(animate);
    }
  });
  build();
  document.fonts.ready.then(build);
})();
