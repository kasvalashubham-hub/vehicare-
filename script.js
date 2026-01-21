/*
* VehiCare India - Logic Script
* Tailored for Indian road conditions (Dust, Heat, Traffic, Monsoons)
*/

const maintenanceLogic = {
    conditions: {
        city: { stress: 1.2, focus: ['Clutch', 'Brakes', 'Cooling System'] }, // Stop-go traffic
        highway: { stress: 0.9, focus: ['Tyres', 'Engine Oil', 'Windshield'] }, // Sustained speed
        mixed: { stress: 1.0, focus: ['General Fluids', 'Filters'] },
        rough: { stress: 1.5, focus: ['Suspension', 'Wheel Alignment', 'Air Filter'] } // Potholes/Dust
    },
    vehicleTypes: {
        hatchback: { serviceInterval: 10000 },
        sedan: { serviceInterval: 10000 },
        suv: { serviceInterval: 10000 },
        bike: { serviceInterval: 3000 },
        scooter: { serviceInterval: 3000 }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vehicleForm');
    const inputSection = document.getElementById('inputSection');
    const resultsSection = document.getElementById('resultsSection');
    const backBtn = document.getElementById('backBtn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get Inputs
        const type = document.getElementById('vehicleType').value;
        const fuel = document.getElementById('fuelType').value;
        const age = parseInt(document.getElementById('age').value);
        const mileage = parseInt(document.getElementById('mileage').value);
        const condition = document.getElementById('condition').value;

        generateReport(type, fuel, age, mileage, condition);
        
        // Switch Views
        inputSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        window.scrollTo(0,0);
    });

    backBtn.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
    });
});

function generateReport(type, fuel, age, mileage, condition) {
    const rules = maintenanceLogic.conditions[condition];
    const baseInterval = maintenanceLogic.vehicleTypes[type].serviceInterval;
    
    // 1. Calculate Score (100 is new, drops with Age usage)
    // Indian context: Age degrades rubber/plastics faster due to heat
    let score = 100 - (age * 2) - (mileage / (type === 'bike' || type === 'scooter' ? 2000 : 5000));
    score = Math.max(10, Math.min(99, Math.round(score)));
    
    // Update Score UI
    const scoreEl = document.getElementById('maintenanceScore');
    const scoreDesc = document.getElementById('scoreDesc');
    scoreEl.innerText = score;
    scoreEl.style.borderColor = getScoreColor(score);
    scoreEl.style.color = getScoreColor(score);
    
    if (score > 80) scoreDesc.innerText = "Excellent Condition";
    else if (score > 50) scoreDesc.innerText = "Moderate Wear - Needs Care";
    else scoreDesc.innerText = "High Wear - Critical Maintenance Needed";

    // 2. Critical Checks
    const criticalList = document.getElementById('criticalList');
    criticalList.innerHTML = '';
    
    const checks = [];
    
    // Logic for checks
    if (condition === 'rough') {
        checks.push("Suspension Struts & Bushings (Indian roads cause rapid wear)");
        checks.push("Air Filter (Check for dust clogging)");
    }
    if (condition === 'city') {
        checks.push("Clutch Plate & Cable (Heavy traffic usage)");
        checks.push("Brake Pads (Frequent braking)");
    }
    if (age > 5) {
        checks.push("Rubber Hoses & Belts (Heat degradation)");
        checks.push("Car Battery (Life expectancy ~4-5 years)");
    }
    if (fuel === 'diesel' && mileage > 50000) {
        checks.push("EGR Valve Cleaning");
        checks.push("Fuel Injectors");
    }
    
    // Mileage specific
    if (mileage > 40000 && (type === 'hatchback' || type === 'sedan' || type === 'suv')) {
        checks.push("Tyres (Tread depth check)");
    }
    
    checks.forEach(check => {
        const li = document.createElement('li');
        li.innerText = check;
        criticalList.appendChild(li);
    });

    if (checks.length === 0) {
        const li = document.createElement('li');
        li.innerText = "No critical issues detected based on general rules.";
        li.style.color = "var(--accent)";
        li.style.border = "none";
        // Remove warning icon via css trick or just text
        criticalList.appendChild(li);
    }

    // 3. Upcoming Schedule
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    // Next Service
    const nextServiceKm = Math.ceil(mileage / baseInterval) * baseInterval;
    const dueKm = nextServiceKm - mileage;
    
    addTimelineItem(timeline, `Next General Service`, `Due in ${dueKm} km`, "Oil change, Oil Filter, General Wash");
    
    if (condition === 'rough' || condition === 'city') {
        addTimelineItem(timeline, `Intermediate Check-up`, `Due in ${Math.round(dueKm/2)} km`, "Fluid top-up, Air pressure check");
    }
    
    // Monsoon check if relevant (Simulated logic)
    addTimelineItem(timeline, `Pre-Monsoon Check`, `Before June`, "Wiper blades, Underbody anti-rust coating");

    // 4. Upgrades/Recommendations
    const upgradesList = document.getElementById('upgradesList');
    upgradesList.innerHTML = '';
    
    const upgradeItems = [];
    
    if (condition === 'highway') {
        upgradeItems.push({title: "High-Performance Bulbs", desc: "Upgrade to 90/100W halogen or LED for better visibility on unlit highways."});
        upgradeItems.push({title: "Tyre Inflator", desc: "Portable inflator is essential for long trips."});
    }
    if (condition === 'city') {
        upgradeItems.push({title: "Dashcam", desc: "Crucial for evidence in city traffic incidents."});
        upgradeItems.push({title: "Cabin Air Purifier", desc: "Combat city pollution inside the vehicle."});
    }
    if (condition === 'rough') {
        upgradeItems.push({title: "Underbody Protection", desc: "Metal sump guard to protect engine from stone hits."});
    }
    
    // Generic
    upgradeItems.push({title: "Microfiber Cloths", desc: "Keep dust off the dashboard and paint."});

    upgradeItems.forEach(up => {
        const div = document.createElement('div');
        div.className = 'upgrade-item';
        div.innerHTML = `<h4>${up.title}</h4><p>${up.desc}</p>`;
        upgradesList.appendChild(div);
    });
}

function addTimelineItem(container, title, subtitle, desc) {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `<h4>${title} <span style="font-size:0.8em; color:var(--primary); margin-left:10px;">${subtitle}</span></h4><p>${desc}</p>`;
    container.appendChild(div);
}

function getScoreColor(score) {
    if (score > 80) return '#10b981'; // Green
    if (score > 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
}
