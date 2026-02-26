# Soul Threshold

Intuitive mentoring website for Debi Brause — grief, fear, and breaking cycles. Charlotte, NC.

## Project Structure

```
/
├── index.html                  Home page
├── work-with-me.html           Services page
├── apply.html                  Application form (Formspree)
├── blog.html                   Blog listing + individual post view
├── 404.html                    Custom 404 page
├── favicon.ico                 Browser favicon
├── site.webmanifest            PWA manifest
├── admin/
│   ├── index.html              Decap CMS admin panel
│   └── config.yml              CMS configuration
├── content/
│   └── blog/                   Markdown blog posts
│       ├── index.json          Blog post index
│       └── *.md                Individual posts with frontmatter
├── assets/
│   ├── css/style.css           Design system (CSS custom properties)
│   ├── js/main.js              Starfield, animations, blog, form handling
│   └── images/
│       ├── logo.png            Site logo (2052×2052)
│       ├── favicon-16.png      16px favicon
│       ├── favicon-32.png      32px favicon
│       ├── logo-180.png        Apple touch icon
│       ├── icon-192.png        PWA icon
│       ├── icon-512.png        PWA icon (large)
│       ├── og-image.png        Open Graph / social share image
│       └── uploads/            CMS media uploads
├── netlify.toml                Netlify config, redirects, headers
└── README.md
```

## Deploy to Netlify

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site > Import an existing project**
3. Connect your GitHub repo
4. Build settings: leave blank (no build command — static HTML)
5. Publish directory: `.` (root)
6. Click **Deploy site**

## Set Up Decap CMS

After deploying to Netlify:

1. Go to **Site settings > Identity** → click **Enable Identity**
2. Under **Registration**, set to **Invite only**
3. Under **Services > Git Gateway**, click **Enable Git Gateway**
4. Go to the **Identity** tab → click **Invite users** → add Debi's email
5. She'll receive an invite, set a password, then access the CMS at `yoursite.netlify.app/admin`

## Application Form (Formspree)

The apply page form submits to Formspree. To connect it:

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — you'll get an endpoint like `https://formspree.io/f/xABCDEFG`
3. In `apply.html`, update the form's `action` attribute with your endpoint
4. Set the form to forward submissions to `debi.mentoring@gmail.com`

## MailerLite Email Signup

1. Create a signup form in your MailerLite dashboard
2. Copy the embed code
3. In `index.html`, find `<div id="mailerlite-form">` and replace its contents with the embed code

## Adding Blog Posts

### Via Decap CMS (recommended)
1. Go to `yoursite.com/admin`
2. Log in with Netlify Identity
3. Click **Blog Posts > New Blog Post**
4. Write your post and publish

### Manually
1. Create a `.md` file in `content/blog/` with frontmatter:
   ```markdown
   ---
   title: "Your Post Title"
   date: "2025-02-01"
   excerpt: "A short summary of the post."
   ---

   Your post content in markdown...
   ```
2. Update `content/blog/index.json` to include the new post entry

## Design System

### Color Palette (CSS Custom Properties)

| Variable        | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| `--navy`        | `#0a0e2a` | Primary background          |
| `--gold`        | `#c9a84c` | Accents, borders, text      |
| `--gold-light`  | `#e8c97a` | Highlights, hover states    |
| `--gold-pale`   | `#f5e6b8` | Subtle text accents         |
| `--gold-dim`    | `#8a6d2f` | Muted labels, eyebrow text  |
| `--purple`      | `#3a1f6e` | Nebula gradients            |
| `--text-body`   | `#d4c5a9` | Body text                   |

### Typography

- **Cinzel Decorative** — Logo, headings (h1, h2)
- **Cinzel** — Navigation, labels, eyebrow text
- **EB Garamond** — Body text, paragraphs

### Visual Effects

- Canvas starfield with twinkling animation
- Nebula background with parallax scroll
- Floating gold particle system
- Scroll-triggered reveal animations
- Sacred geometry SVG ornaments (gateway arch, glyphs, corner accents)

## Tech Stack

- Pure HTML, CSS, JavaScript (no frameworks, no build tools)
- Google Fonts: Cinzel Decorative, Cinzel, EB Garamond
- Formspree for form submissions
- Decap CMS for blog content management
- Netlify for hosting with clean blog URL redirects
