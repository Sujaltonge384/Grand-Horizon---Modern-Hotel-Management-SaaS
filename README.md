# 🏨 Grand Horizon - Modern Hotel Management SaaS

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-2ea44f?style=for-the-badge&logo=github)](https://your-username.github.io/grand-horizon-hotel/)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

**Grand Horizon** is a professional, fully functional front-end Hotel Management Dashboard. Built entirely with Vanilla JavaScript, HTML, and CSS, this application simulates a real-world SaaS platform for hotel administrators. It features an interactive UI, local data persistence, PDF invoice generation, and real-time revenue tracking without requiring a backend server.

---

## 🚀 Live Demo

**[👉 Click here to view the Live Demo]()**

*(Note: The live demo is hosted using GitHub Pages. Since it uses `localStorage`, your data will be saved to your personal browser and won't be seen by other users.)*

---

## 📸 Application Screenshots

*(Replace the image links below with your actual screenshots once you upload them to your GitHub repository!)*

### 1. Command Center (Dashboard)
<img width="1352" height="601" alt="image" src="https://github.com/user-attachments/assets/303ef9d5-01e2-4142-a4c5-7c844f6d86e4" />
The heart of the system. Displays real-time occupancy stats, the searchable Master Booking List, and the Revenue Analytics bar chart.

### 2. Night Operations (Dark Mode)
<img width="1351" height="600" alt="image" src="https://github.com/user-attachments/assets/286bde46-4405-49a3-b679-944ac4238758" />
A high-contrast, eye-friendly interface designed for front-desk staff working overnight shifts. Toggled with a single click.

### 3. Housekeeping & Room Status
<img width="1366" height="611" alt="image" src="https://github.com/user-attachments/assets/50503027-5db4-4f05-82bf-5c1a1883e69b" />
Real-time room tracking. Rooms automatically turn red (Dirty) upon guest checkout and must be manually cleared (Green) for the next guest.

### 4. Advanced Billing & Extra Charges
<img width="1089" height="604" alt="image" src="https://github.com/user-attachments/assets/5fd4e5cc-66b1-4713-a007-07824ff5052b" />
The invoice engine. Manage mid-stay room service charges, apply discount codes, and view automated GST/Service Charge calculations.

### 5. Guest History & Archives
<img width="1362" height="601" alt="image" src="https://github.com/user-attachments/assets/9fd0ab01-6c37-4222-84bc-8bc21fa0c954" />
Clean separation between current guests and historical records. The system automatically migrates data based on the checkout date.

### 6. Database & Backup Controls
<img width="1366" height="611" alt="image" src="https://github.com/user-attachments/assets/028a2822-9ec3-4b7f-a799-438a0ce7c442" />
Enterprise-level data control. Export your entire hotel database as a JSON file or restore from a previous backup to prevent data loss.

### 7. Mobile-Ready Design
<img width="410" height="522" alt="image" src="https://github.com/user-attachments/assets/f4daa89d-00ce-4f2b-a9bc-1740a1d6672a" />

A fully responsive layout that allows hotel managers to track occupancy and revenue directly from their smartphone.

---

## ✨ Detailed Feature Breakdown

### 📊 Real-Time Analytics & Dashboard
* **Revenue Tracking:** Automatically calculates expected revenue based on currently occupied rooms and plots it using `Chart.js`.
* **Master List:** A searchable, filterable table of all current and upcoming bookings.
* **Global Search:** Instantly find guests or rooms using the top search bar.

### 🛏️ Core Hotel Operations
* **Complete Booking Lifecycle:** Move guests from "Pre-booked" to "Occupied", and eventually archive them into "Past Bookings".
* **Housekeeping Module:** When a guest checks out, their room is flagged as **"Dirty"** (red). Housekeeping staff can mark it **"Clean"** (green) once serviced.
* **Guest Directory:** Automatically compiles a unique list of all guests who have stayed at the hotel.

### 📄 Pro Billing & Invoicing
* **Dynamic Calculations:** Automatically calculates the number of nights stayed multiplied by the room type's base rate.
* **Room Service & Extras:** Add custom line items (e.g., Laundry, Breakfast) to the guest's tab mid-stay.
* **Discounts & Taxes:** Apply percentage-based discounts. Automatically calculates 18% GST and a 5% Service Charge.
* **PDF Export:** Utilizes `html2pdf.js` to render the invoice and download it directly to the user's local machine.

### 💾 Data Management (No Backend Required)
* **Local Storage Engine:** Uses the browser's native `localStorage` API to save data permanently.
* **Export/Import:** Download the entire hotel database as a `.json` backup file, and upload it later to restore your data.
* **Factory Reset:** A "Danger Zone" button in settings to completely wipe the system for a fresh start.

---

## 🛠️ Technologies Used

* **HTML5:** Semantic structure and layout.
* **CSS3:** Custom styling, CSS Variables (for Dark Mode), Flexbox, and CSS Grid.
* **Vanilla JavaScript (ES6+):** Core logic, DOM manipulation, and data handling without framework bloat.
* **[Chart.js](https://www.chartjs.org/):** Used for rendering the responsive revenue bar chart.
* **[html2pdf.js](https://ekoopmans.github.io/html2pdf.js/):** Used for converting the HTML invoice panel into a downloadable PDF.
* **[FontAwesome 6](https://fontawesome.com/):** For crisp, scalable vector icons across the UI.

---

## 📁 Project Structure

```text
grand-horizon-hotel/
│
├── index.html       # The main layout, sidebar, and structural views
├── styles.css       # All styling, animations, and dark mode variables
├── script.js        # The database logic, UI routing, and application core
└── README.md        # Project documentation
