# CRM + Accounting Management System - Design Guidelines

## Design Principles

**Approach:** Modern Business Application System - prioritizing data density, efficient workflows, and professional polish.

**Core Principles:**
1. Clarity Over Decoration - scannable interfaces with clear hierarchy
2. Consistent Density - balance readability with efficiency
3. Professional Polish - enterprise-grade visual quality
4. Role-Aware Design - consistency across user contexts

---

## Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - UI, tables, body text
- Monospace: JetBrains Mono (Google Fonts) - IDs, invoice/quotation numbers

**Type Scale:**
```
Display (Dashboards):  text-3xl, font-bold, tracking-tight
Page Headers:          text-2xl, font-semibold
Section Headers:       text-xl, font-semibold
Card Titles:           text-lg, font-medium
Body Text:             text-base, font-normal
Secondary Text:        text-sm, font-normal
Table Headers:         text-xs, font-semibold, uppercase, tracking-wide
Table Data:            text-sm, font-normal
Labels:                text-sm, font-medium
Helper Text:           text-xs, font-normal
```

**Weights:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

---

## Layout & Spacing

**Spacing Scale:** Use 2, 3, 4, 6, 8, 12, 16, 20, 24 units consistently

**Common Applications:**
- Component padding: `p-4` or `p-6`
- Card padding: `p-6`
- Section spacing: `space-y-6` or `space-y-8`
- Form gaps: `space-y-4`
- Table cells: `px-4 py-3`
- Buttons: `px-4 py-2` (medium), `px-6 py-3` (large)
- Icon-text: `gap-2`

**Page Structure:**
```
Fixed Sidebar (w-64) + Main Content (flex-1)
├─ Navbar: h-16, border-b, px-6
├─ Page Container: p-6 to p-8, max-w-7xl mx-auto
   ├─ Page Header: mb-6, title + actions (right-aligned)
   ├─ Content Area: space-y-6
   └─ Pagination (if needed)
```

**Grid Systems:**
- Dashboard: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Features: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Forms: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Client Cards: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`

**Container Widths:** Dashboard/Tables: max-w-7xl, Forms: max-w-4xl, Details: max-w-5xl

---

## Components

### Navigation

**Sidebar:**
- Fixed, w-64, h-screen, border-r
- Logo: h-16, px-6, border-b
- Menu: py-4, px-3, items with `px-3 py-2 rounded-lg gap-3`
- Role badge: px-6 py-4, border-t (bottom)
- Mobile: Drawer overlay with backdrop

**Navbar:**
- h-16, border-b, px-6
- Hamburger (mobile), user dropdown with avatar (w-8 h-8, rounded-full)

### Dashboard

**Summary Cards:**
```
p-6, rounded-lg, border, shadow-sm
├─ Icon: w-12 h-12, rounded-lg, centered
├─ Label: text-sm, font-medium
├─ Value: text-2xl, font-bold, mt-2
└─ Trend: text-xs, mt-1 (with arrow icon)
```

**Chart Cards:**
- p-6, rounded-lg, border, shadow-sm
- Title: text-lg, font-semibold, mb-4
- Chart: h-64 to h-80 or aspect-video
- Use Chart.js with minimal styling

**Activity Feed:**
- List: divide-y, border, rounded-lg
- Items: p-4, flex gap-3
  - Icon/Avatar: w-8 h-8, rounded-full
  - Content: flex-1, text-sm (action), text-xs (meta)

### Tables

**Structure:**
```
Container: overflow-x-auto, border, rounded-lg, shadow-sm
├─ Table: w-full, text-sm
├─ Header: border-b, px-4 py-3, text-xs uppercase
├─ Rows: border-b, hover state, px-4 py-3
└─ Pagination: px-4 py-3, border-t, flex justify-between
```

**Features:**
- Search: w-full md:max-w-sm, px-3 py-2, border, rounded-lg
- Filters: inline-flex gap-2 above table
- Actions: icon buttons (w-8 h-8) in rows
- IDs/numbers: whitespace-nowrap, font-mono

### Status Badges

**Base:** `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`

**Categories:** Lead Status, Quotation Status, Invoice Status (Generated/Sent/Paid/Overdue/Partially Paid), Ticket Priority, Ticket Status

### Forms

**Layout:**
```
Container: max-w-2xl to max-w-4xl
├─ Card: p-6, border, rounded-lg, shadow-sm
├─ Fields: space-y-4
└─ Actions: flex gap-3 justify-end
```

**Fields:**
- Label: block, text-sm, font-medium, mb-1 (asterisk for required)
- Input: w-full, px-3 py-2, border, rounded-lg, text-sm
- Helper/Error: text-xs, mt-1
- Focus: ring states

**Line Items (Quotations):**
- Table layout: Description (flex-1), Quantity (w-24), Unit Price (w-32), Amount (w-32), Actions (w-12)
- Auto-calculated amounts
- "Add Item" button below

**Actions:**
- Primary: px-6 py-2.5, rounded-lg, font-medium
- Secondary: px-6 py-2.5, rounded-lg, border, font-medium
- Loading: disabled with spinner

### Detail Pages

**Header:**
```
flex justify-between items-start mb-6
├─ Left: text-2xl font-bold + subtitle
└─ Right: action buttons (flex gap-2)
```

**Quotation/Invoice:**
- Number: text-lg, font-mono, font-semibold
- Client details: grid grid-cols-2 gap-4
- Line items: full-width table
- Totals: max-w-xs ml-auto, flex justify-between rows

**Timeline:**
- Vertical with left border, pl-6 pb-6 items
- Timestamp dot: absolute left-0, w-3 h-3, rounded-full, border-4
- Add note form at bottom

### Modals

**Structure:**
```
Backdrop: fixed inset-0
Modal: fixed inset-0 flex items-center justify-center p-4
├─ Content: max-w-md to max-w-2xl, rounded-lg, shadow-xl
   ├─ Header: px-6 py-4, border-b (title + close button)
   ├─ Body: p-6
   └─ Footer: px-6 py-4, border-t, flex justify-end gap-3
```

**Sizes:** Form: max-w-md, Confirmation: max-w-sm, Detail: max-w-2xl

### Buttons

**Variants:**
- Primary: px-4 py-2, rounded-lg, font-medium, shadow-sm
- Secondary: px-4 py-2, rounded-lg, border, font-medium
- Ghost: px-4 py-2, rounded-lg (hover background only)
- Icon: w-8 h-8 to w-10 h-10, rounded, centered

**Sizes:** Small: px-3 py-1.5 text-sm, Medium: px-4 py-2 text-sm, Large: px-6 py-3 text-base

**States:** Hover (subtle transform/shadow), Loading (disabled + spinner), Disabled (opacity-50, cursor-not-allowed)

### Cards

**Standard:** `p-6 border rounded-lg shadow-sm`
- Header: pb-4 border-b mb-4 (when needed)
- Title: text-lg font-semibold
- Actions: flex gap-2 justify-end

**Clickable:** Add hover:shadow-md, cursor-pointer

---

## Responsive Design

**Breakpoints:** Mobile <640px, Tablet 640-1024px, Desktop 1024px+

**Mobile:**
- Sidebar → overlay drawer (hamburger toggle)
- Tables → horizontal scroll
- Dashboard → grid-cols-1
- Forms → single column
- Navbar → condensed

**Tablet:**
- Dashboard → 2-column grid
- Forms → 2-column where appropriate

---

## User Feedback

**Toast Notifications:**
- Position: fixed top-4 right-4 z-50
- Container: max-w-sm p-4 rounded-lg shadow-lg border-l-4
- Content: flex gap-3 (icon w-5 h-5 + text-sm)
- Auto-dismiss: 4-5s
- Variants: Success, Error, Warning, Info

**Loading:**
- Full page: fixed inset-0 centered with backdrop
- Inline: animate-spin w-4 h-4 to w-6 h-6
- Skeleton: animate-pulse for tables/cards

**Empty States:**
- Centered: text-center py-12
- Icon: w-12 h-12 mx-auto mb-4
- Title: text-lg font-medium
- Description: text-sm max-w-sm mx-auto mt-2
- Action: mt-4

**Confirmation Dialogs:**
- Modal with warning icon
- Clear description
- Cancel (secondary) + Confirm (primary/danger)

---

## Images & Assets

**Dashboard:** Abstract business/analytics illustrations for empty states (centered)

**Avatars:** Professional placeholders (initials or generic icons), w-12 h-12 or w-16 h-16, rounded-full

**No Heroes:** Focus on functional interfaces, not marketing sections