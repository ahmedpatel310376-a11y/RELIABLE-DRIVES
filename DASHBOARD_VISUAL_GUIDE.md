# Admin Dashboard - Visual Structure

## 📐 Layout Blueprint

```
┌────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD HEADER                      │
│  Inventory Control | Admin Dashboard | [Brand Logo]            │
│  Manage your car inventory, listings, and customer enquiries   │
└────────────────────────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ TOTAL    │ AVAIL    │ RESERVED │ SOLD     │ FEATURED │
│ CARS     │ ABLE     │          │          │          │
│ [count]  │ [count]  │ [count]  │ [count]  │ [count]  │
│ 📦       │ ✓        │ ⏱️       │ ⚠️       │ ⭐       │
└──────────┴──────────┴──────────┴──────────┴──────────┘

┌────────────────────────────────────────────────────────────────┐
│ [📦 INVENTORY MANAGEMENT] [💬 CUSTOMER ENQUIRIES]              │
└────────────────────────────────────────────────────────────────┘

INVENTORY TAB ACTIVE:
┌──────────────────────────────────────────────────────────────────┐
│ Filter Inventory                                                 │
│ ┌──────────┬──────────┬──────────┬──────────┬──────────┐        │
│ │ Brand    │ Location │ Status   │ Featured │ Reset   │ Apply  │
│ │ ________│ ________│ ________│ ________│ _______ │ _____ │
│ └──────────┴──────────┴──────────┴──────────┴──────────┴────────┘
└──────────────────────────────────────────────────────────────────┘

CONTENT AREA (XL SCREENS):
┌────────────────────────────────┬─────────────────────────────────┐
│   ADD NEW CAR / EDIT CAR        │   ALL CARS TABLE                 │
│                                 │                                 │
│  [Car Form]                     │  ┌─────────────────────────┐   │
│  - Title                        │  │ Car │Price│Status│Act  │   │
│  - Brand                        │  ├─────────────────────────┤   │
│  - Price                        │  │ [📷] │ ₹X │ ✓    │ ✎ 🗑 │   │
│  - Year                         │  │ [📷] │ ₹Y │ ⏱️   │ ✎ 🗑 │   │
│  - Fuel Type                    │  │ [📷] │ ₹Z │ ❌   │ ✎ 🗑 │   │
│  - Transmission                 │  │              ...          │   │
│  - Body Type                    │  └─────────────────────────┘   │
│  - Seating                      │                                 │
│  - Location                     │  [Previous] [1][2][3] [Next]   │
│  - Description                  │                                 │
│  - Images (up to 8)             │                                 │
│  - Status (dropdown)            │                                 │
│  - Featured (checkbox)          │                                 │
│  [Save Car] [Cancel]            │                                 │
│                                 │                                 │
└────────────────────────────────┴─────────────────────────────────┘

MOBILE/TABLET (1 COLUMN):
┌──────────────────────────┐
│  ADD NEW CAR / EDIT CAR  │
│  [Car Form]              │
│  ...                     │
│  [Save] [Cancel]         │
├──────────────────────────┤
│  ALL CARS TABLE          │
│  [Scrollable]            │
│  [Car rows]              │
│  ...                     │
└──────────────────────────┘

ENQUIRIES TAB:
┌──────────────────────────────────────────────────────────────────┐
│ Customer Enquiry Form                                            │
│ Send test enquiries to verify the form functionality             │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Can't Find Your Car?                                       │  │
│ │ Tell us what you're looking for and we'll find it for you  │  │
│ │                                                            │  │
│ │ [Full Name *]           [Phone Number *]   [Budget *]     │  │
│ │ [Preferred Brand]       [Fuel Type]        [Transmission] │  │
│ │ [Additional Notes - textarea]                             │  │
│ │                       [Submit Enquiry]                    │  │
│ │                                                            │  │
│ └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette

### Stat Cards

```
Total Cars:   BLUE      (#0066CC - #0052A3)
Available:    GREEN     (#10B981)
Reserved:     YELLOW    (#F59E0B)
Sold:         RED       (#EF4444)
Featured:     PURPLE    (#9333EA)
```

### Interactive Elements

```
Buttons:      BLUE      (#2563EB - #1D4ED8)
Hover:        Slightly darker
Disabled:     Gray opacity
Links:        Blue with underline
```

### Backgrounds

```
Page:         Gradient: gray-50 to gray-100
Cards:        White with gray-200 borders
Hover rows:   Light blue tint (hover:bg-blue-50)
Active row:   Blue tint (bg-blue-100)
```

---

## 📊 Data Flow

```
Admin Dashboard
    │
    ├─→ fetchCars() → GET /api/cars
    │       │
    │       └─→ setCars(data)
    │
    ├─→ Render Stats
    │   (count available, reserved, sold, featured)
    │
    ├─→ Filter Form
    │   ├─ Brand
    │   ├─ Location
    │   ├─ Status
    │   └─ Featured
    │
    ├─→ Tab Navigation
    │   ├─ Inventory Tab (default)
    │   │   ├─ CarForm (create/edit)
    │   │   └─ CarsTable (display + actions)
    │   └─ Enquiries Tab
    │       └─ CarEnquiryForm
    │
    └─→ Actions
        ├─ saveCar() → POST/PUT /api/cars
        ├─ deleteCar() → DELETE /api/cars/:id
        ├─ toggleStatus() → PUT /api/cars/:id
        └─ toggleFeatured() → PUT /api/cars/:id
```

---

## ✨ Animation Timings

```
1. Header → 0.4s (entrance)
2. Stats → 0.4s delay + 0.05s stagger per card
3. Filter form → 0.45s delay (entrance)
4. Tabs → Instant switch with 0.3s fade
5. Table → 0.52s delay (entrance) + row animations
6. Row items → 0.26s delay per row (max 0.18s total)
```

---

## 🔘 Button States

### Status Button (Status Cycle)

```
Available (Green):   Click → Reserved
Reserved (Yellow):   Click → Sold
Sold (Red):         Click → Available
```

### Featured Button

```
Not Featured:  ☆ Mark    (bordered)
Featured:      ★ Featured (colored)
Click to toggle
```

### Action Buttons

```
Edit (✎):     Opens car in form
Delete (🗑):   Asks confirmation
Reset:        Clears all filters
Apply:        Submits filters
```

---

## 📱 Responsive Behavior

### Mobile (< 640px)

- 1 column layout
- Filters stacked vertically
- Table scrolls horizontally
- Full-width buttons

### Tablet (640px - 1024px)

- 2 column layout (form + table)
- Filters grid: 2 columns
- Table readable with scroll

### Desktop (1024px - 1280px)

- 2 column layout persists
- Filters grid: 5 columns
- Table expanded

### XL (> 1280px)

- 2 column layout (form narrower)
- Filters all visible
- Table full width

---

## 🎯 User Interactions

### Adding a Car

1. Form appears on left
2. Fill all fields
3. Upload images (drag or click)
4. Click "Submit Car"
5. Car added to table
6. Form resets
7. Toast notification shows

### Editing a Car

1. Click "Edit" (✎) button on car row
2. Car data populates in form
3. Make changes
4. Click "Submit Car"
5. Car updates in table
6. Form resets and shows "Add New Car" again

### Changing Status

1. Click status badge (Available/Reserved/Sold)
2. Status cycles to next state
3. Table updates immediately
4. Stat cards update
5. Toast notification shows

### Toggling Featured

1. Click Featured button (☆/★)
2. Toggles immediately
3. Featured count updates
4. Toast notification shows

### Deleting a Car

1. Click "Delete" (🗑) button
2. Confirmation dialog appears
3. Click "OK" to confirm
4. Car removed from table
5. Stat counts update
6. Toast notification shows

### Switching Tabs

1. Click "Inventory Management" or "Customer Enquiries"
2. Tab button highlights (blue gradient)
3. Content fades out and new content fades in (0.3s)
4. Smooth transition maintained

---

## 📈 Statistics Update Logic

Stats update automatically when:

- Page loads
- Filters applied
- Car added/edited/deleted
- Status changed
- Featured toggled

```javascript
totalCount = cars.length;
countAvailable = cars.filter((c) => c.status === "available").length;
countReserved = cars.filter((c) => c.status === "reserved").length;
countSold = cars.filter((c) => c.status === "sold").length;
countFeatured = cars.filter((c) => c.featured).length;
```

---

## 🧠 Smart Features

✓ Selected car row stays highlighted  
✓ Status cycles intelligently  
✓ Featured toggle with visual feedback  
✓ Toast notifications for all actions  
✓ Confirmation dialogs for destructive actions  
✓ Auto-refresh after changes  
✓ Loading states on filters  
✓ Empty state messages  
✓ Smooth animations throughout  
✓ Responsive on all devices

---

This blueprint ensures your admin dashboard is intuitive, beautiful, and fully functional!
