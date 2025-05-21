// Theme Configuration
const themes = {
    default: {
        name: "Default",
        primary: "#FF4B2B",
        secondary: "#FF416C",
        accent: "#FF6B6B",
        light: "#FFF0F0",
        dark: "#A30000",
        text: "#2C3A47",
        textLight: "#4E4E4E",
        textDark: "#1A1A1A",
        gradient: "linear-gradient(135deg, #FF4B2B, #FF416C)"
    },
    dark: {
        name: "Dark",
        primary: "#2E2E2E",
        secondary: "#444444",
        accent: "#666666",
        light: "#DADADA",
        dark: "#000000",
        text: "#222222",
        textLight: "#555555",
        textDark: "#111111",
        gradient: "linear-gradient(135deg, #2E2E2E, #444444)"
    },
    midnight: {
        name: "Midnight",
        primary: "#3D3D6B",
        secondary: "#5D5D8C",
        accent: "#6C5CE7",
        light: "#EAEAF6",
        dark: "#2B2B4D",
        text: "#2A2A3B",
        textLight: "#4B4B5E",
        textDark: "#1E1E2F",
        gradient: "linear-gradient(135deg, #3D3D6B, #6C5CE7)"
    },
    nature: {
        name: "Nature",
        primary: "#2ECC71",
        secondary: "#27AE60",
        accent: "#16A085",
        light: "#EAFEF3",
        dark: "#1E3D34",
        text: "#1F3B33",
        textLight: "#3E6655",
        textDark: "#152D23",
        gradient: "linear-gradient(135deg, #2ECC71, #27AE60)"
    },
    sunset: {
        name: "Sunset",
        primary: "#FF512F",
        secondary: "#F09819",
        accent: "#FF774A",
        light: "#FFF4EC",
        dark: "#C1401B",
        text: "#3D1E12",
        textLight: "#6E3B25",
        textDark: "#291007",
        gradient: "linear-gradient(135deg, #FF512F, #F09819)"
    },
    ocean: {
        name: "Ocean",
        primary: "#2193B0",
        secondary: "#6DD5ED",
        accent: "#00B4DB",
        light: "#E0F7FA",
        dark: "#126E82",
        text: "#143D4E",
        textLight: "#2F6D7D",
        textDark: "#0E2B36",
        gradient: "linear-gradient(135deg, #2193B0, #6DD5ED)"
    },
    royal: {
        name: "Royal",
        primary: "#8E2DE2",
        secondary: "#4A00E0",
        accent: "#9B59B6",
        light: "#F4EDFA",
        dark: "#341C59",
        text: "#341C59",
        textLight: "#5E3A8A",
        textDark: "#1F1140",
        gradient: "linear-gradient(135deg, #8E2DE2, #4A00E0)"
    },
    autumn: {
        name: "Autumn",
        primary: "#D38312",
        secondary: "#A83279",
        accent: "#E67E22",
        light: "#FDF4E3",
        dark: "#5A2D15",
        text: "#3C2C1E",
        textLight: "#6B422B",
        textDark: "#25190C",
        gradient: "linear-gradient(135deg, #D38312, #A83279)"
    }
};

// Theme Manager Class
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'default';
        this.themeSwitcher = document.getElementById('themeSwitcher');
        this.themeMenu = document.querySelector('.theme-menu');
        this.init();
    }

    init() {
        // Apply saved theme on page load
        this.applyTheme(this.currentTheme);

        // Initialize theme switcher
        if (this.themeSwitcher) {
            this.themeSwitcher.addEventListener('click', (e) => {
                e.stopPropagation();
                this.themeMenu.classList.toggle('show');
            });
        }

        // Close theme menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.themeSwitcher && !this.themeSwitcher.contains(e.target) && 
                this.themeMenu && !this.themeMenu.contains(e.target)) {
                this.themeMenu.classList.remove('show');
            }
        });

        // Initialize theme options
        this.initializeThemeOptions();
    }

    initializeThemeOptions() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const themeName = option.getAttribute('data-theme');
                this.applyTheme(themeName);
                if (this.themeMenu) {
                    this.themeMenu.classList.remove('show');
                }
            });
        });
    }

    applyTheme(themeName) {
        const theme = themes[themeName];
        if (!theme) return;

        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        document.documentElement.style.setProperty('--light-color', theme.light);
        document.documentElement.style.setProperty('--dark-color', theme.dark);
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--text-light', theme.textLight);
        document.documentElement.style.setProperty('--text-dark', theme.textDark);
        document.documentElement.style.setProperty('--gradient-primary', theme.gradient);

        // Update active state in theme menu
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === themeName) {
                option.classList.add('active');
            }
        });

        // Save theme preference
        localStorage.setItem('theme', themeName);
        this.currentTheme = themeName;

        // Dispatch theme change event
        const event = new CustomEvent('themeChanged', { detail: { theme: themeName } });
        document.dispatchEvent(event);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize Theme Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
}); 