# BDC Projects Setup Guide

This guide will help you set up both BDC projects with Tailwind CSS and shadcn/ui using the Sky theme.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Project Structure

```
bdc-projects/
├── bdc-competitive/     # Competitive analysis dashboard (port 3000)
├── bdc-assessment/      # Assessment dashboard (port 3001)
├── landing-page/        # Landing page project
├── netlify-migration/   # Netlify migration files
└── SETUP.md            # This file
```

## Setup Instructions

### 1. Install Dependencies

For **BDC Competitive** project:
```bash
cd bdc-competitive
npm install
```

For **BDC Assessment** project:
```bash
cd bdc-assessment
npm install
```

### 2. TypeScript Configuration

Create `tsconfig.json` in each project root:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. Next.js Configuration

Create `next.config.js` in each project root:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

### 4. PostCSS Configuration

Create `postcss.config.js` in each project root:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 5. Add shadcn/ui Components

Run these commands in each project directory to add all required components:

```bash
# Essential UI components
npx shadcn-ui@latest add avatar badge button calendar card checkbox
npx shadcn-ui@latest add command dialog dropdown-menu input label
npx shadcn-ui@latest add popover select separator sheet switch
npx shadcn-ui@latest add table tabs textarea tooltip
npx shadcn-ui@latest add chart navigation-menu scroll-area
```

### 6. Start Development Servers

**BDC Competitive** (port 3000):
```bash
cd bdc-competitive
npm run dev
```

**BDC Assessment** (port 3001):
```bash
cd bdc-assessment
npm run dev
```

## Sky Theme Usage

The projects are configured with a Sky color theme. Here's how to use it:

### CSS Variables (Recommended)
```tsx
<Button className="bg-primary text-primary-foreground">
  Primary Button
</Button>
```

### Direct Tailwind Classes
```tsx
<div className="bg-sky-50 text-sky-900 border-sky-200">
  Sky themed content
</div>
```

### Sky Color Palette
- `sky-50` to `sky-950` - Light to dark variations
- Primary color is set to `sky-400` (`#38bdf8`)

## File Structure After Setup

```
bdc-competitive/
├── app/
│   ├── globals.css          # Tailwind + Sky theme
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── dashboard/           # Custom dashboard components
│       └── main-nav.tsx
├── lib/
│   └── utils.ts            # Utility functions
├── package.json
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json
```

## Troubleshooting

### Import Issues
If you get import errors, make sure your `tsconfig.json` has the correct path mapping:
```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./*"]
  }
}
```

### CSS Not Loading
Ensure `globals.css` is imported in your root layout:
```tsx
import './globals.css'
```

### Components Not Found
Run the shadcn/ui add commands from the project root directory where `package.json` is located.

## Next Steps

1. Place your Google Gemini HTML files in the appropriate project directories
2. Convert HTML content to Next.js components
3. Apply the Sky theme classes to match your design
4. Test locally before deploying to VPS

## Development URLs

- BDC Competitive: http://localhost:3000
- BDC Assessment: http://localhost:3001