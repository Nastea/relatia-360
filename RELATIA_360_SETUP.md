# Relația 360 - Setup Instructions

## Images Setup

To add the images for the course page:

1. Create an `images` folder in the `public` directory:
   ```bash
   mkdir -p app/public/images
   ```

2. Copy the images from `/poze lilia/` to `/app/public/images/`:
   ```bash
   cp "/Users/anastasiaionas/Apps/poze lilia/IMG_0646.JPG" app/public/images/
   cp "/Users/anastasiaionas/Apps/poze lilia/IMG_0650.JPG" app/public/images/
   cp "/Users/anastasiaionas/Apps/poze lilia/IMG_0651.JPG" app/public/images/
   ```

3. Update the image reference in `/src/app/relatia-360/page.tsx`:
   - Uncomment the `<Image>` component
   - Update the `src` path to match the image you want to use (e.g., `/images/IMG_0646.JPG`)
   - Remove the placeholder div

## Viewing the Page

1. Start the development server:
   ```bash
   cd app
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/relatia-360`

## Color Scheme

The page uses a color scheme inspired by the PDF:
- **Dark Charcoal/Grey**: `neutral-800`, `neutral-900` for backgrounds
- **Red Accents**: `red-600` for CTAs and highlights
- **Warm Tones**: `amber-50`, `amber-200` for subtle backgrounds
- **Professional**: Clean whites and soft neutrals

## Customization

- Update the CTA button link in the final section
- Add more images throughout the page if needed
- Adjust colors in Tailwind classes to match your brand

