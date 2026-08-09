# Admin Dashboard - Quick Reference

## 🚀 Quick Start

Navigate to `/admin` to access your professional admin dashboard.

---

## 📊 Dashboard Sections

### 1️⃣ Header Section

- Title: "Admin Dashboard"
- Subtitle: "Manage your car inventory, listings, and customer enquiries"
- Brand logo display

### 2️⃣ Statistics Cards (5 Cards)

- **Total Cars**: Overall inventory count
- **Available**: Cars ready for sale
- **Reserved**: Cars under consideration
- **Sold**: Completed sales
- **Featured**: Promoted listings

Each card shows:

- Icon indicator
- Color-coded background
- Large count number
- Hover lift animation

### 3️⃣ Tab Navigation

- **Inventory Management** (📦)
  - Add/edit cars
  - Filter inventory
  - View all listings
- **Customer Enquiries** (💬)
  - View enquiry form
  - Test form functionality

### 4️⃣ Inventory Management Tab

#### Filter Panel

Filter by:

- **Brand** - Car manufacturer
- **Location** - City/Region
- **Status** - Available/Reserved/Sold
- **Featured** - Featured only or all

Buttons:

- **Reset** - Clear all filters
- **Apply** - Apply selected filters

#### Content Grid

**Left Column: Car Form**

- Add new car
- Edit selected car
- Fields:
  - Title, Brand, Price, Year
  - Fuel Type, Transmission, Body Type
  - Seat Capacity, Ownership, KM Driven
  - Location, Description
  - Status, Featured toggle
  - Image uploads (up to 8)

**Right Column: Cars Table**

- Car thumbnail + title + brand + year
- Price (formatted)
- Status (clickable to cycle)
- Featured toggle (☆ or ★)
- Location
- Edit button (✎)
- Delete button (🗑)

### 5️⃣ Enquiries Tab

- Full-width enquiry form
- For customer car search requests
- Fields: Name, Phone, Budget, Brand, Fuel, Transmission, Notes

---

## 🎮 How to Use

### Adding a New Car

1. Ensure "Inventory Management" tab is active
2. Left panel shows "Add New Car"
3. Fill in all required fields:
   - Title
   - Brand
   - Price
   - Year
   - Fuel Type
   - Transmission
   - Seat Capacity
   - KM Driven
   - Location
   - Description
4. Upload images (drag & drop or click)
5. Set Status (usually "Available")
6. Toggle "Featured" if needed
7. Click "Submit Car"
8. Car appears in table immediately
9. Stat cards update

### Editing a Car

1. Find car in the table
2. Click "Edit" button (✎)
3. Car details populate in left form
4. Make changes
5. Click "Submit Car"
6. Car updates in table
7. Close form and it resets

### Changing Car Status

1. In table, find car row
2. Click on the status badge (Available/Reserved/Sold)
3. Status cycles: Available → Reserved → Sold → Available
4. Table updates immediately
5. Stat cards update automatically

### Marking as Featured

1. In table, click "Featured" button
2. ☆ becomes ★ (Featured)
3. Repeat to toggle off
4. Featured count updates in stats

### Deleting a Car

1. Find car in table
2. Click "Delete" button (🗑)
3. Confirmation popup appears
4. Click "OK" to confirm deletion
5. Car removed from table
6. Stat counts update

### Filtering Inventory

1. Fill filter fields (any combination):
   - Brand: Type brand name
   - Location: Type city name
   - Status: Select from dropdown
   - Featured: Select "Featured Only"
2. Click "Apply Filters"
3. Table updates to show matching cars
4. Click "Reset" to clear filters

### Viewing Customer Enquiries

1. Click "Customer Enquiries" tab
2. View and test the enquiry form
3. Submit test enquiries to verify functionality

---

## 🎯 Key Features

✨ **Real-time Updates**

- Stats update immediately
- Table refreshes automatically
- No page reload needed

🎨 **Beautiful Design**

- Modern gradient backgrounds
- Color-coded status indicators
- Smooth animations
- Professional layout

📱 **Responsive**

- Mobile: Single column
- Tablet: 2 columns
- Desktop: Full grid layout

🔔 **Notifications**

- Toast messages for actions
- Confirmation dialogs for delete
- Loading indicators

⌨️ **Keyboard Friendly**

- Tab navigation
- Focus states
- Accessible design

---

## 🔧 Technical Details

### API Endpoints Used

- `GET /api/cars` - Fetch cars
- `POST /api/cars` - Add car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Status Values

- `available` - Ready for sale
- `reserved` - Under negotiation
- `sold` - Transaction complete

### Featured

- `true` - Shown on homepage
- `false` - Regular listing

---

## 💡 Tips & Tricks

1. **Bulk Filtering**: Use multiple filters together (Brand + Location + Status)
2. **Quick Status Change**: Click status badge to cycle through states
3. **Image Priority**: First image becomes thumbnail in listings
4. **Search Friendly**: Title and brand help with search indexing
5. **Price Format**: Enter numbers only (e.g., 500000 for ₹5 Lakhs)
6. **Location Consistency**: Use same city names for better filtering

---

## ⚠️ Important Notes

- **Delete Confirmation**: Always confirm before deleting
- **Image Limit**: Maximum 8 images per car
- **Required Fields**: Title, Brand, Price, Year marked with \*
- **Auto-save**: Form doesn't auto-save (save manually)
- **Filters**: Are not persistent after page reload

---

## 🎨 Visual Elements

### Status Colors

- **Available**: Green (#10B981)
- **Reserved**: Yellow (#F59E0B)
- **Sold**: Red (#EF4444)

### Interactive Elements

- Stat cards: Lift on hover
- Buttons: Scale on click
- Rows: Highlight on hover
- Active row: Blue tint

### Icons

- 📦 Total Cars
- ✓ Available
- ⏱️ Reserved
- ⚠️ Sold
- ⭐ Featured
- ✎ Edit
- 🗑 Delete
- ☆/★ Featured toggle

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify API connection (/api/cars accessible)
3. Refresh page and try again
4. Clear browser cache if needed
5. Check .env file for correct API URL

---

## ✅ Dashboard Ready!

Your admin dashboard is now ready for managing:

- ✓ Car inventory
- ✓ Listings & pricing
- ✓ Status tracking
- ✓ Featured promotions
- ✓ Customer enquiries

**Start managing your inventory now!**
