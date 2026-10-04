# Mouthkiss Cafe

A static landing page for Mouthkiss Cafe — a cafe in our apartment.

## Local preview

Run from this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. No build step or package installation is required.

## Files

- `index.html`: page content and accessible, native signup fields.
- `styles.css`: responsive layout, local fonts, and form styling.
- `app.js`: signup handling and the wavy marquee.
- `assets/`: logo, background, favicons, and fonts.
- `netlify.toml`: publishes this directory and configures headers.
- `tests/signup.test.cjs`: signup regression tests using Node's built-in test runner.

## Signup

The first name, last name, and email fields are included in the HTML. Displaying the form does not require MailerLite JavaScript, cookies, or a third-party download.

The form uses the existing MailerLite account `2016721` and form `175685961394423216` (embed ID `Ooxz0a`). With JavaScript enabled, `app.js` submits via MailerLite's JSONP endpoint and redirects to the existing YouTube video only after a confirmed success. Rejections, blocked requests, and 15-second timeouts show an error and allow retrying without clearing the fields. An email contact link appears if signup fails.

Without JavaScript, the form uses its normal POST action to MailerLite. The custom YouTube redirect requires JavaScript. MailerLite must still be reachable to accept a signup.

If replacing the MailerLite form, update the action URL in `index.html` using the new form's HTML embed code. Keep field names and required fields consistent with its configuration.

## Responsive behavior

The hero uses a minimum viewport height and grows with its content. The logo stays in normal flow; the marquee alone clips its animated content. Name fields stack on narrow phones. Inputs use 16px text, and the page respects safe-area insets and reduced-motion preferences. Without JavaScript or with reduced motion, the marquee displays static text.

## Checks

```sh
node --check app.js
node --test tests/signup.test.cjs
```

Tests simulate service responses; they do not add subscribers. Before deploying, inspect narrow phones, landscape, tablet, and desktop sizes. Check that all fields and the submit button remain reachable, and verify on an actual iPhone when available.

## Deployment

Deploy the directory to the existing Netlify site for `mouthkisscafe.com`. Local edits do not change the live website until deployed.

The stylesheet has a long immutable cache lifetime in `netlify.toml`. Increment its `?v=` reference in `index.html` whenever shipping CSS changes so returning visitors receive the new styles.
