# Rial Design System

## 1. Visual Theme & Atmosphere

Rial is a bold, confident fintech platform for Venezuela that communicates financial empowerment through strong typography and a distinctive lime-green accent. The design operates on a clean white canvas with near-black text (`#161616`) and a signature Rial Green (`#ACE524`) — a vibrant, energetic lime that feels modern and optimistic.

The typography uses a dual-font system: **Sora** for display and headings, and **Google Sans** for body text and UI elements. Sora is a geometric sans-serif with clean, rounded forms that project authority and modernity at large sizes. Google Sans handles readability and accessibility for paragraphs, buttons, links, and all interactive elements.

**Key Characteristics:**
- Sora ExtraBold (800) for titles and headings — bold, geometric, authoritative
- Google Sans for body, buttons, links, captions — clean and readable
- Rial Green (`#ACE524`) accent with Carbón (`#161616`) text on green
- Near-black Carbón (`#161616`) as primary text color
- Scale(1.05) hover animations — buttons physically grow
- Pill buttons (9999px) and large rounded cards (16px–40px)
- Ring shadows instead of traditional box shadows

## 2. Color Palette & Roles

### Brand Colors

| Name | Hex | Role |
|------|-----|------|
| **Carbón** | `#161616` | Primary text, dark backgrounds, button text on green |
| **Bolívar** | `#2D3B44` | Secondary text, descriptions, nav items |
| **Cambio** | `#8E9399` | Muted text, captions, placeholders, icons |
| **Claro** | `#EEEEEE` | Light surfaces, dividers, progress bar tracks |
| **Rial** | `#ACE524` | Primary CTA, brand accent, highlights |

### Tint Scale

Each color has percentage tints for flexibility:

| Color | 100% | 80% | 60% | 40% | 20% |
|-------|------|-----|-----|-----|-----|
| Carbón | `#161616` | `#454545` | `#737373` | `#a2a2a2` | `#d0d0d0` |
| Bolívar | `#2D3B44` | `#576269` | `#828a8f` | `#acb1b4` | `#d5d8da` |
| Cambio | `#8E9399` | `#a5a9ad` | `#bbbec2` | `#d2d4d6` | `#e8e9eb` |
| Claro | `#EEEEEE` | `#f1f1f1` | `#f5f5f5` | `#f8f8f8` | `#fcfcfc` |
| Rial | `#ACE524` | `#bdea50` | `#cdef7c` | `#def5a7` | `#eefad3` |

### Semantic Colors

- **Success**: Rial Green (`#ACE524`) or a darker green for text
- **Danger/Error**: Red (`#d03238`)
- **Warning**: Yellow (`#ffd11a`)

## 3. Typography Rules

### Font Families

- **Display / Headings**: `Sora` — geometric, rounded, high legibility at large sizes
- **Body / UI**: `Google Sans` — clean, accessible, optimized for reading and interactive elements

### Hierarchy

| Role | Font | Size | Weight | Line Height | Use |
|------|------|------|--------|-------------|-----|
| Display Hero | Sora | clamp(2.5rem, 5vw, 6rem) | 800 (ExtraBold) | 0.95 | Main hero headline |
| Section Heading | Sora | clamp(2.5rem, 5vw, 4rem) | 800 (ExtraBold) | 0.95 | Section titles |
| Feature Title | Sora | 2rem–2.5rem | 800 (ExtraBold) | 0.95 | Feature/card headings |
| Sub-heading | Sora | 1.5rem | 500 (Medium) | 1.2 | Subsection titles |
| Body Large | Google Sans | 1.125rem (18px) | 400 (Regular) | 1.5 | Hero descriptions, intros |
| Body | Google Sans | 1rem (16px) | 400 (Regular) | 1.5 | Paragraphs, descriptions |
| Body Medium | Google Sans | 1rem (16px) | 500 (Medium) | 1.5 | Emphasis in paragraphs |
| Button | Google Sans | 0.875rem (14px) | 500 (Medium) | 1.0 | All buttons, CTAs |
| Link | Google Sans | inherit | 500 (Medium) | inherit | Navigation, inline links |
| Caption | Google Sans | 0.75rem (12px) | 400 (Regular) | 1.5 | Labels, timestamps, muted info |
| Small | Google Sans | 0.625rem (10px) | 400–500 | 1.2 | Fine print, badges |

### Sora Weights Used

| Weight | Name | Use |
|--------|------|-----|
| 100 | Thin | Decorative only |
| 400 | Regular | Subheadings if needed |
| 500 | Medium | Secondary headings |
| 800 | ExtraBold | All display headings and titles |

### Google Sans Weights Used

| Weight | Name | Use |
|--------|------|-----|
| 400 | Regular | Body text, captions |
| 500 | Medium | Buttons, links, emphasis |

### Principles

- **Sora 800 as identity**: ExtraBold is used for all headings — bold, geometric, authoritative
- **Google Sans for clarity**: All readable/interactive text uses Google Sans for maximum accessibility
- **0.95 line-height on headings**: Tight but not overlapping — creates dense, impactful title blocks
- **1.5 line-height on body**: Comfortable reading rhythm for paragraphs

## 4. Component Stylings

### Buttons

**Primary Green Pill**
- Background: `#ACE524` (Rial Green)
- Text: `#161616` (Carbón)
- Font: Google Sans, 500
- Padding: 8px 20px
- Radius: 9999px
- Hover: scale(1.05)
- Active: scale(0.95)

**Secondary Subtle Pill**
- Background: `rgba(22, 22, 22, 0.08)` (Carbón at 8% opacity)
- Text: `#161616` (Carbón)
- Font: Google Sans, 500
- Padding: 8px 16px
- Radius: 9999px
- Same scale hover/active behavior

### Cards & Containers
- Radius: 16px (small), 20px (medium), 30px (large), 40px (hero)
- Shadow: `rgba(22,22,22,0.12) 0px 0px 0px 1px` (ring shadow only)
- No traditional box-shadows

### Navigation
- Font: Google Sans, 500 for nav items
- Text color: Bolívar (`#2D3B44`), hover: Carbón (`#161616`)
- Icon color: Cambio (`#8E9399`)
- Pill CTAs right-aligned

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Common values: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Border Radius Scale
- Small (16px): Cards inside phone frames, small elements
- Medium (20px): Rial Card, medium cards
- Large (30px): Floating cards, mobile menu
- Hero (40px): Hero image container
- Pill (9999px): All buttons
- Circle (50%): Icons, avatars

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Default |
| Ring (Level 1) | `rgba(22,22,22,0.12) 0px 0px 0px 1px` | Card borders, navbar, dividers |

**Shadow Philosophy**: Rial uses minimal shadows — ring shadows only. Depth comes from the bold green accent against the neutral canvas.

## 7. Do's and Don'ts

### Do
- Use Sora weight 800 for ALL headings — the geometric boldness IS the brand
- Use Google Sans for ALL body text, buttons, links, and UI elements
- Use Rial Green (`#ACE524`) for primary CTAs with Carbón (`#161616`) text
- Apply scale(1.05) hover and scale(0.95) active on buttons
- Use Bolívar (`#2D3B44`) for secondary/description text
- Use Cambio (`#8E9399`) for muted/caption text
- Use ring shadows only

### Don't
- Don't use Sora for body text or buttons — that's Google Sans territory
- Don't use Google Sans for headings — that's Sora territory
- Don't use Rial Green as background for large surfaces — it's for buttons and accents
- Don't skip the scale animation on buttons
- Don't use traditional box-shadows — ring shadows only
- Don't use font weights not listed (e.g., Sora 600 or Google Sans 700)

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, clamp scales down headings |
| Tablet | 640–1024px | 2-column where appropriate |
| Desktop | 1024–1440px | Full layout |
| Large | >1440px | max-w-7xl centered |

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary text: Carbón (`#161616`)
- Secondary text: Bolívar (`#2D3B44`)
- Muted text: Cambio (`#8E9399`)
- Light surface: Claro (`#EEEEEE`)
- Accent/CTA: Rial (`#ACE524`)
- Background: White (`#ffffff`)

### Quick Font Reference
- Headings: Sora, weight 800, line-height 0.95
- Body: Google Sans, weight 400, line-height 1.5
- Buttons/Links: Google Sans, weight 500

### Example Component Prompts
- "Create hero: white background. Headline with Sora weight 800, clamp(2.5rem,5vw,6rem), line-height 0.95, #161616 text. Description with Google Sans weight 400, 18px, #2D3B44. Green pill CTA (#ACE524, 9999px radius, Google Sans 500, #161616 text). Hover: scale(1.05)."
- "Build a card: 30px radius, ring shadow rgba(22,22,22,0.12) 0px 0px 0px 1px. Title with Sora 800, body with Google Sans 400 #2D3B44."
