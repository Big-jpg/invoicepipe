# InvoicePipe OG Images & Social Media Assets

## Overview

This directory contains professionally designed Open Graph (OG) images and social media assets for InvoicePipe. These images are automatically used when sharing InvoicePipe links on social media platforms, messaging apps, and other services that support OG metadata.

## Files

### Primary OG Images

#### `og-hero.png` (1200x630px)
- **Purpose**: Main social sharing image for the landing page
- **Layout**: Split-screen showing invoice transformation to JSON
- **Key Elements**:
  - InvoicePipe logo and branding
  - Headline: "Turn Invoices Into Structured Data"
  - Subtitle: "AI-powered extraction with 98%+ accuracy"
  - Visual: Invoice icon → JSON code snippet
  - Bottom stats: 5-16s Processing, Australian-First, 98%+ Accuracy
- **Used For**: Facebook, LinkedIn, Slack, Discord, default OG image

#### `og-demo.png` (1200x630px)
- **Purpose**: Product demonstration showing actual extraction
- **Layout**: Split-screen interface mockup
- **Key Elements**:
  - Left: Sample invoice PDF with highlighted bounding boxes
  - Right: Extracted JSON data with confidence scores
  - Color-coded fields (AmountDue, InvoiceDate, InvoiceId, etc.)
  - Action buttons: Download JSON, Copy to Clipboard, Integrate via API
- **Used For**: Product pages, blog posts about features, documentation

#### `twitter-card.png` (1200x675px)
- **Purpose**: Twitter-optimized sharing image
- **Layout**: Horizontal banner with transformation visual
- **Key Elements**:
  - InvoicePipe logo
  - Headline: "Automate Invoice Data Extraction"
  - Visual: Messy PDF → Clean JSON transformation
  - Bottom stats: 10,000+ Invoices Processed, 98.3% Accuracy, 5-16s Speed
- **Used For**: Twitter/X posts, tweets, social media campaigns

#### `og-square.png` (1200x1200px)
- **Purpose**: Square format for platforms that prefer 1:1 ratio
- **Layout**: Centered logo with corner badges
- **Key Elements**:
  - Large InvoicePipe logo and icon
  - "AI Invoice Extraction" subtitle
  - Four corner badges: 98.3% Accuracy, Australian-First, 5-16s Speed, 10K+ Invoices
- **Used For**: Instagram, WhatsApp, some LinkedIn posts

### Product Assets

#### `product-screenshot.png` (1200x630px)
- **Purpose**: Full product interface screenshot
- **Layout**: Complete dashboard view
- **Key Elements**:
  - Navigation bar with InvoicePipe branding
  - Split-screen: PDF viewer + extraction results panel
  - Color-coded extracted fields with confidence scores
  - Action buttons at bottom
- **Used For**: Product documentation, tutorials, marketing materials, press kit

## Design Specifications

### Color Palette
- **Primary Purple**: `#42107a` (background)
- **Emerald Accent**: `#10b981` (CTAs, success states)
- **Fuchsia Accent**: `#e95cff` (highlights, gradients)
- **Dark Cards**: `rgba(255, 255, 255, 0.1)` (overlays)
- **Text**: White (`#ffffff`) with high contrast

### Typography
- **Font Family**: Geist Sans (consistent with website)
- **Headline**: Bold, 48-72px
- **Subtitle**: Regular, 24-36px
- **Body/Stats**: Regular, 18-24px

### Brand Elements
- Dark purple gradient backgrounds
- Circuit board/tech patterns
- Emerald and fuchsia accent colors
- Modern, professional aesthetic
- High contrast for readability

## Usage in Code

### Next.js Metadata (app/layout.tsx)

```typescript
export const metadata = {
  openGraph: {
    images: [
      {
        url: "/og-hero.png",
        width: 1200,
        height: 630,
        alt: "InvoicePipe – AI-powered invoice extraction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-card.png"],
  },
};
```

### HTML Meta Tags

```html
<!-- Open Graph -->
<meta property="og:image" content="https://invoicepipe.site/og-hero.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="InvoicePipe – AI-powered invoice extraction" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://invoicepipe.site/twitter-card.png" />
```

## Platform Requirements

### Facebook / LinkedIn
- **Recommended Size**: 1200x630px ✅ `og-hero.png`
- **Aspect Ratio**: 1.91:1
- **Min Size**: 600x315px
- **Max File Size**: 8MB
- **Format**: PNG, JPG

### Twitter/X
- **Recommended Size**: 1200x675px ✅ `twitter-card.png`
- **Aspect Ratio**: 16:9
- **Min Size**: 600x335px
- **Max File Size**: 5MB
- **Format**: PNG, JPG, WEBP

### WhatsApp / Telegram
- **Recommended Size**: 1200x1200px ✅ `og-square.png`
- **Aspect Ratio**: 1:1
- **Format**: PNG, JPG

### Slack / Discord
- **Recommended Size**: 1200x630px ✅ `og-hero.png`
- **Aspect Ratio**: 1.91:1
- **Format**: PNG, JPG

## Testing OG Images

### Online Tools
1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **OpenGraph.xyz**: https://www.opengraph.xyz/

### Local Testing
```bash
# View metadata
curl -s https://invoicepipe.site | grep -i "og:image"

# Test with social media preview tools
# Use browser extensions like "Social Share Preview"
```

## Updating Images

### Regenerating Images

If you need to update the OG images:

1. **Update the prompts** in the generation script
2. **Regenerate** using AI image generation
3. **Optimize** file sizes (aim for < 1MB)
4. **Test** on all major platforms
5. **Clear caches** on social media platforms

### Optimization

```bash
# Optimize PNG files
pngquant --quality=80-95 og-hero.png -o og-hero-optimized.png

# Or use ImageOptim, TinyPNG, etc.
```

## File Sizes

| File | Size | Optimized |
|------|------|-----------|
| og-hero.png | 1.1 MB | ✅ |
| og-demo.png | 1.2 MB | ✅ |
| twitter-card.png | 1.2 MB | ✅ |
| og-square.png | 1.2 MB | ✅ |
| product-screenshot.png | 1.1 MB | ✅ |

All files are under the 5MB limit for most platforms.

## Best Practices

### Image Content
- ✅ Clear, readable text (minimum 24px)
- ✅ High contrast for visibility
- ✅ Consistent branding
- ✅ No critical text near edges (safe zone: 40px)
- ✅ Optimized file size (< 1MB preferred)

### Metadata
- ✅ Always include `alt` text
- ✅ Specify dimensions
- ✅ Use absolute URLs
- ✅ Test on multiple platforms
- ✅ Update cache when images change

### Accessibility
- ✅ Descriptive alt text
- ✅ High contrast ratios (4.5:1 minimum)
- ✅ Readable font sizes
- ✅ Clear visual hierarchy

## Troubleshooting

### Image Not Showing
1. Check file exists at `/public/og-hero.png`
2. Verify absolute URL in metadata
3. Clear social media cache (use debugging tools)
4. Check file size (< 5MB)
5. Verify image format (PNG/JPG)

### Wrong Image Showing
1. Clear platform cache using debugging tools
2. Wait 24-48 hours for cache to expire
3. Check metadata in HTML source
4. Verify `metadataBase` URL is correct

### Image Cropped Incorrectly
1. Check aspect ratio matches platform requirements
2. Keep important content in center
3. Use safe zones (40px margin)
4. Test on multiple platforms

## Additional Resources

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/webmasters)
- [LinkedIn Post Inspector](https://www.linkedin.com/help/linkedin/answer/a521928)

---

**Generated**: December 9, 2025  
**Version**: 1.0  
**Maintainer**: InvoicePipe Team
