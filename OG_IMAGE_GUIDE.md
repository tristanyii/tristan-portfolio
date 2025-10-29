# Social Media Banner (OG Image) Setup Guide

## 🖼️ What is an OG Image?

When you share your website link on social media (Twitter, LinkedIn, Discord, Slack, etc.), a preview banner appears. This is called an **Open Graph (OG) Image**.

## ✅ What I Already Set Up

I've added the metadata to your site. Now you just need to create the image!

## 🎨 Creating Your Banner Image

### Quick Option: Use Canva (Free & Easy)

1. **Go to Canva**: https://canva.com
2. **Create Custom Size**: 1200 x 630 pixels
3. **Design Your Banner** with:
   - Your name: "Tristan Yi"
   - Your tagline: "CS & Stats @ Duke University"
   - Background gradient or Duke blue colors
   - Optional: Your headshot photo
   - Optional: Snorlax pixel art 😊

4. **Download as JPG**
5. **Rename to**: `og-image.jpg`
6. **Place in**: `/public/og-image.jpg`

### Professional Template Ideas:

**Option 1: Clean & Professional**
```
+------------------------------------------+
|                                          |
|        TRISTAN YI                        |
|  Computer Science & Statistics @ Duke   |
|                                          |
|  🎵 Music Lover | 📸 Photographer       |
|  💻 Software Engineer                    |
|                                          |
+------------------------------------------+
```

**Option 2: With Photo**
```
+------------------------------------------+
|                              |           |
|  TRISTAN YI                  |   [Your]  |
|                              |   Photo   |
|  CS & Stats @ Duke           |   Here]   |
|  Union, SC                   |           |
|                              |           |
+------------------------------------------+
```

**Option 3: Bold & Colorful**
```
+------------------------------------------+
|  ┌─────────────────────────────────┐   |
|  │  TRISTAN YI                      │   |
|  │  CS & STATS @ DUKE               │   |
|  └─────────────────────────────────┘   |
|                                          |
|  Building cool stuff with code 💻       |
|                                          |
+------------------------------------------+
```

## 🚀 Alternative: Use Your Existing Photo

If you want to use one of your existing photos temporarily:

Replace line 29 in `app/layout.tsx`:
```typescript
url: "/og-image.jpg",
```

With one of these:
- `/Headshot.jpg` - Professional headshot
- `/MirrorPic.jpg` - Mirror selfie
- `/Selfie.jpg` - Casual photo

**Note**: These are smaller than optimal, but will work temporarily.

## 📐 Image Specifications

- **Ideal Size**: 1200 x 630 pixels (1.91:1 ratio)
- **Format**: JPG or PNG
- **Max File Size**: Under 8 MB (smaller is better for loading speed)
- **File Name**: `og-image.jpg` (or update the path in layout.tsx)

## 🔧 Tools to Create Banner

### Free Options:
1. **Canva** - https://canva.com (Easiest, templates available)
2. **Figma** - https://figma.com (More professional)
3. **Photopea** - https://photopea.com (Free Photoshop alternative)

### Quick Generator:
- **OG Image Playground**: https://og-playground.vercel.app/
- Type your info, download, done!

## ✅ Testing Your Banner

After adding your image:

1. **Deploy to Vercel**
2. **Test your link** on these sites:
   - LinkedIn: https://linkedin.com
   - Twitter: https://twitter.com
   - Discord: Paste link in any chat
   - Debug tool: https://www.opengraph.xyz/

3. **Force Refresh** (if old preview shows):
   - Twitter: https://cards-dev.twitter.com/validator
   - Facebook: https://developers.facebook.com/tools/debug/
   - LinkedIn: https://www.linkedin.com/post-inspector/

## 🎨 Design Tips

### Colors:
- **Duke Blue**: #012169
- **Duke Royal Blue**: #001A57
- **White**: #FFFFFF
- **Gradient**: Blue to Purple (matches your site!)

### Typography:
- **Name**: Large, bold (72-96pt)
- **Tagline**: Medium (36-48pt)
- **Details**: Smaller (24-30pt)

### Layout:
- Keep important text in the **center 80%** (some platforms crop edges)
- Use **high contrast** (dark text on light background or vice versa)
- Include **your headshot** if you want it more personal
- Add **emojis** for personality: 💻 🎵 📸 ✈️

## 📝 Current Setup

Your site is configured to look for: `/public/og-image.jpg`

Once you add that file and deploy, your link will show a beautiful banner! 🎉

## 🔍 Example

When someone shares `https://tristanyi.vercel.app`, they'll see:

```
┌─────────────────────────────────────┐
│                                     │
│  [Your Banner Image]                │
│                                     │
├─────────────────────────────────────┤
│ Tristan Yi | CS & Stats @ Duke      │
│ Personal website of Tristan Yi -    │
│ Computer Science and Statistics...  │
│ 🔗 tristanyi.vercel.app             │
└─────────────────────────────────────┘
```

Pretty cool, right? 😎

