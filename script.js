// Load saved settings
function loadSettings() {
    const fontSize = localStorage.getItem('bibleFontSize') || '16';
    const fontColor = localStorage.getItem('bibleFontColor') || '#2f1b14';
    document.getElementById('font-size-slider').value = fontSize;
    document.getElementById('font-size-value').textContent = fontSize + 'px';
    document.getElementById('font-color-picker').value = fontColor;
    applyFontSettings();
}

function applyFontSettings() {
    const display = document.getElementById('verses-display');
    const size = document.getElementById('font-size-slider').value + 'px';
    const color = document.getElementById('font-color-picker').value;
    display.style.fontSize = size;
    display.style.color = color;
}

// Dark Mode Toggle
document.querySelectorAll('input[name="theme-toggle"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const theme = e.target.id === 'dark-mode' ? 'dark' : 'light';
        document.body.setAttribute('data-bs-theme', theme);
        // Reset color picker to theme default
        const defaultColor = theme === 'dark' ? '#e8e4d8' : '#2f1b14';
        document.getElementById('font-color-picker').value = defaultColor;
        applyFontSettings();
        localStorage.setItem('bibleFontColor', defaultColor);
    });
});

// Font Size Slider
document.getElementById('font-size-slider').addEventListener('input', (e) => {
    document.getElementById('font-size-value').textContent = e.target.value + 'px';
    applyFontSettings();
    localStorage.setItem('bibleFontSize', e.target.value);
});

// Font Color Picker
document.getElementById('font-color-picker').addEventListener('input', (e) => {
    applyFontSettings();
    localStorage.setItem('bibleFontColor', e.target.value);
});

document.getElementById('fetch-btn').addEventListener('click', async () => {
    const book = document.getElementById('book-select').value;
    const chapter = document.getElementById('chapter-input').value;
    const search = document.getElementById('search-input').value.trim();
    const display = document.getElementById('verses-display');
    const spinner = document.querySelector('.spinner-border');
    const button = document.getElementById('fetch-btn');

    let url;
    if (search) {
        url = `https://bible-api.com/${search}`;
    } else if (book) {
        if (chapter) {
            url = `https://bible-api.com/${book}+${chapter}`;
        } else {
            url = `https://bible-api.com/${book}`;
        }
    } else {
        display.textContent = 'Please select a book or enter a search verse.';
        return;
    }

    // Show spinner and disable button
    spinner.classList.remove('d-none');
    button.disabled = true;
    display.textContent = '';
    display.classList.remove('animate__fadeInUp');

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            display.textContent = 'Error: ' + data.error;
        } else {
            display.textContent = data.text;
            display.classList.add('animate__fadeInUp'); // Trigger bounce animation
        }
    } catch (error) {
        display.textContent = 'Failed to fetch verses. Check your connection.';
    } finally {
        // Hide spinner and enable button
        spinner.classList.add('d-none');
        button.disabled = false;
    }
});

// Initialize settings on page load
loadSettings();