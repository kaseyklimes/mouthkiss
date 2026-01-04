# Mouthkiss Cafe

A simple landing page for Mouthkiss Cafe - a cafe in our apartment.

## Features

- Email signup form with YouTube redirect on success
- Scrolling marquee animation
- Responsive design
- Integration with MailerLite for email list management

## Setup

### 1. Add Your Assets

Place your image files in the `assets/` folder:

- `logo.png` - Your Mouthkiss logo (the lip mark image)
- `background.jpg` - The "dadpad" background image
- `favicon.ico` - (optional) Browser tab icon

### 2. Set Up MailerLite

1. Create a free account at [mailerlite.com](https://mailerlite.com)
2. Import your subscriber list (export CSV from Squarespace)
3. Create an embedded signup form:
   - Go to Forms → Embedded forms → Create form
   - Add fields: First Name, Last Name, Email
   - Set success action: Redirect to `https://www.youtube.com/watch?v=pNj9bXKGOiI`
4. Copy the embed code and replace the `<form>` in `index.html`

### 3. Deploy to Netlify

1. Create a free account at [netlify.com](https://netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag and drop this entire folder
4. Your site is live at a random `.netlify.app` URL

### 4. Connect Your Domain

1. In Netlify: Domain settings → Add custom domain → `www.mouthkisscafe.com`
2. Transfer your domain to Namecheap (~$12/year)
3. Update DNS to point to Netlify (they provide instructions)

## Local Development

Simply open `index.html` in a browser to preview the site.

**Note:** The signup form won't work locally until you add the MailerLite embed code.

## Structure

```
/
├── index.html          # Main landing page
├── styles.css          # Stylesheet
├── netlify.toml        # Netlify configuration
├── assets/
│   ├── logo.png        # Mouthkiss logo (add this)
│   ├── background.jpg  # Background image (add this)
│   └── favicon.ico     # Browser tab icon (optional)
└── email-template.html # HTML email template for MailerLite
```

## Email Service

Uses MailerLite (free tier) for:
- Up to 1,000 subscribers
- 12,000 emails/month
- Individual open/click tracking (see who's coming!)
- HTML email templates
- Automatic unsubscribe handling

## Cost

- **Netlify hosting:** Free
- **MailerLite:** Free (for your list size)
- **Domain renewal:** ~$12/year (Namecheap)

**Total: ~$12/year** (vs $16-27/month for Squarespace)
