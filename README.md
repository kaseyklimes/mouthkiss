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

#### Step 1: Create Account
1. Go to [mailerlite.com](https://www.mailerlite.com) and click "Sign up free"
2. Enter your email and create a password
3. Complete the onboarding (business name, website, etc.)

#### Step 2: Import Existing Subscribers (if any)
1. Export your subscriber list from Squarespace as CSV
2. In MailerLite: Go to **Subscribers** → **Import subscribers**
3. Upload your CSV file and map the columns

#### Step 3: Create a Form (to get the action URL)
1. Go to **Sites** → **Forms** → **Embedded forms**
2. Click **Create embedded form**
3. Add fields: **Name**, **Last name**, **Email** (design doesn't matter - we use our own form)
4. Click **Save and publish**

#### Step 4: Get Your Form Action URL
1. Click **Embed** or **Overview** on your form
2. Look at the HTML embed code
3. Find the `action` attribute in the `<form>` tag, e.g.:
   ```
   action="https://assets.mailerlite.com/jsonp/123456/forms/987654321/subscribe"
   ```
4. Copy that entire URL

#### Step 5: Update Your Site
1. Open `index.html`
2. Find line ~73: `action="ACTION_URL"`
3. Replace `ACTION_URL` with your form action URL

#### Step 6: Test
1. Open `index.html` in a browser
2. Fill out the form and submit
3. Verify:
   - You get redirected to YouTube
   - The subscriber appears in MailerLite

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
