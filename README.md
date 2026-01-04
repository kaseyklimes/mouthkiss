# Mouthkiss Cafe

A simple landing page for Mouthkiss Cafe - a cafe in our apartment.

## Features

- Email signup form with YouTube redirect on success
- Scrolling marquee animation
- Responsive design
- Integration with MailerLite for email list management

## Deployment

This site is designed to be deployed on Netlify (free tier).

1. Create a Netlify account at https://netlify.com
2. Drag and drop this folder to deploy
3. Configure your custom domain

## Email Service

Uses MailerLite (free tier) for:
- Subscriber management
- Email campaigns with HTML templates
- Open/click tracking

## Local Development

Simply open `index.html` in a browser to preview the site.

## Structure

```
/
├── index.html          # Main landing page
├── styles.css          # Stylesheet
├── assets/
│   ├── logo.png        # Mouthkiss logo
│   └── background.jpg  # Background image
└── email-template.html # HTML email template for MailerLite
```
