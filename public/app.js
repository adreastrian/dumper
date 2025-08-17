/**
 * Dump Viewer - Frontend JavaScript
 */

// Simple SVG icon set (consistent look, inherits currentColor)
function svgIcon(name) {
    const base = 'class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    switch (name) {
        case 'clipboard': return `<svg ${base}><rect x="8" y="3" width="8" height="4" rx="1"/><rect x="5" y="7" width="14" height="14" rx="2"/></svg>`;
        case 'search': return `<svg ${base}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;
        case 'database': return `<svg ${base}><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>`;
        case 'bolt': return `<svg ${base}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>`;
        case 'eye': return `<svg ${base}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
        case 'globe': return `<svg ${base}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 0 0 18a14 14 0 0 0 0-18z"/></svg>`;
        case 'note': return `<svg ${base}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>`;
        case 'clock': return `<svg ${base}><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>`;
        case 'file': return `<svg ${base}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>`;
        case 'copy': return `<svg ${base}><rect x="9" y="9" width="11" height="11" rx="2"/><rect x="4" y="4" width="11" height="11" rx="2"/></svg>`;
        case 'info': return `<svg ${base}><circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><circle cx="12" cy="7" r="1" fill="currentColor" stroke="none"/></svg>`;
        case 'export': return `<svg ${base}><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><rect x="4" y="16" width="16" height="4" rx="1"/></svg>`;
        case 'trash': return `<svg ${base}><path d="M3 6h18"/><path d="M8 6V4h8v2"/><rect x="6" y="6" width="12" height="14" rx="2"/></svg>`;
        case 'check': return `<svg ${base}><path d="M5 12l4 4 10-10"/></svg>`;
        case 'square': return `<svg ${base}><rect x="5" y="5" width="14" height="14" rx="2"/></svg>`;
        case 'refresh': return `<svg ${base}><path d="M3 12a9 9 0 1 0 3-6"/><path d="M3 5v5h5"/></svg>`;
        case 'gear': return `<svg ${base}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1A1.7 1.7 0 0 0 9 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1A1.7 1.7 0 0 0 20.9 11H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;
        case 'help': return `<svg ${base}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.7.6-1.2 1-1.2 1.7v.5"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>`;
        case 'expand': return `<svg ${base}><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5M7 7l-4-4M17 7l4-4M7 17l-4 4M17 17l4 4"/></svg>`;
        case 'collapse': return `<svg ${base}><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8"/></svg>`;
        case 'pin': return `<svg ${base}><path d="M12 21s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z"/><circle cx="12" cy="11" r="2"/></svg>`;
        default: return `<svg ${base}></svg>`;
    }
}

class DumpViewerApp {
    constructor() {
        this.ws = null;
        this.dumps = [];
        this.activeFilter = 'all';
        this.searchTerm = '';
        this.viewMode = 'list';
        this.serverStats = {};
        // Track system theme changes when using Auto theme
        this._mediaQueryList = null;
        this._onSystemThemeChange = null;
        
        // Connection management
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 1000; // Start with 1 second
        this.reconnectTimer = null;
        this.heartbeatTimer = null;
        this.lastActivity = Date.now();
        this.connectionState = 'disconnected';
        
        // User preferences
        this.settings = {
            autoScroll: true,
            soundNotifications: false,
            compactMode: false,
            maxDumps: 1000,
            autoCollapse: true,
            theme: 'dark',
            fontSize: 13
        };
        
        // UI state
        this.shortcutsPanelVisible = false;
        this.advancedFiltersVisible = false;
        this.eventListenersSetup = false;
        
        // Advanced filtering
        this.advancedFilters = {
            file: '',
            function: '',
            dateFrom: null,
            dateTo: null,
            contentType: '',
            sizeOperator: 'gt',
            sizeValue: null
        };
        
        this.filterPresets = this.loadFilterPresets();
        
        this.init();
    }

    init() {
        this.startTime = Date.now();
        this.messageQueue = [];
        
        // Load saved settings
        this.loadSettings();
        
        // Initialize audio context (user interaction required)
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.initAudioContext();
            }
        }, { once: true });
        
        this.setupWebSocket();
        this.setupEventListeners();
        this.startPeriodicUpdates();
        this.applySettings();
        this.renderFilterPresets();
        this.replaceIconPlaceholders();
        
        // Clear connection success flag when tab closes
        // window.addEventListener('beforeunload', () => {
        //     localStorage.removeItem('dumpViewerConnectionShown');
        // });
        
        
        
        // Process any queued messages when connection is established
        const originalOnOpen = this.ws?.onopen;
        if (this.ws) {
            this.ws.onopen = (event) => {
                if (originalOnOpen) originalOnOpen.call(this.ws, event);
                this.processQueuedMessages();
            };
        }
    }
    
    startPeriodicUpdates() {
        // Update sidebar stats every 5 seconds
        setInterval(() => {
            this.updateSidebarStats(this.serverStats);
            
            // Request fresh server status every 30 seconds
            if (this.connectionState === 'connected') {
                this.requestServerStatus();
            }
        }, 5000);
    }
    
    // Settings Management
    loadSettings() {
        const saved = localStorage.getItem('dumpViewerSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                
            }
        }
        
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('dumpViewerTheme');
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
            this.settings.theme = savedTheme;
        }
    }
    
    saveSettings() {
        // Get values from settings modal
        this.settings.autoScroll = document.getElementById('autoScrollSetting').checked;
        this.settings.soundNotifications = document.getElementById('soundNotificationsSetting').checked;
        this.settings.compactMode = document.getElementById('compactModeSetting').checked;
        this.settings.maxDumps = parseInt(document.getElementById('maxDumpsSetting').value);
        this.settings.autoCollapse = document.getElementById('autoCollapseSetting').checked;
        this.settings.theme = document.getElementById('themeSetting').value;
        this.settings.fontSize = parseInt(document.getElementById('fontSizeSetting').value);
        
        // Save to localStorage
        localStorage.setItem('dumpViewerSettings', JSON.stringify(this.settings));
        
        // Apply settings
        this.applySettings();
        this.updateThemeCheckIcon();
        
        // Close modal
        this.hideSettingsModal();
        
        // showToast('Settings saved successfully!', 'success');
    }
    
    resetSettings() {
        this.settings = {
            autoScroll: true,
            soundNotifications: false,
            compactMode: false,
            maxDumps: 1000,
            autoCollapse: true,
            theme: 'dark',
            fontSize: 13
        };
        
        this.populateSettingsModal();
        this.applySettings();
        
        // showToast('Settings reset to defaults', 'info');
    }
    
    changeTheme(theme) {
        this.settings.theme = theme;
        localStorage.setItem('dumpViewerTheme', theme);
        this.applySettings();
        this.updateThemeIcon();
        this.updateThemeCheckIcon();
    }
    
    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (!themeIcon) return;
        
        const theme = this.settings.theme || 'auto';
        let iconPath = '';
        
        switch (theme) {
            case 'light':
                iconPath = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M19.07 4.93l-1.41 1.41M4.93 19.07l1.41-1.41"/>';
                break;
            case 'dark':
                iconPath = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
                break;
            case 'auto':
            default:
                iconPath = '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>';
                break;
        }
        
        themeIcon.innerHTML = iconPath;
    }
    
    updateThemeCheckIcon() {
        // Hide all check icons first
        document.querySelectorAll('.theme-option .check-icon').forEach(check => {
            if (check) {
                check.style.display = 'none';
            }
        });
        
        // Show check icon for current theme
        const currentTheme = this.settings.theme || 'auto';
        const activeOption = document.querySelector(`.theme-option[data-theme="${currentTheme}"]`);
        if (activeOption) {
            const checkIcon = activeOption.querySelector('.check-icon');
            if (checkIcon) {
                checkIcon.style.display = 'block';
            }
        }
    }
    
    setupSystemThemeListener() {
        // Listen for system theme changes when using 'auto' theme
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleThemeChange = (e) => {
                if (this.settings.theme === 'auto') {
                    this.applySettings();
                }
            };
            
            mediaQuery.addEventListener('change', handleThemeChange);
            
            // Store the listener for cleanup if needed
            this._systemThemeListener = handleThemeChange;
        }
    }
    
    applySettings() {
        // Apply theme
        const removeThemeClasses = () => {
            document.body.classList.remove('theme-dark', 'theme-light', 'theme-auto');
        };

        const applyExplicitTheme = (themeName) => {
            removeThemeClasses();
            document.body.classList.add(`theme-${themeName}`);
        };

        // Handle Auto theme by reflecting system preference and listening for changes
        if (this.settings.theme === 'auto') {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyExplicitTheme(prefersDark ? 'dark' : 'light');

            // Set up change listener once
            if (!this._mediaQueryList) {
                this._mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
            }
            if (!this._onSystemThemeChange) {
                this._onSystemThemeChange = (e) => {
                    applyExplicitTheme(e.matches ? 'dark' : 'light');
                };
                if (this._mediaQueryList && this._mediaQueryList.addEventListener) {
                    this._mediaQueryList.addEventListener('change', this._onSystemThemeChange);
                } else if (this._mediaQueryList && this._mediaQueryList.addListener) {
                    // Safari fallback
                    this._mediaQueryList.addListener(this._onSystemThemeChange);
                }
            }
        } else {
            // Cleanup any auto listeners if switching away from auto
            if (this._mediaQueryList && this._onSystemThemeChange) {
                if (this._mediaQueryList.removeEventListener) {
                    this._mediaQueryList.removeEventListener('change', this._onSystemThemeChange);
                } else if (this._mediaQueryList.removeListener) {
                    this._mediaQueryList.removeListener(this._onSystemThemeChange);
                }
                this._onSystemThemeChange = null;
                this._mediaQueryList = null;
            }
            applyExplicitTheme(this.settings.theme);
        }
        
        // Apply font size
        document.documentElement.style.setProperty('--dump-font-size', `${this.settings.fontSize}px`);
        
        // Update auto-scroll button state
        const autoScrollBtn = document.getElementById('autoScrollBtn');
        if (autoScrollBtn) {
            autoScrollBtn.dataset.active = this.settings.autoScroll.toString();
            autoScrollBtn.classList.toggle('active', this.settings.autoScroll);
        }
        
        // Trim dumps if needed
        if (this.dumps.length > this.settings.maxDumps) {
            this.dumps = this.dumps.slice(0, this.settings.maxDumps);
            this.renderDumps();
        }
    }
    
    showSettingsModal() {
        this.populateSettingsModal();
        const modal = document.getElementById('settingsModal');
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }
    
    hideSettingsModal() {
        const modal = document.getElementById('settingsModal');
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
    
    populateSettingsModal() {
        document.getElementById('autoScrollSetting').checked = this.settings.autoScroll;
        document.getElementById('soundNotificationsSetting').checked = this.settings.soundNotifications;
        document.getElementById('compactModeSetting').checked = this.settings.compactMode;
        document.getElementById('maxDumpsSetting').value = this.settings.maxDumps.toString();
        document.getElementById('autoCollapseSetting').checked = this.settings.autoCollapse;
        document.getElementById('themeSetting').value = this.settings.theme;
        document.getElementById('fontSizeSetting').value = this.settings.fontSize.toString();
    }
    
    // Shortcuts Panel
    toggleShortcutsPanel() {
        if (this.shortcutsPanelVisible) {
            this.hideShortcutsPanel();
        } else {
            this.showShortcutsPanel();
        }
    }
    
    showShortcutsPanel() {
        const panel = document.getElementById('shortcutsPanel');
        panel.classList.add('show');
        this.shortcutsPanelVisible = true;
    }
    
    hideShortcutsPanel() {
        const panel = document.getElementById('shortcutsPanel');
        panel.classList.remove('show');
        this.shortcutsPanelVisible = false;
    }
    
    // Interactive Features
    toggleAutoScroll(button) {
        const btn = (button && button.closest) ? (button.closest('#autoScrollBtn') || button) : button;
        this.settings.autoScroll = !this.settings.autoScroll;
        try { localStorage.setItem('dumpViewerSettings', JSON.stringify(this.settings)); } catch (_) {}
        if (btn && btn.dataset) {
            btn.dataset.active = this.settings.autoScroll.toString();
            if (btn.classList) btn.classList.toggle('active', this.settings.autoScroll);
        }
        // showToast(this.settings.autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled', 'info');
    }
    
    
    
    
    
    switchToFilterByNumber(index) {
        const filters = ['all', 'dumps', 'queries', 'jobs', 'views', 'requests', 'logs'];
        if (index < filters.length) {
            this.setActiveFilter(filters[index]);
        }
    }
    
    hideAllModals() {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
    
    // Filtering Methods (advanced removed)
    matchesCategoryFilter(dump) {
        return this.activeFilter === 'all' || dump.category === this.activeFilter;
    }
    
    matchesSearchFilter(dump) {
        if (!this.searchTerm) return true;
        const searchLower = this.searchTerm.toLowerCase();
        return dump.content.toLowerCase().includes(searchLower) ||
               dump.source.file.toLowerCase().includes(searchLower) ||
               (dump.source.function && dump.source.function.toLowerCase().includes(searchLower)) ||
               (dump.source.class && dump.source.class.toLowerCase().includes(searchLower));
    }
    
    // Advanced Filters UI Management
    toggleAdvancedFilters() {
        if (this.advancedFiltersVisible) {
            this.hideAdvancedFilters();
        } else {
            this.showAdvancedFilters();
        }
    }
    
    showAdvancedFilters() {
        const panel = document.getElementById('advancedFiltersPanel');
        panel.classList.add('show');
        this.advancedFiltersVisible = true;
        
        // Populate current filter values
        this.populateAdvancedFilters();
    }
    
    hideAdvancedFilters() {
        const panel = document.getElementById('advancedFiltersPanel');
        panel.classList.remove('show');
        this.advancedFiltersVisible = false;
    }
    
    populateAdvancedFilters() {
        document.getElementById('fileFilter').value = this.advancedFilters.file;
        document.getElementById('functionFilter').value = this.advancedFilters.function;
        document.getElementById('contentTypeFilter').value = this.advancedFilters.contentType;
        document.getElementById('sizeOperator').value = this.advancedFilters.sizeOperator;
        document.getElementById('sizeValue').value = this.advancedFilters.sizeValue || '';
        
        if (this.advancedFilters.dateFrom) {
            document.getElementById('dateFromFilter').value = this.formatDateForInput(this.advancedFilters.dateFrom);
        }
        
        if (this.advancedFilters.dateTo) {
            document.getElementById('dateToFilter').value = this.formatDateForInput(this.advancedFilters.dateTo);
        }
    }
    
    applyAdvancedFilters() {
        // Get values from form
        this.advancedFilters.file = document.getElementById('fileFilter').value;
        this.advancedFilters.function = document.getElementById('functionFilter').value;
        this.advancedFilters.contentType = document.getElementById('contentTypeFilter').value;
        this.advancedFilters.sizeOperator = document.getElementById('sizeOperator').value;
        
        const sizeValue = document.getElementById('sizeValue').value;
        this.advancedFilters.sizeValue = sizeValue ? parseInt(sizeValue) : null;
        
        const dateFrom = document.getElementById('dateFromFilter').value;
        this.advancedFilters.dateFrom = dateFrom ? new Date(dateFrom) : null;
        
        const dateTo = document.getElementById('dateToFilter').value;
        this.advancedFilters.dateTo = dateTo ? new Date(dateTo) : null;
        
        // Apply filters
        this.renderDumps();
        this.hideAdvancedFilters();
        
        // Show feedback
        const activeFilters = this.getActiveFiltersCount();
        if (activeFilters > 0) {
            // showToast(`Applied ${activeFilters} advanced filters`, 'success');
            this.updateFilterToggleButton(true);
        } else {
            // showToast('No filters applied', 'info');
            this.updateFilterToggleButton(false);
        }
    }
    
    clearAdvancedFilters() {
        this.advancedFilters = {
            file: '',
            function: '',
            dateFrom: null,
            dateTo: null,
            contentType: '',
            sizeOperator: 'gt',
            sizeValue: null
        };
        
        this.populateAdvancedFilters();
        this.renderDumps();
        this.updateFilterToggleButton(false);
        
        // showToast('Advanced filters cleared', 'info');
    }
    
    getActiveFiltersCount() {
        let count = 0;
        if (this.advancedFilters.file) count++;
        if (this.advancedFilters.function) count++;
        if (this.advancedFilters.dateFrom || this.advancedFilters.dateTo) count++;
        if (this.advancedFilters.contentType) count++;
        if (this.advancedFilters.sizeValue !== null) count++;
        return count;
    }
    
    updateFilterToggleButton(hasActiveFilters) {
        const button = document.getElementById('filterToggleBtn');
        button.classList.toggle('active', hasActiveFilters);
        button.title = hasActiveFilters ? 
            `Advanced Filters (${this.getActiveFiltersCount()} active)` : 
            'Advanced Filters';
    }
    
    // Search Enhancement
    updateSearchClearButton() {
        const clearBtn = document.getElementById('searchClearBtn');
        clearBtn.style.display = this.searchTerm ? 'block' : 'none';
    }
    
    clearSearch() {
        this.searchTerm = '';
        document.getElementById('searchInput').value = '';
        this.updateSearchClearButton();
        this.renderDumps();
        // showToast('Search cleared', 'info');
    }
    
    // Filter Presets
    saveFilterPreset() {
        const name = prompt('Enter a name for this filter preset:');
        if (!name) return;
        
        const preset = {
            name: name,
            category: this.activeFilter,
            search: this.searchTerm,
            advanced: { ...this.advancedFilters }
        };
        
        this.filterPresets.push(preset);
        this.saveFilterPresets();
        this.renderFilterPresets();
        
        // showToast(`Filter preset "${name}" saved`, 'success');
    }
    
    loadFilterPresets() {
        const saved = localStorage.getItem('dumpViewerFilterPresets');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveFilterPresets() {
        localStorage.setItem('dumpViewerFilterPresets', JSON.stringify(this.filterPresets));
    }
    
    renderFilterPresets() {
        const presetList = document.getElementById('presetList');
        if (!presetList) return;
        
        if (this.filterPresets.length === 0) {
            presetList.innerHTML = '<p class="no-presets">No saved presets</p>';
            return;
        }
        
        presetList.innerHTML = this.filterPresets.map((preset, index) => `
            <div class="preset-item">
                <span class="preset-name">${preset.name}</span>
                <div class="preset-actions">
                    <button class="preset-btn apply-btn" onclick="window.dumpViewer.applyFilterPreset(${index})" title="Apply">✓</button>
                    <button class="preset-btn delete-btn" onclick="window.dumpViewer.deleteFilterPreset(${index})" title="Delete">×</button>
                </div>
            </div>
        `).join('');
    }
    
    applyFilterPreset(index) {
        const preset = this.filterPresets[index];
        if (!preset) return;
        
        // Apply category filter
        this.setActiveFilter(preset.category);
        
        // Apply search
        this.searchTerm = preset.search;
        document.getElementById('searchInput').value = preset.search;
        this.updateSearchClearButton();
        
        // Apply advanced filters
        this.advancedFilters = { ...preset.advanced };
        
        // Render
        this.renderDumps();
        this.updateFilterToggleButton(this.getActiveFiltersCount() > 0);
        
        // showToast(`Applied preset "${preset.name}"`, 'success');
    }
    
    deleteFilterPreset(index) {
        const preset = this.filterPresets[index];
        if (!preset) return;
        
        if (confirm(`Delete filter preset "${preset.name}"?`)) {
            this.filterPresets.splice(index, 1);
            this.saveFilterPresets();
            this.renderFilterPresets();
            // showToast(`Deleted preset "${preset.name}"`, 'info');
        }
    }
    
    formatDateForInput(date) {
        return date.toISOString().slice(0, 16);
    }
    
    // Export Menu Management
    toggleExportMenu() {
        const menu = document.getElementById('exportMenu');
        menu.classList.toggle('show');
    }
    
    hideExportMenu() {
        const menu = document.getElementById('exportMenu');
        menu.classList.remove('show');
    }
    
    handleExportOption(format) {
        switch (format) {
            case 'json':
                this.exportAsJSON();
                break;
            case 'csv':
                this.exportAsCSV();
                break;
            case 'html':
                this.exportAsHTML();
                break;
            case 'text':
                this.exportAsText();
                break;
            case 'selected':
                // feature removed
                break;
            case 'filtered':
                this.exportFilteredDumps();
                break;
        }
    }
    
    // Export Functions
    exportAsJSON() {
        const dumps = this.getExportableDumps();
        const jsonData = JSON.stringify(dumps, null, 2);
        this.downloadFile(jsonData, `dumps-${this.getTimestamp()}.json`, 'application/json');
        // showToast(`Exported ${dumps.length} dumps as JSON`, 'success');
    }
    
    exportAsCSV() {
        const dumps = this.getExportableDumps();
        const csvData = this.convertToCSV(dumps);
        this.downloadFile(csvData, `dumps-${this.getTimestamp()}.csv`, 'text/csv');
        // showToast(`Exported ${dumps.length} dumps as CSV`, 'success');
    }
    
    exportAsHTML() {
        const dumps = this.getExportableDumps();
        const htmlData = this.convertToHTML(dumps);
        this.downloadFile(htmlData, `dumps-${this.getTimestamp()}.html`, 'text/html');
        // showToast(`Exported ${dumps.length} dumps as HTML`, 'success');
    }
    
    exportAsText() {
        const dumps = this.getExportableDumps();
        const textData = this.convertToText(dumps);
        this.downloadFile(textData, `dumps-${this.getTimestamp()}.txt`, 'text/plain');
        // showToast(`Exported ${dumps.length} dumps as text`, 'success');
    }
    
    
    
    exportFilteredDumps() {
        const filteredDumps = this.dumps.filter(dump => 
            this.matchesCategoryFilter(dump) && 
            this.matchesSearchFilter(dump)
        );
        
        const jsonData = JSON.stringify(filteredDumps, null, 2);
        this.downloadFile(jsonData, `filtered-dumps-${this.getTimestamp()}.json`, 'application/json');
        // showToast(`Exported ${filteredDumps.length} filtered dumps`, 'success');
    }
    
    // Copy Functions
    
    
    // Selection Management
    
    
    
    
    
    
    
    
    // Utility Functions
    getExportableDumps() {
        // Return filtered dumps based on current filters
        return this.dumps.filter(dump => 
            this.matchesCategoryFilter(dump) && 
            this.matchesSearchFilter(dump)
        );
    }
    
    convertToCSV(dumps) {
        const headers = ['Timestamp', 'Category', 'File', 'Line', 'Function', 'Content Size', 'Content Preview'];
        const rows = dumps.map(dump => [
            new Date(dump.timestamp).toISOString(),
            dump.category,
            dump.source.file,
            dump.source.line,
            dump.source.function || '',
            dump.content.length,
            this.extractTextContent(dump).substring(0, 100).replace(/"/g, '""')
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
            
        return csvContent;
    }
    
    convertToHTML(dumps) {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dump Export - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .dump-item { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .dump-header { border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
        .dump-meta { color: #666; font-size: 14px; }
        .dump-content { font-family: monospace; background: #f8f8f8; padding: 15px; border-radius: 4px; overflow-x: auto; }
        .category { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .category-dumps { background: #e5e7eb; color: #374151; }
        .category-queries { background: #dbeafe; color: #1e40af; }
        .category-requests { background: #d1fae5; color: #065f46; }
        .category-jobs { background: #e9d5ff; color: #6b21a8; }
        .category-views { background: #fee2e2; color: #991b1b; }
        .category-logs { background: #fef3c7; color: #92400e; }
    </style>
</head>
<body>
    <h1>Dump Export</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
    <p>Total dumps: ${dumps.length}</p>
    
    ${dumps.map(dump => `
        <div class="dump-item">
            <div class="dump-header">
                <div class="dump-meta">
                    <span class="category category-${dump.category}">${dump.category}</span>
                    <span>${new Date(dump.timestamp).toLocaleString()}</span>
                    <span>${dump.source.file}:${dump.source.line}</span>
                    ${dump.source.function ? `<span>${dump.source.function}()</span>` : ''}
                </div>
            </div>
            <div class="dump-content">${dump.content}</div>
        </div>
    `).join('')}
</body>
</html>`;
        
        return htmlContent;
    }
    
    convertToText(dumps) {
        return dumps.map(dump => {
            const timestamp = new Date(dump.timestamp).toLocaleString();
            const source = `${dump.source.file}:${dump.source.line}`;
            const func = dump.source.function ? ` in ${dump.source.function}()` : '';
            const content = this.extractTextContent(dump);
            
            return `[${timestamp}] ${dump.category.toUpperCase()} - ${source}${func}\n${content}`;
        }).join('\n\n' + '='.repeat(80) + '\n\n');
    }
    
    extractTextContent(dump) {
        // Remove HTML tags and extract plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = dump.content;
        return tempDiv.textContent || tempDiv.innerText || '';
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    getTimestamp() {
        return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    }
    
    // Dump Selection
    

    setupWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        
        
        this.updateConnectionStatus('connecting');
        
        // Clear any existing connection
        if (this.ws) {
            this.ws.close();
        }
        
        this.ws = new WebSocket(wsUrl);
        
        // Set connection timeout
        const connectionTimeout = setTimeout(() => {
            if (this.ws.readyState === WebSocket.CONNECTING) {
                
                this.ws.close();
                this.handleConnectionError('Connection timeout');
            }
        }, 10000); // 10 second timeout
        
        this.ws.onopen = () => {
            clearTimeout(connectionTimeout);
            
            this.updateConnectionStatus('connected');
            this.resetReconnectAttempts();
            
            // Send initial requests
            this.sendMessage({ type: 'requestDumps' });
            this.requestServerStatus();
            
            // Start heartbeat
            this.startHeartbeat();
            
            showToast('Connected to dump server', 'success');
            // // Show connection success toast only if not already shown in this session
            // if (!localStorage.getItem('dumpViewerConnectionShown')) {
            //     localStorage.setItem('dumpViewerConnectionShown', 'true');
            // }
        };
        
        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleWebSocketMessage(message);
                this.updateLastActivity();
            } catch (error) {
                
            }
        };
        
        this.ws.onclose = (event) => {
            clearTimeout(connectionTimeout);
            this.stopHeartbeat();
            
            
            this.updateConnectionStatus('disconnected');
            
            // Handle different close codes
            if (event.code === 1000) {
                // Normal closure
                
            } else if (event.code === 1006) {
                // Abnormal closure
                
                this.scheduleReconnect();
            } else {
                // Other error codes
                
                this.scheduleReconnect();
            }
        };
        
        this.ws.onerror = (error) => {
            clearTimeout(connectionTimeout);
            
            this.updateConnectionStatus('error');
            this.handleConnectionError('WebSocket error occurred');
        };
    }

    setupEventListeners() {
        // Prevent duplicate event listener setup
        if (this.eventListenersSetup) {
            return;
        }
        this.eventListenersSetup = true;
        // Filter tabs
        document.getElementById('filterTabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (tab) {
                this.setActiveFilter(tab.dataset.filter);
            }
        });

        // Action buttons
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.sendMessage({ type: 'clearDumps' });
        });
        
        // document.getElementById('exportBtn').addEventListener('click', () => {
        //     this.exportDumps(this.activeFilter);
        // });
        
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.sendMessage({ type: 'requestDumps' });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.updateSearchClearButton();
            this.renderDumps();
        });
        
        searchBtn.addEventListener('click', () => {
            searchInput.focus();
        });

        // View options
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.viewMode = e.target.dataset.view;
                this.renderDumps();
            });
        });

        // Modal functionality
        const showInstr = document.getElementById('showInstructionsBtn');
        if (showInstr) showInstr.addEventListener('click', () => { this.showInstructionsModal(); });
        const closeInstr = document.getElementById('closeInstructionsBtn');
        if (closeInstr) closeInstr.addEventListener('click', () => { this.hideInstructionsModal(); });

        // Theme selector
        const themeBtn = document.getElementById('themeBtn');
        const themeDropdown = document.getElementById('themeDropdown');
        
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!themeBtn.contains(e.target) && !themeDropdown.contains(e.target)) {
                themeDropdown.classList.remove('show');
            }
        });
        
        // Theme option clicks
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.changeTheme(theme);
                themeDropdown.classList.remove('show');
                this.updateThemeCheckIcon();
            });
        });
        
        // Initialize theme
        this.updateThemeIcon();
        this.updateThemeCheckIcon();
        
        // Listen for system theme changes
        this.setupSystemThemeListener();
        
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showInstructionsModal();
        });
        
        // Retry connection button
        document.getElementById('retryBtn').addEventListener('click', () => {
            this.retryConnection();
        });

        // Dump controls
        document.getElementById('expandAllBtn').addEventListener('click', () => {
            expandAllDumps();
        });
        
        document.getElementById('collapseAllBtn').addEventListener('click', () => {
            collapseAllDumps();
        });
        
        document.getElementById('autoScrollBtn').addEventListener('click', (e) => {
            const btn = e.currentTarget || e.target;
            // Ensure we pass the actual button, not the nested SVG/icon
            this.toggleAutoScroll(btn);
        });

        // Settings modal
        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            this.hideSettingsModal();
        });
        
        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });
        
        document.getElementById('resetSettingsBtn').addEventListener('click', () => {
            this.resetSettings();
        });

        // Shortcuts panel
        document.getElementById('shortcutsClose').addEventListener('click', () => {
            this.hideShortcutsPanel();
        });
        const shortcutsBtn = document.getElementById('shortcutsBtn');
        if (shortcutsBtn) {
            shortcutsBtn.addEventListener('click', () => this.toggleShortcutsPanel());
        }

        // Toggle shortcuts panel with '?' button in header (helpBtn already opens instructions)
        const shortcutsHotkey = () => this.toggleShortcutsPanel();

        // Advanced filters UI removed

        // Search enhancements
        document.getElementById('searchClearBtn').addEventListener('click', () => {
            this.clearSearch();
        });

        // Export dropdown
        // document.getElementById('exportBtn').addEventListener('click', (e) => {
        //     e.stopPropagation();
        //     this.toggleExportMenu();
        // });
        
        // document.getElementById('exportMenu').addEventListener('click', (e) => {
        //     if (e.target.classList.contains('export-option')) {
        //         const format = e.target.dataset.format;
        //         this.handleExportOption(format);
        //         this.hideExportMenu();
        //     }
        // });
        
        // Bulk actions removed
        
        // Close export menu when clicking outside
        // document.addEventListener('click', () => {
        //     this.hideExportMenu();
        // });

        // Close modal on backdrop click
        document.getElementById('instructionsModal').addEventListener('click', (e) => {
            if (e.target.id === 'instructionsModal') {
                this.hideInstructionsModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                if (e.key === 'Escape') {
                    e.target.blur();
                }
                return;
            }

            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        searchInput.focus();
                        break;
                    case 'u':
                        e.preventDefault();
                        this.sendMessage({ type: 'requestDumps' });
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportDumps(this.activeFilter);
                        break;
                    case 'd':
                        e.preventDefault();
                        this.sendMessage({ type: 'clearDumps' });
                        break;
                    case '=':
                    case '+':
                        e.preventDefault();
                        expandAllDumps();
                        break;
                    case '-':
                        e.preventDefault();
                        collapseAllDumps();
                        break;
                    case 'a':
                        e.preventDefault();
                        this.selectAllDumps();
                        break;
                }
            } else {
                switch (e.key) {
                    case 'Escape':
                        this.hideAllModals();
                        this.hideShortcutsPanel();
                        // selection feature removed; no-op
                        break;
                    case '?':
                        e.preventDefault();
                        this.toggleShortcutsPanel();
                        break;
                    case 'f':
                        e.preventDefault();
                        searchInput.focus();
                        break;
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                        e.preventDefault();
                        this.switchToFilterByNumber(parseInt(e.key) - 1);
                        break;
                }
            }
        });
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });

        this.renderDumps();
    }

    clearDumps() {
        this.dumps = [];
        this.renderDumps();
        this.updateTabCounts();
        this.updateContentTitle(0);
    }

    renderDumps() {
        const dumpList = document.getElementById('dumpList');
        
        if (this.dumps.length === 0) {
            dumpList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><span class="icon-swap" data-icon="info"></span></div>
                    <h3>No dumps yet</h3>
                    <p>Start debugging your PHP application to see dumps here!</p>
                    <div class="empty-actions">
                        <button class="btn btn-primary" id="showInstructionsBtn">Show Setup Instructions</button>
                    </div>
                </div>
            `;
            
            // Re-attach event listener for the dynamically created button
            document.getElementById('showInstructionsBtn').addEventListener('click', () => {
                this.showInstructionsModal();
            });
            // Ensure icons render on first load
            this.replaceIconPlaceholders();
            return;
        }

        // Filter dumps by category, search term, and advanced filters
        let filteredDumps = this.dumps.filter(dump => {
            return this.matchesCategoryFilter(dump) && 
                   this.matchesSearchFilter(dump);
        });

        // Sort by timestamp (newest first)
        filteredDumps.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Update content title
        this.updateContentTitle(filteredDumps.length);

        // Render dumps
        dumpList.innerHTML = filteredDumps.map(dump => this.renderDump(dump)).join('');
        
        // Add click handlers for interactive elements
        this.attachDumpEventListeners();
        
        // Execute Symfony inline scripts; they wire up toggles and carets
        this.executeInlineScripts(dumpList);

        // Swap inline icon placeholders with SVGs
        this.replaceIconPlaceholders();
    }

    renderDump(dump) {
        const timestamp = new Date(dump.timestamp).toLocaleTimeString();
        const fileName = dump.source.file.split('/').pop() || dump.source.file;
        const sourceInfo = `${fileName}:${dump.source.line}`;
        
        // Process the Symfony HTML content
        const processedContent = this.processSymfonyHTML(dump.content);
        
        // Determine if dump has expandable content (kept for potential future UX tweaks)
        const hasExpandableContent = dump.content.includes('sf-dump-toggle') || 
                                   dump.content.includes('sf-dump-expanded') ||
                                   dump.content.includes('sf-dump-compact');
        
        return `
            <div class="dump-item" data-category="${dump.category}" data-dump-id="${dump.id}">
                
                <div class="dump-header">
                    <div class="dump-meta">
                        <span class="dump-time" title="${new Date(dump.timestamp).toLocaleString()}">
                            ${svgIcon('clock')}
                            ${timestamp}
                        </span>
                        <span class="dump-source" title="${dump.source.file}">
                            ${svgIcon('file')}
                            ${sourceInfo}
                        </span>
                        <span class="dump-category category-${dump.category}">
                            <span class="category-icon">${this.getCategoryIcon(dump.category)}</span>
                            ${dump.category}
                        </span>
                        ${dump.source.function ? `
                            <span class="dump-function" title="Function: ${dump.source.function}">
                                <span class="meta-icon">⚡</span>
                                ${dump.source.function}()
                            </span>
                        ` : ''}
                    </div>
                    <div class="dump-actions">
                        <button class="dump-action-btn expand-all-btn" data-action="expand-dump" data-id="${dump.id}" title="Expand All">
                            ${svgIcon('expand')}
                        </button>
                        <button class="dump-action-btn collapse-all-btn" data-action="collapse-dump" data-id="${dump.id}" title="Collapse All">
                            ${svgIcon('collapse')}
                        </button>
                        <button style="display: none;" class="dump-action-btn copy-btn" data-action="copy-dump" data-id="${dump.id}" title="Copy to clipboard">
                            ${svgIcon('copy')}
                        </button>
                        <button style="display: none;" class="dump-action-btn details-btn" data-action="details-dump" data-id="${dump.id}" title="Show Details">
                            ${svgIcon('info')}
                        </button>
                    </div>
                </div>
                <div class="dump-content">
                    <div class="dump-content-wrapper">
                        ${processedContent}
                    </div>
                </div>
            </div>
        `;
    }
    
    processSymfonyHTML(htmlContent) {
        // Preserve Symfony's original markup (including <script> and <style>)
        return htmlContent;
    }

    // Execute inline <script> tags inside a container (needed because innerHTML won't run them)
    executeInlineScripts(container) {
        if (!document.body.classList.contains('sf-js-enabled')) {
            document.body.classList.add('sf-js-enabled');
        }
        const scripts = Array.from(container.querySelectorAll('script'));
        if (scripts.length === 0) return;
        // Since Sfdump is already available from Sfdump.js, we just execute the caller scripts
        const runCode = (code) => {
            const s = document.createElement('script');
            s.text = code;
            document.body.appendChild(s);
        };

        scripts.forEach((oldScript) => {
            if (oldScript.dataset.executed === '1') return;
            const code = oldScript.textContent || '';

            if (!code.trim()) { 
                oldScript.dataset.executed = '1'; 
                return; 
            }
            
            // Execute the script directly since Sfdump is already available
            runCode(code);
            oldScript.dataset.executed = '1';
        });
    }

    // After rendering, initialize Symfony dump toggles for any new dumps
    initializeSymfonyToggles() {
        if (typeof window.Sfdump !== 'function') return;
        const nodes = document.querySelectorAll('.dump-item .sf-dump');
        nodes.forEach(pre => {
            const id = pre.getAttribute('id');
            if (id && !pre.dataset.initialized) {
                try { window.Sfdump(id); pre.dataset.initialized = '1'; } catch (_) {}
            }
        });
    }
    
    addLineNumbers(html) {
        return html.replace(/<pre([^>]*)>(.*?)<\/pre>/gs, (match, attrs, content) => {
            if (content.includes('\n')) {
                const lines = content.split('\n');
                const numberedLines = lines.map((line, index) => {
                    if (line.trim()) {
                        return `<span class="code-line"><span class="line-number">${index + 1}</span>${line}</span>`;
                    }
                    return line;
                }).join('\n');
                return `<pre${attrs}>${numberedLines}</pre>`;
            }
            return match;
        });
    }
    
    enhanceDataStructures(html) {
        // Add visual indicators for arrays and objects
        return html
            .replace(/(\[|\{)/g, '<span class="structure-bracket open-bracket">$1</span>')
            .replace(/(\]|\})/g, '<span class="structure-bracket close-bracket">$1</span>')
            .replace(/=&gt;/g, '<span class="array-arrow">=></span>');
    }
    
    getCategoryIcon(category) {
        const map = {
            'dumps': svgIcon('search'),
            'queries': svgIcon('database'),
            'requests': svgIcon('globe'),
            'jobs': svgIcon('bolt'),
            'views': svgIcon('eye'),
            'logs': svgIcon('note'),
            'all': svgIcon('clipboard')
        };
        return map[category] || svgIcon('clipboard');
    }

    replaceIconPlaceholders() {
        document.querySelectorAll('.icon-swap').forEach(el => {
            const name = el.getAttribute('data-icon');
            if (!name) return;
            el.outerHTML = svgIcon(name);
        });
    }

    updateTabCounts() {
        const counts = {
            all: this.dumps.length,
            dumps: this.dumps.filter(d => d.category === 'dumps').length,
            queries: this.dumps.filter(d => d.category === 'queries').length,
            jobs: this.dumps.filter(d => d.category === 'jobs').length,
            views: this.dumps.filter(d => d.category === 'views').length,
            requests: this.dumps.filter(d => d.category === 'requests').length,
            logs: this.dumps.filter(d => d.category === 'logs').length
        };

        Object.entries(counts).forEach(([filter, count]) => {
            const tab = document.querySelector(`[data-filter="${filter}"]`);
            if (tab) {
                const countElement = tab.querySelector('.tab-count');
                if (countElement) {
                    countElement.textContent = `(${count})`;
                }
            }
        });

        // Update header dump count
        const dumpCountElement = document.querySelector('.dump-count');
        if (dumpCountElement) {
            dumpCountElement.textContent = `${this.dumps.length} dumps`;
        }
    }
    
    updateContentTitle(filteredCount) {
        const contentTitle = document.getElementById('contentTitle');
        const contentSubtitle = document.getElementById('contentSubtitle');
        
        if (this.activeFilter === 'all') {
            contentTitle.textContent = `All Dumps`;
            contentSubtitle.textContent = `${filteredCount} of ${this.dumps.length} dumps`;
        } else {
            const categoryName = this.activeFilter.charAt(0).toUpperCase() + this.activeFilter.slice(1);
            contentTitle.textContent = `${categoryName} Dumps`;
            contentSubtitle.textContent = `${filteredCount} ${this.activeFilter} dumps`;
        }
        
        // Add filter information
        const filterInfo = [];
        
        if (this.searchTerm) {
            filterInfo.push(`search: "${this.searchTerm}"`);
        }
        
        const activeAdvancedFilters = this.getActiveFiltersCount();
        if (activeAdvancedFilters > 0) {
            filterInfo.push(`${activeAdvancedFilters} advanced filters`);
        }
        
        if (filterInfo.length > 0) {
            contentSubtitle.textContent += ` (${filterInfo.join(', ')})`;
        }
    }
    
    showInstructionsModal() {
        const modal = document.getElementById('instructionsModal');
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        
        // Update PHP helper path if available
        this.updatePhpHelperPath();
    }
    
    hideInstructionsModal() {
        const modal = document.getElementById('instructionsModal');
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
    
    updatePhpHelperPath() {
        // This would be updated with the actual path from the server
        const phpHelperElement = document.getElementById('phpHelperPath');
        if (phpHelperElement) {
            phpHelperElement.textContent = "require_once '/path/to/dumper/dumper.php';";
        }
    }
    
    attachDumpEventListeners() {
        // Wire dump-level action buttons (expand/collapse/copy/details)
        document.querySelectorAll('.dump-actions .dump-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const id = btn.getAttribute('data-id');
                if (!action || !id) return;
                switch (action) {
                    case 'expand-dump':
                        expandDumpContent(id);
                        break;
                    case 'collapse-dump':
                        collapseDumpContent(id);
                        break;
                    case 'copy-dump':
                        copyDump(id, e);
                        break;
                    case 'details-dump':
                        showDumpDetails(id);
                        break;
                }
            });
        });

        // Do not hijack Symfony's own toggle handlers; their inline JS wires clicks

        // Add hover effects for dump items
        document.querySelectorAll('.dump-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.classList.add('dump-hover');
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('dump-hover');
            });
        });
        
        // Manual caret toggle fallback only when Symfony JS isn't present
        if (typeof window.Sfdump !== 'function') {
            document.querySelectorAll('.sf-dump-toggle').forEach(t => {
                t.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleDumpSection(t);
                });
            });
        }
        
        // Add click handlers for source locations
        document.querySelectorAll('.dump-source').forEach(source => {
            source.addEventListener('click', (e) => {
                e.preventDefault();
                const dumpItem = e.target.closest('.dump-item');
                const dumpId = dumpItem.dataset.dumpId;
                showDumpDetails(dumpId);
            });
        });
        
        // Initialize collapsed state for large dumps
        this.initializeCollapsedState();
    }
    
    initializeCollapsedState() {
        // Auto-collapse large data structures for better performance
        document.querySelectorAll('.sf-dump').forEach(dump => {
            const content = dump.textContent || '';
            if (content.length > 1000) {
                // Find expandable elements and collapse them by default
                dump.querySelectorAll('.sf-dump-expanded').forEach(expanded => {
                    expanded.classList.remove('sf-dump-expanded');
                    expanded.classList.add('sf-dump-compact');
                });
                
                // Update toggle arrows
                dump.querySelectorAll('.toggle-arrow').forEach(arrow => {
                    arrow.textContent = '▶';
                });
            }
        });
    }
    
    expandAllInDump(dumpItem) {
        dumpItem.querySelectorAll('.sf-dump-compact').forEach(el => {
            el.classList.remove('sf-dump-compact');
            el.classList.add('sf-dump-expanded');
        });
    }
    
    collapseAllInDump(dumpItem) {
        dumpItem.querySelectorAll('.sf-dump-expanded').forEach(el => {
            el.classList.remove('sf-dump-expanded');
            el.classList.add('sf-dump-compact');
        });
    }
    
    toggleDumpSection(toggle) {
        // Find the parent expandable element
        const parent = toggle.closest('.sf-dump-expanded, .sf-dump-compact, .dump-expanded, .dump-compact');
        if (parent) {
            const arrow = toggle.querySelector('.toggle-arrow');
            
            if (parent.classList.contains('sf-dump-expanded') || parent.classList.contains('dump-expanded')) {
                // Collapse
                parent.classList.remove('sf-dump-expanded', 'dump-expanded');
                parent.classList.add('sf-dump-compact', 'dump-compact');
                if (arrow) arrow.textContent = '▶';
            } else {
                // Expand
                parent.classList.remove('sf-dump-compact', 'dump-compact');
                parent.classList.add('sf-dump-expanded', 'dump-expanded');
                if (arrow) arrow.textContent = '▼';
            }
        } else {
            // Handle cases where the toggle is the direct parent
            const nextSibling = toggle.nextElementSibling;
            if (nextSibling) {
                const arrow = toggle.querySelector('.toggle-arrow');
                
                if (nextSibling.style.display === 'none') {
                    nextSibling.style.display = 'block';
                    if (arrow) arrow.textContent = '▼';
                } else {
                    nextSibling.style.display = 'none';
                    if (arrow) arrow.textContent = '▶';
                }
            }
        }
    }

    // Removed caret injection; Symfony provides carets. Keep method stub in case of future fallback needs.
    ensureToggleCarets() {}

    handleWebSocketMessage(message) {
        
        
        try {
            switch (message.type) {
                case 'dump':
                    this.addDump(message.data);
                    this.playNotificationSound();
                    break;
                    
                case 'dumps':
                    this.loadDumps(message.data);
                    break;
                    
                case 'status':
                    this.updateServerStatus(message.data);
                    break;
                    
                case 'clear':
                    this.clearDumps();
                    showToast('All dumps cleared', 'info');
                    break;
                    
                case 'error':
                    const errorMsg = message.data?.message || 'Unknown server error';
                    
                    // showToast(`Server error: ${errorMsg}`, 'error');
                    break;
                    
                case 'pong':
                    
                    break;
                    
                default:
                    
            }
        } catch (error) {
            
            // showToast('Error processing server message', 'error');
        }
    }
    
    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(JSON.stringify(message));
                
            } catch (error) {
                
                // showToast('Failed to send message to server', 'error');
            }
        } else {
            
            
            // Queue message for when connection is restored (for important messages)
            if (message.type === 'requestDumps' || message.type === 'clearDumps') {
                this.queueMessage(message);
            }
        }
    }
    
    queueMessage(message) {
        if (!this.messageQueue) {
            this.messageQueue = [];
        }
        
        // Avoid duplicate messages
        const exists = this.messageQueue.some(m => m.type === message.type);
        if (!exists) {
            this.messageQueue.push(message);
            
        }
    }
    
    processQueuedMessages() {
        if (this.messageQueue && this.messageQueue.length > 0) {
            
            
            this.messageQueue.forEach(message => {
                this.sendMessage(message);
            });
            
            this.messageQueue = [];
        }
    }
    
    addDump(dumpData) {
        // Add timestamp if not present
        if (!dumpData.timestamp) {
            dumpData.timestamp = new Date().toISOString();
        }
        
        this.dumps.unshift(dumpData); // Add to beginning for newest-first order
        
        // Limit dumps based on settings
        if (this.dumps.length > this.settings.maxDumps) {
            this.dumps = this.dumps.slice(0, this.settings.maxDumps);
            
        }
        
        this.renderDumps();
        this.updateTabCounts();
        this.updateServerInfo();
        
        // Show notification for new dump
        const fileName = dumpData.source.file.split('/').pop() || dumpData.source.file;
        this.showNotification(`New ${dumpData.category} dump from ${fileName}:${dumpData.source.line}`);
        
        // Scroll to top to show new dump (if user is near the top)
        const dumpList = document.getElementById('dumpList');
        if (dumpList.scrollTop < 100) {
            dumpList.scrollTop = 0;
        }
        
        // Flash the new dump briefly
        setTimeout(() => {
            const firstDump = dumpList.querySelector('.dump-item');
            if (firstDump) {
                firstDump.classList.add('dump-new');
                setTimeout(() => {
                    firstDump.classList.remove('dump-new');
                }, 2000);
            }
        }, 100);
    }
    
    loadDumps(dumps) {
        this.dumps = dumps;
        this.updateTabCounts();
        this.renderDumps();
        this.updateContentTitle(this.dumps.length);
        this.updateServerInfo();
        this.attachDumpEventListeners();
        this.executeInlineScripts(document.getElementById('dumpList'));
    }
    
    updateServerStatus(status) {
        this.serverStats = status;
        
        // Update connection status and other server info
        if (status.message) {
            
        }
        
        // Update sidebar stats
        this.updateSidebarStats(status);
        
        // Update connection indicator if server provides connection info
        if (status.tcpClientConnected !== undefined) {
            const indicator = document.querySelector('.status-indicator');
            if (indicator) {
                if (status.tcpClientConnected && this.connectionState === 'connected') {
                    indicator.classList.add('connected');
                } else {
                    indicator.classList.remove('connected');
                }
            }
        }
    }
    
    updateSidebarStats(status) {
        const memoryElement = document.getElementById('memoryUsage');
        const uptimeElement = document.getElementById('uptime');
        
        if (memoryElement && status.totalDumps !== undefined) {
            // Estimate memory usage based on dump count
            const estimatedMemory = Math.round((status.totalDumps * 2048) / 1024); // Rough estimate
            memoryElement.textContent = `${estimatedMemory} KB`;
        }
        
        if (uptimeElement) {
            // Calculate uptime from page load
            const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(uptimeSeconds / 60);
            const seconds = uptimeSeconds % 60;
            
            if (minutes > 0) {
                uptimeElement.textContent = `${minutes}m ${seconds}s`;
            } else {
                uptimeElement.textContent = `${seconds}s`;
            }
        }
    }
    
    showNotification(message) {
        
        
        // Show toast notification
        // showToast(message, 'info');
        
        // Update browser title with dump count
        document.title = `(${this.dumps.length}) Symfony Dump Viewer`;
    }
    
    playNotificationSound() {
        // Play a subtle notification sound (optional)
        try {
            // Create a short beep sound using Web Audio API
            if (this.audioContext) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }
        } catch (error) {
            // Ignore audio errors
        }
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            
        }
    }
    
    updateServerInfo() {
        // Update server info in header
        const serverInfo = document.getElementById('serverInfo');
        if (serverInfo) {
            const portElement = serverInfo.querySelector('.server-port');
            const dumpCountElement = serverInfo.querySelector('.dump-count');
            
            if (portElement) {
                portElement.textContent = `Port: ${window.location.port || '80'}`;
            }
            
            if (dumpCountElement) {
                dumpCountElement.textContent = `${this.dumps.length} dumps`;
            }
        }
    }
    
    // API methods for HTTP requests
    async fetchDumps(filter = {}) {
        try {
            const params = new URLSearchParams();
            if (filter.category && filter.category !== 'all') {
                params.append('category', filter.category);
            }
            if (filter.search) {
                params.append('search', filter.search);
            }
            
            const response = await fetch(`/api/dumps?${params}`);
            const data = await response.json();
            return data.dumps;
        } catch (error) {
            
            return [];
        }
    }
    
    async clearDumpsAPI() {
        try {
            const response = await fetch('/api/dumps', { method: 'DELETE' });
            if (response.ok) {
                this.clearDumps();
                
            }
        } catch (error) {
            
        }
    }
    
    async exportDumps(category = 'all') {
        try {
            const params = new URLSearchParams();
            if (category !== 'all') {
                params.append('category', category);
            }
            
            const response = await fetch(`/api/export?${params}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dumps-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
            }
        } catch (error) {
            
        }
    }
    
    async getServerStatus() {
        try {
            const response = await fetch('/api/status');
            const status = await response.json();
            return status;
        } catch (error) {
            
            return null;
        }
    }

    updateConnectionStatus(status) {
        this.connectionState = status;
        const statusElement = document.getElementById('connectionStatus');
        const indicator = statusElement.querySelector('.status-indicator');
        const text = statusElement.querySelector('.status-text');
        const retryBtn = document.getElementById('retryBtn');

        indicator.className = `status-indicator ${status}`;
        
        switch (status) {
            case 'connected':
                text.textContent = 'Connected';
                retryBtn.style.display = 'none';
                break;
            case 'disconnected':
                text.textContent = 'Disconnected';
                retryBtn.style.display = 'inline-block';
                break;
            case 'connecting':
                text.textContent = 'Connecting...';
                retryBtn.style.display = 'none';
                break;
            case 'reconnecting':
                text.textContent = `Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`;
                retryBtn.style.display = 'none';
                break;
            case 'error':
                text.textContent = 'Connection Error';
                retryBtn.style.display = 'inline-block';
                break;
            default:
                text.textContent = 'Unknown';
                retryBtn.style.display = 'inline-block';
        }
    }
    
    retryConnection() {
        
        this.resetReconnectAttempts();
        this.setupWebSocket();
        // showToast('Retrying connection...', 'info');
    }
    
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            
            this.updateConnectionStatus('error');
            // Clear connection success flag when connection fails
        // localStorage.removeItem('dumpViewerConnectionShown');
        showToast('Connection failed. Please refresh the page.', 'error');
            return;
        }
        
        this.reconnectAttempts++;
        const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000); // Exponential backoff, max 30s
        
        
        this.updateConnectionStatus('reconnecting');
        
        this.reconnectTimer = setTimeout(() => {
            
            this.setupWebSocket();
        }, delay);
    }
    
    resetReconnectAttempts() {
        this.reconnectAttempts = 0;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }
    
    handleConnectionError(message) {
        
        // showToast(message, 'error');
        
        if (this.connectionState !== 'error') {
            this.scheduleReconnect();
        }
    }
    
    startHeartbeat() {
        this.stopHeartbeat(); // Clear any existing heartbeat
        
        this.heartbeatTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                // Check if we've received any activity recently
                const timeSinceLastActivity = Date.now() - this.lastActivity;
                
                if (timeSinceLastActivity > 60000) { // 1 minute without activity
                    
                    this.sendMessage({ type: 'ping' });
                }
                
                // Check for stale connection (no activity for 2 minutes)
                if (timeSinceLastActivity > 120000) {
                    
                    this.ws.close();
                }
            }
        }, 30000); // Check every 30 seconds
    }
    
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    
    updateLastActivity() {
        this.lastActivity = Date.now();
    }
    
    requestServerStatus() {
        this.sendMessage({ type: 'requestStatus' });
    }
}

// Utility functions

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const text = element.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // showToast('Copied to clipboard!', 'success');
        }).catch(err => {
            
            // showToast('Failed to copy', 'error');
        });
    }
}

function showToast(message, type = 'info') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add toast styles if not already added
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
                pointer-events: none;
            }
            .toast-success { background: linear-gradient(135deg, #10b981, #059669); }
            .toast-error { background: linear-gradient(135deg, #ef4444, #dc2626); }
            .toast-info { background: linear-gradient(135deg, #3b82f6, #2563eb); }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

function expandDumpContent(dumpId) {
    const dumpItem = document.querySelector(`[data-dump-id="${dumpId}"]`);
    if (!dumpItem) return;
    dumpItem.querySelectorAll('.sf-dump-compact, .dump-compact').forEach(node => {
        node.classList.remove('sf-dump-compact', 'dump-compact');
        node.classList.add('sf-dump-expanded', 'dump-expanded');
        if (node.style && node.style.display === 'none') node.style.display = '';
    });
    dumpItem.querySelectorAll('.sf-dump-toggle').forEach(t => t.setAttribute('aria-expanded', 'true'));
}

function collapseDumpContent(dumpId) {
    const dumpItem = document.querySelector(`[data-dump-id="${dumpId}"]`);
    if (!dumpItem) return;
    dumpItem.querySelectorAll('.sf-dump-expanded, .dump-expanded').forEach(node => {
        node.classList.remove('sf-dump-expanded', 'dump-expanded');
        node.classList.add('sf-dump-compact', 'dump-compact');
        if (node.style) node.style.display = 'none';
    });
    dumpItem.querySelectorAll('.sf-dump-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
}

function expandAllDumps() {
    if (!document.body.classList.contains('sf-js-enabled')) {
        document.body.classList.add('sf-js-enabled');
    }
    document.querySelectorAll('.sf-dump-compact, .dump-compact').forEach(node => {
        node.classList.remove('sf-dump-compact', 'dump-compact');
        node.classList.add('sf-dump-expanded', 'dump-expanded');
        if (node.style && node.style.display === 'none') node.style.display = '';
    });
    document.querySelectorAll('.sf-dump-toggle').forEach(t => t.setAttribute('aria-expanded', 'true'));
}

function collapseAllDumps() {
    document.querySelectorAll('.sf-dump-expanded, .dump-expanded').forEach(node => {
        node.classList.remove('sf-dump-expanded', 'dump-expanded');
        node.classList.add('sf-dump-compact', 'dump-compact');
        if (node.style) node.style.display = 'none';
    });
    document.querySelectorAll('.sf-dump-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
}

function showDumpDetails(dumpId) {
    // Prevent multiple modals for the same dump
    const existingModal = document.querySelector('.dump-details-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const dump = window.dumpViewer.dumps.find(d => d.id === dumpId);
    if (dump) {
        const modal = createDumpDetailsModal(dump);
        document.body.appendChild(modal);
        modal.classList.add('show');
    }
}

function createDumpDetailsModal(dump) {
    const modal = document.createElement('div');
    modal.className = 'modal dump-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Dump Details</h3>
                <button class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h4>Source Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">File:</span>
                            <span class="detail-value">${dump.source.file}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Line:</span>
                            <span class="detail-value">${dump.source.line}</span>
                        </div>
                        ${dump.source.function ? `
                            <div class="detail-item">
                                <span class="detail-label">Function:</span>
                                <span class="detail-value">${dump.source.function}()</span>
                            </div>
                        ` : ''}
                        ${dump.source.class ? `
                            <div class="detail-item">
                                <span class="detail-label">Class:</span>
                                <span class="detail-value">${dump.source.class}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Dump Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Category:</span>
                            <span class="detail-value category-${dump.category}">${dump.category}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Timestamp:</span>
                            <span class="detail-value">${new Date(dump.timestamp).toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Content Size:</span>
                            <span class="detail-value">${dump.content.length} characters</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">ID:</span>
                            <span class="detail-value code">${dump.id}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Actions</h4>
                    <div class="detail-actions">
                        <button class="btn btn-secondary" onclick="copySourceLocation('${dump.source.file}', ${dump.source.line})">
                            <span class="btn-icon">${svgIcon('pin')}</span>
                            Copy Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        closeDumpDetailsModal(closeBtn);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDumpDetailsModal(closeBtn);
        }
    });
    
    return modal;
}

function closeDumpDetailsModal(closeBtn) {
    const modal = closeBtn.closest('.modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}



function copySourceLocation(file, line) {
    const location = `${file}:${line}`;
    const button = event.target.closest('.btn');
    
    navigator.clipboard.writeText(location).then(() => {
        // Change button text to "Copied!"
        button.innerHTML = `<span class="btn-icon">${svgIcon('pin')}</span>Copied!`;
        
        // Revert back after 2 seconds
        setTimeout(() => {
            button.innerHTML = `<span class="btn-icon">${svgIcon('pin')}</span>Copy Location`;
        }, 2000);
    }).catch(err => {
        // showToast('Failed to copy location', 'error');
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dumpViewer = new DumpViewerApp();
    
    // Make utility functions globally available
    window.expandAllDumps = expandAllDumps;
    window.collapseAllDumps = collapseAllDumps;
    window.closeDumpDetailsModal = closeDumpDetailsModal;
});