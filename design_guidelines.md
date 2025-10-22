# Roby Club Webapp - Design Guidelines

## Design Approach

**Selected Approach:** Design System-Based (Modern SaaS Dashboard)
**Primary Reference:** Linear, Notion, Vercel Dashboard aesthetics
**Justification:** This is a utility-focused admin interface requiring efficiency, clarity, and consistent patterns for daily operations by daycare staff.

---

## Core Design Elements

### A. Typography

**Font Family:**
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for ID numbers and timestamps)

**Hierarchy:**
- Page Titles: 2xl, semibold (Dashboard header)
- Section Headers: xl, semibold (Active Children, Registration)
- Card Titles: base, medium (Child names)
- Body Text: sm, normal (Parent info, pickup times)
- Labels: xs, medium, uppercase tracking-wide (Form labels)
- Metadata: xs, normal, muted (IDs, timestamps)

### B. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, and 12
- Component padding: p-6
- Card spacing: space-y-4
- Section gaps: gap-6 or gap-8
- Page margins: px-8, py-6

**Grid Structure:**
- Sidebar: Fixed 64 width (w-64)
- Main content: flex-1 with max-w-7xl container
- Child cards: grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6

---

## C. Component Library

### Layout Components

**Sidebar Navigation:**
- Fixed left sidebar with full height
- Navigation items with icon + label
- Active state with subtle left border accent (4px)
- Sections: Dashboard, Archived, Settings
- Bottom section: User profile card with avatar
- Width: 16rem (64)
- Padding: p-6

**Top Bar:**
- Sticky header (sticky top-0)
- Height: h-16
- Contains: Current date (left), search/filters (center), user menu (right)
- Shadow: shadow-sm for subtle depth
- Displays: "Today: [Date]" with clock icon

**Main Content Area:**
- Container: max-w-7xl mx-auto
- Padding: p-8
- Background: subtle texture or gradient overlay

### Child Management Components

**Registration Form Card:**
- Large card (rounded-xl) with shadow-md
- Form layout: Single column, full-width inputs
- Input spacing: space-y-6
- Field groups with clear labels above inputs
- Phone number with country code selector
- Time picker with clock icon
- Submit button: Full-width, prominent, rounded-lg
- Form height: Auto-expanding, not constrained

**Child Card (Active Dashboard):**
- Card dimensions: Flexible height, full-width within grid
- Border: Subtle border with rounded-xl
- Shadow: shadow-sm, hover:shadow-md transition
- Internal padding: p-6
- Structure:
  - Header: Child name (text-lg, font-semibold) + ID badge (rounded-full pill, monospace)
  - Details section: Parent phone(s) with phone icon, pickup time with clock icon
  - Status badge: Small rounded pill (e.g., "In Daycare")
  - Action buttons grid: 2x2 layout on mobile, 4 columns on desktop
  - Spacing: space-y-4 between sections

**Action Buttons:**
- Size: Full-width within card grid, py-3
- Border radius: rounded-lg
- Font: text-sm, font-medium
- Icon + Text layout with gap-2
- Four variants:
  1. Emergency: Red themed icon + text
  2. Child wishes pickup: Orange themed icon + text
  3. Pickup time reached: Blue themed icon + text
  4. Mark as Picked Up: Green themed icon + text
- Hover: Scale slightly (scale-105) with transition

### Status & Feedback Components

**Badge System:**
- ID Badge: Monospace font, px-3 py-1, rounded-full
- Status Badge: Text-xs, px-2.5 py-0.5, rounded-full
- Time badges: With clock icon prefix

**Empty States:**
- Centered container with icon (6-8 scale)
- Message text (text-lg)
- Subtext (text-sm, muted)
- Action button (if applicable)

---

## D. Responsive Behavior

**Breakpoints:**
- Mobile (base): Single column, stacked sidebar (drawer)
- Tablet (md): 2-column child cards, persistent sidebar option
- Desktop (xl): 3-column child cards, always-visible sidebar

**Mobile Adaptations:**
- Top bar: Hamburger menu for sidebar
- Child cards: Full-width, action buttons in 2x2 grid
- Form: Simplified spacing (p-4 instead of p-6)

---

## E. Interaction Patterns

**Navigation:**
- Sidebar items: Smooth hover states, active indication with left accent bar
- Transitions: All interactive elements use transition-all duration-200

**Form Behavior:**
- Input focus: Ring effect with offset
- Auto-generated ID: Display immediately after child name input blur
- Time picker: Native browser picker with fallback
- Validation: Inline error messages below fields

**Dashboard Actions:**
- Button clicks: Brief loading state (spinner) before confirmation
- Card removal: Slide-out animation when marked as picked up
- Real-time updates: Fade-in for new children added

**Micro-interactions:**
- Card hover: Subtle lift (shadow increase)
- Button hover: Slight scale-up
- Success actions: Brief green flash/border on parent card

---

## F. Information Architecture

**Dashboard View Priority:**
1. Stats overview (total children, upcoming pickups)
2. Active children grid (primary focus)
3. Quick registration shortcut

**Card Information Hierarchy:**
1. Child name + ID (most prominent)
2. Parent contact (critical for communication)
3. Pickup time (time-sensitive)
4. Status indicator
5. Action buttons (grouped by urgency)

---

## G. Accessibility Considerations

- All action buttons have clear icon + text labels
- High contrast text for readability
- Form inputs with associated labels and aria-labels
- Keyboard navigation support for all interactive elements
- Focus indicators on all focusable elements
- Screen reader announcements for status changes

---

## H. Images & Visual Assets

**Icons:**
- Use Heroicons (outline style) via CDN
- Icons needed: Calendar, Clock, Phone, Users, Bell, CheckCircle, ExclamationCircle, UserGroup, Cog, Archive
- Size: h-5 w-5 for buttons, h-6 w-6 for section headers

**No Hero Images Required:** This is a functional dashboard - no marketing hero section needed.

**Decorative Elements:**
- Subtle grid pattern in sidebar background
- Soft gradient overlay on main content background (very subtle)

---

## I. Special Considerations

**Time-Sensitive Display:**
- Pickup times approaching: Highlight card with pulsing border
- Overdue pickups: Stronger visual indicator (warmer accent)

**Daily Reset:**
- Clear visual indication of new day start
- Archive previous day's children automatically
- Display "Today's Date" prominently in top bar

**Multi-language Support (Future):**
- Reserve space for longer text in buttons
- Flexible card heights to accommodate text expansion

---

**Design Philosophy:** Create a calm, efficient workspace for daycare staff that reduces cognitive load while maintaining clear visual hierarchy. Prioritize speed of common actions (registration, pickup confirmation) with generous touch targets and obvious action states.