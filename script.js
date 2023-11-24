let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let selectedDayElement = null;

document.getElementById('prev-four-months').addEventListener('click', () => {
    changeMonths(-4);
});

document.getElementById('next-four-months').addEventListener('click', () => {
    changeMonths(4);
});

document.getElementById('save-day').addEventListener('click', saveDaySettings);

function generateCalendar(month, year) {
    const monthsContainer = document.getElementById('months-container');
    monthsContainer.innerHTML = ''; // Clear previous months

    for (let i = 0; i < 4; i++) {
        let adjustedYear = month + i >= 12 ? year + Math.floor((month + i) / 12) : year;
        let adjustedMonth = (month + i) % 12;

        let monthContainer = document.createElement('div');
        monthContainer.className = 'month';

        let header = document.createElement('div');
        header.className = 'month-header';
        header.innerText = `${monthNames[adjustedMonth]} ${adjustedYear}`;
        monthContainer.appendChild(header);

        let daysContainer = document.createElement('div');
        daysContainer.className = 'calendar-grid';
        monthContainer.appendChild(daysContainer);

        let daysInMonth = new Date(adjustedYear, adjustedMonth + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            let dayElement = document.createElement('div');
            dayElement.innerText = day;
            daysContainer.appendChild(dayElement);

            dayElement.addEventListener('click', () => dayClicked(dayElement, day, adjustedMonth, adjustedYear));

            // Load saved data for each day
            let savedDate = `${adjustedYear}-${adjustedMonth + 1}-${day}`;
            let dayData = JSON.parse(localStorage.getItem(savedDate));
            if (dayData) {
                dayElement.style.backgroundColor = dayData.color;
            }
        }

        monthsContainer.appendChild(monthContainer);
    }
}

function changeMonths(step) {
    currentMonth += step;

    while (currentMonth > 11 || currentMonth < 0) {
        if (currentMonth > 11) {
            currentMonth -= 12;
            currentYear++;
        } else if (currentMonth < 0) {
            currentMonth += 12;
            currentYear--;
        }
    }

    generateCalendar(currentMonth, currentYear);
}

function dayClicked(dayElement, day, month, year) {
    if (selectedDayElement) {
        selectedDayElement.classList.remove('selected');
    }
    dayElement.classList.add('selected');
    selectedDayElement = dayElement;

    document.getElementById('selected-day').innerText = `Selected Day: ${year}-${month + 1}-${day}`;
    loadDaySettings(`${year}-${month + 1}-${day}`);
}

function saveDaySettings() {
    if (!selectedDayElement) return;

    const selectedDate = document.getElementById('selected-day').innerText.split(': ')[1];
    const color = document.getElementById('day-color').value;
    const notes = document.getElementById('day-notes').value;

    // Handle the "None" option
    if (color === "none") {
        selectedDayElement.style.backgroundColor = ''; // Reset to default or transparent
        // Optionally, you can remove the item from localStorage if you don't want to keep the record
        localStorage.removeItem(selectedDate);
    } else {
        selectedDayElement.style.backgroundColor = color;
        localStorage.setItem(selectedDate, JSON.stringify({ color, notes }));
    }
}

function loadDaySettings(date) {
    const dayData = JSON.parse(localStorage.getItem(date));
    if (dayData) {
        document.getElementById('day-color').value = dayData.color;
        document.getElementById('day-notes').value = dayData.notes;
        selectedDayElement.style.backgroundColor = dayData.color;
    } else {
        document.getElementById('day-color').value = 'green'; // default color
        document.getElementById('day-notes').value = '';
        selectedDayElement.style.backgroundColor = '';
    }
}

generateCalendar(currentMonth, currentYear);