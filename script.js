// --- 1. Database Operations & Global State ---
function getBookings() { return JSON.parse(localStorage.getItem('hotel_bookings')) || []; }
function saveBookings(bookings) { localStorage.setItem('hotel_bookings', JSON.stringify(bookings)); }
function getRoomsData() { return JSON.parse(localStorage.getItem('hotel_rooms')) || {}; }
function saveRoomsData(rooms) { localStorage.setItem('hotel_rooms', JSON.stringify(rooms)); }

const roomRates = { "Prime": 2000, "Deluxe": 3500, "Super Deluxe": 5000, "Royal Suite": 8500 };
let currentEditIndex = null;
let revenueChartInstance = null; // To hold the chart

// --- 2. UI Utilities ---
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
if(localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    themeToggle.className = isDark ? "fa-solid fa-sun icon-btn" : "fa-solid fa-moon icon-btn";
});

// --- 3. Core Rendering & Charting ---
function updateChart(bookings) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Very simple mock revenue calculation for the chart based on room types
    let dataMap = { "Prime": 0, "Deluxe": 0, "Super Deluxe": 0, "Royal Suite": 0 };
    bookings.forEach(b => { if(b.status === 'Occupied') dataMap[b.roomType] += roomRates[b.roomType]; });

    if (revenueChartInstance) revenueChartInstance.destroy();

    revenueChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dataMap),
            datasets: [{
                label: 'Current Expected Revenue (₹)',
                data: Object.values(dataMap),
                backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
                borderRadius: 6
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderAllViews(searchQuery = "") {
    const allBookings = getBookings();
    const roomsStatus = getRoomsData();
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const filtered = allBookings.filter(b => b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || b.roomNumber.toString().includes(searchQuery));

    document.getElementById('dashboard-table-body').innerHTML = '';
    document.getElementById('prebookings-table-body').innerHTML = '';
    document.getElementById('past-bookings-table-body').innerHTML = '';
    document.getElementById('rooms-grid').innerHTML = '';
    document.getElementById('guests-list').innerHTML = '';
    document.getElementById('billing-list').innerHTML = '';

    const uniqueGuests = new Set();
    const activeRooms = new Set(); // Track rooms currently occupied

    filtered.forEach((booking, index) => {
        const isPast = new Date(booking.checkOut) < today;
        let statusClass = booking.status === 'Occupied' ? 'occupied' : 'pre-booked';
        const actions = `<button class="btn-warning" onclick="editBooking(${index})">Edit</button> <button class="btn-danger" onclick="deleteBooking(${index})">Delete</button>`;

        if (isPast) {
            document.getElementById('past-bookings-table-body').innerHTML += `<tr><td>${booking.guestName}</td><td>${booking.roomNumber}</td><td>${booking.checkIn}</td><td>${booking.checkOut}</td><td><span class="status checked-out">Completed</span></td></tr>`;
            // If room is in past booking, mark it dirty in our simulated status if not already tracked
            if(!roomsStatus[booking.roomNumber] && !activeRooms.has(booking.roomNumber)) {
                roomsStatus[booking.roomNumber] = "Dirty";
            }
        } else {
            document.getElementById('dashboard-table-body').innerHTML += `<tr><td><strong>${booking.guestName}</strong></td><td>${booking.roomNumber}</td><td>${booking.roomType}</td><td>${booking.checkIn}</td><td>${booking.checkOut}</td><td><span class="status ${statusClass}">${booking.status}</span></td><td>${actions}</td></tr>`;
            if(booking.status === 'Pre-booked') {
                document.getElementById('prebookings-table-body').innerHTML += `<tr><td>${booking.guestName}</td><td>${booking.roomNumber}</td><td>${booking.checkIn}</td></tr>`;
            } else {
                activeRooms.add(booking.roomNumber);
                roomsStatus[booking.roomNumber] = "Clean"; // Active rooms are considered clean by default in this view
            }
        }

        if(!uniqueGuests.has(booking.guestName)) {
            uniqueGuests.add(booking.guestName);
            document.getElementById('guests-list').innerHTML += `<li><i class="fa-solid fa-user-circle"></i> ${booking.guestName}</li>`;
        }

        document.getElementById('billing-list').innerHTML += `
            <div class="bill-item">
                <div><strong>${booking.guestName}</strong> (Room ${booking.roomNumber})<br><small>${booking.checkIn} to ${booking.checkOut}</small></div>
                <button class="btn-primary" onclick="generateInvoice(${index})">Select</button>
            </div>`;
    });

    // Render Housekeeping Grid
    Object.keys(roomsStatus).forEach(room => {
        const isDirty = roomsStatus[room] === "Dirty";
        const cardClass = isDirty ? "dirty" : "clean";
        const btnText = isDirty ? "Mark Clean" : "Ready";
        const btnClass = isDirty ? "btn-primary" : "btn-secondary";
        
        document.getElementById('rooms-grid').innerHTML += `
            <div class="room-card ${cardClass}">
                <h4>Room ${room}</h4>
                <p>Status: <strong>${roomsStatus[room]}</strong></p>
                ${isDirty ? `<button class="${btnClass}" style="margin-top:10px; width:100%;" onclick="toggleRoomStatus('${room}')">${btnText}</button>` : ''}
            </div>`;
    });

    saveRoomsData(roomsStatus);
    updateChart(allBookings);
}

// --- Housekeeping Logic ---
window.toggleRoomStatus = function(roomNumber) {
    const rooms = getRoomsData();
    rooms[roomNumber] = "Clean";
    saveRoomsData(rooms);
    showToast(`Room ${roomNumber} marked as clean.`);
    renderAllViews();
};

// --- 4. Advanced Billing & Extras ---
window.generateInvoice = function(index) {
    const booking = getBookings()[index];
    const invoicePanel = document.getElementById('invoice-panel');

    const days = Math.max(1, (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 3600 * 24));
    const rate = roomRates[booking.roomType];
    const baseRent = rate * days;
    
    // Initialize extras array if it doesn't exist
    if(!booking.extras) booking.extras = [];
    const extrasTotal = booking.extras.reduce((sum, item) => sum + item.amount, 0);

    const subTotal = baseRent + extrasTotal;
    const discountAmount = booking.discount ? (subTotal * (booking.discount / 100)) : 0;
    const postDiscount = subTotal - discountAmount;
    
    const gst = postDiscount * 0.18; 
    const serviceCharge = postDiscount * 0.05; 
    const total = postDiscount + gst + serviceCharge;

    let extrasHTML = booking.extras.map((ext, i) => `<div class="invoice-row"><small>${ext.desc}</small> <span>₹${ext.amount} <i class="fa-solid fa-times" style="color:red;cursor:pointer;" onclick="removeExtra(${index}, ${i})"></i></span></div>`).join('');

    invoicePanel.innerHTML = `
        <div id="print-section">
            <h2 style="color:var(--primary);"><i class="fa-solid fa-hotel"></i> Grand Horizon</h2>
            <h3>Invoice: ${booking.guestName}</h3>
            <p style="margin-bottom:20px; color:var(--text-muted);">Room ${booking.roomNumber} | ${booking.roomType} | ${days} Nights</p>
            
            <div class="invoice-row"><span>Base Rent (${days}x ₹${rate}):</span> <span>₹${baseRent}</span></div>
            
            ${extrasHTML ? `<hr style="margin:10px 0;"><strong>Room Service / Extras:</strong>${extrasHTML}` : ''}
            
            <hr style="margin:10px 0;">
            <div class="invoice-row"><span>Subtotal:</span> <span>₹${subTotal}</span></div>
            ${booking.discount ? `<div class="invoice-row" style="color:#10b981;"><span>Discount (${booking.discount}%):</span> <span>-₹${discountAmount.toFixed(2)}</span></div>` : ''}
            
            <div class="invoice-row"><span>GST (18%):</span> <span>₹${gst.toFixed(2)}</span></div>
            <div class="invoice-row"><span>Service Charge (5%):</span> <span>₹${serviceCharge.toFixed(2)}</span></div>
            
            <div class="invoice-row invoice-total"><span>Total Payable:</span> <span>₹${total.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span></div>
        </div>
        
        <div style="background:var(--white); padding:15px; margin-top:20px; border-radius:8px; border:1px solid var(--border);">
            <h4>Add Charges & Discounts</h4>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <input type="text" id="extra-desc" placeholder="Item (e.g. Laundry)" style="flex:2; padding:8px;">
                <input type="number" id="extra-amt" placeholder="₹ Amt" style="flex:1; padding:8px;">
                <button class="btn-secondary" onclick="addExtra(${index})">Add</button>
            </div>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <input type="number" id="discount-pct" placeholder="Discount %" style="flex:1; padding:8px;">
                <button class="btn-warning" onclick="applyDiscount(${index})">Apply</button>
            </div>
        </div>
        
        <button class="btn-primary" style="width:100%; margin-top:20px;" onclick="downloadPDF()"><i class="fa-solid fa-file-pdf"></i> Download PDF Invoice</button>
    `;
};

// Add Extra Charge logic
window.addExtra = function(index) {
    const desc = document.getElementById('extra-desc').value;
    const amt = parseFloat(document.getElementById('extra-amt').value);
    if(desc && amt) {
        const bookings = getBookings();
        if(!bookings[index].extras) bookings[index].extras = [];
        bookings[index].extras.push({desc, amount: amt});
        saveBookings(bookings);
        generateInvoice(index); // Refresh UI
        showToast("Charge added to bill.");
    }
};

window.removeExtra = function(bIndex, eIndex) {
    const bookings = getBookings();
    bookings[bIndex].extras.splice(eIndex, 1);
    saveBookings(bookings);
    generateInvoice(bIndex);
};

window.applyDiscount = function(index) {
    const pct = parseFloat(document.getElementById('discount-pct').value);
    if(pct >= 0 && pct <= 100) {
        const bookings = getBookings();
        bookings[index].discount = pct;
        saveBookings(bookings);
        generateInvoice(index);
        showToast("Discount applied!");
    }
};

window.downloadPDF = function() {
    const element = document.getElementById('print-section');
    const opt = { margin: 1, filename: 'Hotel_Invoice.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
    html2pdf().set(opt).from(element).save();
    showToast("PDF Generating...");
};


// --- 5. Modal & Form Logic ---
const form = document.getElementById('new-booking-form');
const modal = document.getElementById('booking-modal');
const modalTitle = document.querySelector('#booking-modal h2');

window.editBooking = function(index) {
    const b = getBookings()[index];
    document.getElementById('guest-name').value = b.guestName;
    document.getElementById('room-number').value = b.roomNumber;
    document.getElementById('room-type').value = b.roomType;
    document.getElementById('check-in').value = b.checkIn;
    document.getElementById('check-out').value = b.checkOut;
    document.getElementById('booking-status').value = b.status;
    modalTitle.innerText = "Edit Booking";
    currentEditIndex = index;
    modal.classList.remove('hidden');
};

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        guestName: document.getElementById('guest-name').value,
        roomNumber: document.getElementById('room-number').value,
        roomType: document.getElementById('room-type').value,
        checkIn: document.getElementById('check-in').value,
        checkOut: document.getElementById('check-out').value,
        status: document.getElementById('booking-status').value,
        extras: [], discount: 0 // Initialize empty extras
    };
    const bookings = getBookings();
    if (currentEditIndex !== null) bookings[currentEditIndex] = {...bookings[currentEditIndex], ...data};
    else bookings.push(data);
    
    saveBookings(bookings);
    form.reset(); currentEditIndex = null; modal.classList.add('hidden');
    showToast(currentEditIndex !== null ? "Booking Updated" : "New Booking Created");
    renderAllViews();
});

window.deleteBooking = function(index) {
    if(confirm('Delete this booking?')) {
        const bookings = getBookings();
        bookings.splice(index, 1);
        saveBookings(bookings);
        showToast("Booking Deleted");
        renderAllViews();
    }
};

// --- 6. Data Backup (Export/Import) ---
document.getElementById('export-btn').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem('hotel_bookings'));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "hotel_backup.json");
    dlAnchorElem.click();
    showToast("Data Exported!");
});

document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());

document.getElementById('import-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            saveBookings(data);
            renderAllViews();
            showToast("Backup Restored Successfully!");
        } catch (err) { alert("Error reading JSON file."); }
    };
    reader.readAsText(file);
});

document.getElementById('clear-data-btn').addEventListener('click', () => {
    if(confirm("DANGER: Factory reset will delete ALL data. Proceed?")) {
        localStorage.clear();
        renderAllViews();
        showToast("System Reset Complete");
    }
});

// --- 7. UI Initialization ---
document.getElementById('global-search').addEventListener('input', (e) => renderAllViews(e.target.value));
document.getElementById('open-modal-btn').addEventListener('click', () => { form.reset(); currentEditIndex = null; modalTitle.innerText = "Create New Booking"; modal.classList.remove('hidden'); });
document.getElementById('close-modal-btn').addEventListener('click', () => modal.classList.add('hidden'));

const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view-section');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        views.forEach(view => view.classList.add('hidden'));
        document.getElementById(item.getAttribute('data-target')).classList.remove('hidden');
    });
});

document.addEventListener('DOMContentLoaded', () => renderAllViews());