# 🏨 Grand Horizon - Modern Hotel Management SaaS

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

A professional, fully functional front-end Hotel Management Dashboard built entirely with Vanilla JavaScript, HTML, and CSS. This project simulates a real-world SaaS application for hotel administrators, featuring an interactive UI, local data persistence, PDF invoice generation, and revenue tracking.

## ✨ Key Features

* **📊 Interactive Analytics:** Real-time revenue tracking charts powered by `Chart.js`.
* **🌙 Dark/Light Mode:** Seamless UI theme toggling for user preference.
* **🛏️ Housekeeping Module:** Track room cleanliness visually. Rooms automatically mark as "Dirty" after a guest checks out.
* **📄 Pro Invoicing:** Generate dynamic bills including room service extras, discounts, GST, and service charges. Download final invoices as PDFs via `html2pdf.js`.
* **💾 Local Database & Backups:** All data is saved permanently in the browser using `localStorage`. Includes a "Settings" page to easily Export (download) and Import your JSON data.
* **📅 Complete Booking Lifecycle:** Manage "Pre-bookings", active "Occupied" guests, and automatically archive past guests into the "History" tab.
* **🔔 Toast Notifications:** Smooth, non-intrusive pop-up notifications for user actions (saving, deleting, downloading).

## 🛠️ Tech Stack

* **Front-end:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Icons:** [FontAwesome 6](https://fontawesome.com/)
* **Charts:** [Chart.js](https://www.chartjs.org/) (Loaded via CDN)
* **PDF Generation:** [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) (Loaded via CDN)

## 🚀 How to Run Locally

Because this project is built with pure front-end technologies and utilizes the browser's `localStorage` as a database, there is no need to set up a server, Node.js, or a backend framework!

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/grand-horizon-hotel.git](https://github.com/your-username/grand-horizon-hotel.git)
