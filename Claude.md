# CLAUDE.md — Project Context

This file provides essential context for AI agents working on this project.

---

## 🚨 CRITICAL: Always Research Latest Versions

**Before implementing ANY feature or installing ANY package:**

1. **Search for the LATEST version** of frameworks, libraries, and tools
2. **NEVER assume older versions** — always verify current releases
3. **Check breaking changes** between versions
4. **Use official documentation** for the most recent stable release
5. **Use Context7 to fetch official documentation** for accurate, up-to-date information

**Research pattern:**
```
"[package-name] latest version 2025"
"[framework] [version] migration guide"
"[tool] latest features"
```

**Use Context7 for documentation:**
```
@context7 [framework-name] [specific-topic]
```

Examples:
- `@context7 next.js app router`
- `@context7 framer-motion scroll animations`
- `@context7 tailwind css v4 configuration`
- `@context7 react-three-fiber getting started`

**If you find a NEWER version than what's in this file:**
- Use the newer version (unless explicitly pinned)
- Check migration guides via Context7
- Update patterns to match latest best practices

---

## Project Overview

**Name**: [Project Name]  
**Description**: [Brief 1-2 sentence description]  
**Type**: [Web App / CLI Tool / Library / etc.]

---

## Tech Stack

### Core
- **Next.js**: 16.0.5 (App Router, Turbopack default)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Node.js**: 20+ recommended

### Styling
- **Tailwind CSS**: 4.x (CSS-first configuration)
- **UI Components**: shadcn/ui, Radix UI

### Linting & Formatting
- **ESLint**: 9.x
- **Prettier**: Latest

---

## 🎨 State-of-the-Art UI & Animation (ALWAYS USE)

**These libraries should be your default choice for UI/UX:**

### Animation & Motion
- **Framer Motion** — Use for ALL animations, page transitions, gestures
  - Prefer `motion.*` components over plain HTML
  - Use `AnimatePresence` for exit animations
  - Leverage `useScroll`, `useTransform` for scroll effects

### Design Inspiration & Patterns
- **Mobbin** — Reference for mobile/web UI patterns
  - Study before building new features
  - Use for inspiration on interactions and flows

### Component Patterns
- **React Bits** — Modern React patterns and best practices
  - Use recommended patterns for state management
  - Follow component composition guidelines

### 3D & WebGL
- **Three.js** (via @react-three/fiber + @react-three/drei)
  - Use for 3D graphics, WebGL effects
  - Prefer R3F's declarative API over vanilla Three.js
  - Use `drei` helpers for common 3D patterns

### Additional State-of-the-Art Tools
- **GSAP** — For complex timeline animations
- **Lottie** (lottie-react) — For designer-created animations
- **Rive** — For interactive animations
- **React Spring** — For physics-based animations (alternative to Framer Motion)
- **Auto-Animate** — For automatic list/layout animations

**Installation example:**
```bash
npm install framer-motion @react-three/fiber @react-three/drei three
npm install gsap lottie-react @formkit/auto-animate
```

**Default animation pattern:**
```tsx
import { motion } from 'framer-motion';

export function Component() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  );
}
```

---

## Critical: Tailwind CSS v4

**Tailwind v4 uses CSS-first configuration. There is NO `tailwind.config.js` or `tailwind.config.ts` file.**

### Configuration lives in `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --color-primary: oklch(0.70 0.17 162);
  --shadow-glow: 0 20px 50px oklch(0.70 0.17 162 / 0.3);
}

@utility glass {
  background: oklch(1 0 0 / 0.05);
  backdrop-filter: blur(20px);
}
```

### Tailwind v4 syntax rules:

| Do this (v4) | Not this (v3) |
|--------------|---------------|
| `@import "tailwindcss"` | `@tailwind base; @tailwind components; @tailwind utilities;` |
| `@theme { --color-brand: #fff; }` | `tailwind.config.js → theme.extend.colors` |
| `@utility my-util { ... }` | `@layer utilities { .my-util { ... } }` |
| `bg-(--my-var)` | `bg-[var(--my-var)]` |
| `shadow-xs` | `shadow-sm` |
| `shadow-sm` | `shadow` |
| `rounded-xs` | `rounded-sm` |
| `rounded-sm` | `rounded` |
| `ring-3` | `ring` |

### PostCSS config (`postcss.config.mjs`):

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Important:** `postcss-import` and `autoprefixer` are NOT needed — Tailwind v4 handles them.

---

## Critical: Next.js 16

### Removed features:
- `next lint` command removed — use `eslint` directly
- `middleware.ts` deprecated — use `proxy.ts` instead

### Default behaviors:
- Turbopack is the default bundler (no flag needed)
- App Router is standard
- React 19.2 features available (View Transitions, useEffectEvent, Activity)

### Async params required in pages:

```tsx
// Correct (Next.js 16)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div>{slug}</div>;
}

// Wrong (Next.js 15 style)
export default function Page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>;
}
```

---

## tsconfig.json (Next.js 16 default)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

**Key settings:**
- `"jsx": "react-jsx"` — New JSX transform, no React import needed
- `"moduleResolution": "bundler"` — Modern bundler resolution
- Includes `.next/dev/types/**/*.ts` and `**/*.mts`

---

## Common Gotchas

1. **No tailwind.config.js** — All config in `globals.css` via `@theme`
2. **Utility renames** — `shadow-sm` is now `shadow-xs`, `shadow` is now `shadow-sm`
3. **CSS variable syntax** — Use `bg-(--var)` not `bg-[var(--var)]`
4. **Async params** — Page params are Promises in Next.js 16
5. **No next lint** — Use `eslint` command directly
6. **React imports** — Not needed for JSX (`jsx: "react-jsx"`)

---

## Project Structure

```
app/
├── layout.tsx      # Root layout with fonts
├── page.tsx        # Home page
├── globals.css     # Tailwind v4 config + styles
└── [routes]/       # App Router pages

components/         # React components
lib/                # Utilities and helpers
public/             # Static assets
```

---

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (not next lint)
```

---

## Package Installation

When adding packages, use exact commands:

```bash
npm install <package>        # Dependencies
npm install -D <package>     # Dev dependencies
```

**Do NOT modify existing package versions unless explicitly asked.**

---

## Code Patterns & Conventions

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `types.ts` or `*.types.ts`
- Route files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

### Import Order
```typescript
// 1. React (if needed for hooks/types)
import { useState } from 'react';

// 2. Next.js
import Image from 'next/image';
import Link from 'next/link';

// 3. External packages
import { motion } from 'framer-motion';

// 4. Internal modules
import { cn } from '@/lib/utils';

// 5. Components
import { Button } from '@/components/ui/button';

// 6. Types
import type { Props } from './types';

// 7. Styles (if any separate CSS modules)
import styles from './styles.module.css';
```

### Component Structure
```typescript
// Server Component (default in Next.js 16)
export default function Component() {
  return <div>Server-rendered content</div>;
}

// Client Component (when needed)
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState(false);
  return <button onClick={() => setState(!state)}>Toggle</button>;
}
```

### Async Server Components
```typescript
// Fetch data directly in Server Components
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const json = await data.json();
  
  return <div>{json.title}</div>;
}
```

---

## When in Doubt

1. **Use Context7 to fetch documentation** (`@context7 [framework] [topic]`)
2. **Search for LATEST documentation** (2025 versions)
3. Check the user's `package.json` for exact versions
4. Use Tailwind v4 syntax, not v3
5. Use Next.js 16 patterns, not 15
6. Review existing similar code in the project
7. Ask for clarification before making assumptions

**Never assume a package version — always research the latest stable release first.**  
**Context7 is your first stop for accurate documentation.**

---

## Notes for AI Agents

- **Code style**: [Prefer functional/OOP, etc.]
- **Response format**: [Concise explanations, verbose, etc.]
- **Testing**: [Always include tests / Tests optional]
- **Documentation**: [Update inline comments / Separate docs]

### UI/UX Requirements
- **ALWAYS use Framer Motion** for animations (never plain CSS transitions)
- **Reference Mobbin** before building new UI patterns
- **Follow React Bits** patterns for component composition
- **Consider Three.js** for 3D elements or immersive experiences
- **Prioritize smooth animations** — 60fps minimum, use `will-change` wisely
- **Mobile-first responsive** — test on mobile breakpoints first
- **Accessibility** — semantic HTML, ARIA labels, keyboard navigation

### Research-First Approach
1. **Use Context7** to fetch official documentation (`@context7 [framework] [topic]`)
2. **Always search for latest versions** before suggesting packages
3. **Check release notes** for breaking changes
4. **Use latest patterns** from official docs
5. **Verify compatibility** with project's dependencies

**Context7 is your primary documentation source** - use it to get accurate, current information directly from official docs.
