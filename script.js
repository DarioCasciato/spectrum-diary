let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let selectedDayElement = null;

const colors = {
    green: '#0EAD00',
    orange: '#FFA500',
    red: '#E61919',
    grey: '#444444',
    none: '' // For resetting the color
};

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

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

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
            dayElement.dataset.day = day;
            dayElement.dataset.month = adjustedMonth;
            dayElement.dataset.year = adjustedYear;
            daysContainer.appendChild(dayElement);

            dayElement.addEventListener('click', () => dayClicked(dayElement, day, adjustedMonth, adjustedYear));

            let savedDate = formatSelectedDate(day, adjustedMonth, adjustedYear);
            let dayData = JSON.parse(localStorage.getItem(savedDate));
            if (dayData) {
                dayElement.style.backgroundColor = colors[dayData.color];
            }

            if (day === currentDay && adjustedMonth === currentMonth && adjustedYear === currentYear) {
                dayElement.classList.add('current-day');
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
        selectedDayElement.classList.remove('selected-day');
    }

    dayElement.classList.add('selected-day');
    selectedDayElement = dayElement;

    const formattedDate = `${day}. ${monthNames[month]} ${year}`;
    document.getElementById('selected-day').innerText = `Selected Day: ${formattedDate}`;

    const selectedDate = formatSelectedDate(day, month, year);
    loadDaySettings(selectedDate);
}

function formatSelectedDate(day, month, year) {
    month = parseInt(month) + 1; // Adjusting month for 1-indexed format
    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function saveDaySettings() {
    if (!selectedDayElement) return;

    const selectedDate = formatSelectedDate(
        selectedDayElement.dataset.day,
        selectedDayElement.dataset.month,
        selectedDayElement.dataset.year
    );
    const colorValue = document.getElementById('day-color').value;
    const notes = document.getElementById('day-notes').value;

    selectedDayElement.style.backgroundColor = colors[colorValue];

    if (colorValue === "none") {
        localStorage.removeItem(selectedDate);
    } else {
        localStorage.setItem(selectedDate, JSON.stringify({ color: colorValue, notes }));
    }
}

function loadDaySettings(date) {
    const dayData = JSON.parse(localStorage.getItem(date));
    if (dayData) {
        document.getElementById('day-color').value = dayData.color;
        document.getElementById('day-notes').value = dayData.notes;
        selectedDayElement.style.backgroundColor = colors[dayData.color];
    } else {
        document.getElementById('day-color').value = 'none';
        document.getElementById('day-notes').value = '';
        selectedDayElement.style.backgroundColor = '';
    }
}

generateCalendar(currentMonth, currentYear);
