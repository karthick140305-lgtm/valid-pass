document.addEventListener('DOMContentLoaded', () => {
    // Navigation Tabs Setup
    const navItems = document.querySelectorAll('.bottom-nav-item');
    const views = document.querySelectorAll('.view');
    const statusHeader = document.querySelector('.phone-header');

    function switchView(targetViewId) {
        // Remove active class from all nav items and views
        navItems.forEach(item => item.classList.remove('active'));
        views.forEach(view => view.classList.remove('active'));

        // Find the active nav item and view
        const targetNav = document.querySelector(`.bottom-nav-item[data-view="${targetViewId}"]`);
        const targetView = document.getElementById(`view-${targetViewId}`);

        if (targetNav && targetView) {
            targetNav.classList.add('active');
            targetView.classList.add('active');
        }

        // Adjust Status Bar Text Color dynamically for the view
        if (targetViewId === 'passes') {
            statusHeader.classList.remove('dark-text');
        } else {
            statusHeader.classList.add('dark-text');
        }

        // Save last active view to sessionStorage
        sessionStorage.setItem('activeView', targetViewId);
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = item.getAttribute('data-view');
            switchView(targetView);
        });
    });

    // Load last active view or default to 'passes'
    const lastActiveView = sessionStorage.getItem('activeView') || 'passes';
    switchView(lastActiveView);


    // --- Live Ticking Date & Time Clock ---
    const statusBarTime = document.getElementById('status-time');
    const passLiveDate = document.getElementById('pass-live-date');
    const passLiveTime = document.getElementById('pass-live-time');

    function updateClock() {
        const now = new Date();

        // 1. Status Bar Time (e.g., "6:43" in 12-hour format)
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        statusBarTime.textContent = `${hours}:${minutes}`;

        // 2. Pass Live Date (e.g., "Aug 6")
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = months[now.getMonth()];
        const currentDate = now.getDate();
        if (passLiveDate) {
            passLiveDate.textContent = `${currentMonth} ${currentDate}`;
        }

        // 3. Pass Live Time (e.g., "06:30:33" 12-hour ticking or 24-hour style matching screenshot)
        // The screenshot shows "06:30:33", which is 12-hour or 24-hour style with seconds
        const rawHours = now.getHours();
        const displayHours = String(rawHours % 12 || 12).padStart(2, '0');
        const displayMinutes = String(now.getMinutes()).padStart(2, '0');
        const displaySeconds = String(now.getSeconds()).padStart(2, '0');
        
        if (passLiveTime) {
            passLiveTime.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
        }
    }

    // Run clock updates
    setInterval(updateClock, 1000);
    updateClock(); // Initial call


    // --- Dynamic Validity Date Synchronization ---
    const validityInput = document.getElementById('validity-input');
    const cardValidDate = document.getElementById('card-valid-date');

    // Calculate default date (current date + 12 days)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 12);
    const defDay = String(defaultDate.getDate()).padStart(2, '0');
    const defMonth = String(defaultDate.getMonth() + 1).padStart(2, '0');
    const defYear = defaultDate.getFullYear();
    
    const defaultDMY = `${defDay}/${defMonth}/${defYear}`;
    const defaultYMD = `${defYear}-${defMonth}-${defDay}`;

    // Helper to format date from YYYY-MM-DD to DD/MM/YYYY
    function formatToDMY(dateString) {
        if (!dateString) return defaultDMY;
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateString;
    }

    // Helper to format date from DD/MM/YYYY to YYYY-MM-DD (for the date input default value)
    function formatToYMD(dateString) {
        if (!dateString) return defaultYMD;
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateString;
    }

    // Load initial validity date
    let savedValidity = localStorage.getItem('passValidityDate') || defaultDMY;
    cardValidDate.textContent = savedValidity;
    validityInput.value = formatToYMD(savedValidity);

    // Save and Update validity on input change
    validityInput.addEventListener('input', (e) => {
        const selectedDate = e.target.value;
        const formattedDate = formatToDMY(selectedDate);
        
        // Update display text on the pass
        cardValidDate.textContent = formattedDate;
        
        // Save to localStorage
        localStorage.setItem('passValidityDate', formattedDate);
    });


    // --- UI Interactions Feedback (Toasts) ---
    function showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.position = 'absolute';
        toast.style.bottom = '90px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'rgba(0, 0, 0, 0.8)';
        toast.style.color = '#fff';
        toast.style.padding = '8px 16px';
        toast.style.borderRadius = '20px';
        toast.style.fontSize = '0.75rem';
        toast.style.fontWeight = '600';
        toast.style.zIndex = '999';
        toast.style.whiteSpace = 'nowrap';
        toast.style.transition = 'opacity 0.3s';
        toast.textContent = message;

        const activeScreen = document.querySelector('.phone-screen');
        activeScreen.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 1500);
    }

    // Add event listeners to simulate active features
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceName = card.querySelector('span').textContent;
            showToast(`${serviceName} booking prototype`);
        });
    });

    // Slide-in Detail Panel Elements
    const detailPanel = document.getElementById('settings-detail-panel');
    const detailTitle = document.getElementById('settings-detail-title');
    const detailContent = document.getElementById('settings-detail-content');
    const detailBackBtn = document.getElementById('settings-detail-back-btn');

    // Close settings detail panel
    if (detailBackBtn) {
        detailBackBtn.addEventListener('click', () => {
            detailPanel.classList.remove('active');
        });
    }

    // Settings sub-pages content dictionary
    const settingsDetailData = {
        'Favourites': {
            title: 'Favourites',
            html: `
                <div class="detail-section">
                    <p class="section-desc">Quick access to your preferred routes and stations.</p>
                    <div class="fav-item">
                        <div class="fav-icon">⭐</div>
                        <div class="fav-info">
                            <div class="fav-title">Route 70 Bus</div>
                            <div class="fav-subtitle">Vadapalani to Poonamallee B.T.</div>
                        </div>
                    </div>
                    <div class="fav-item">
                        <div class="fav-icon">⭐</div>
                        <div class="fav-info">
                            <div class="fav-title">Chennai Metro Line</div>
                            <div class="fav-subtitle">M.G.R. Central to Guindy Metro</div>
                        </div>
                    </div>
                    <div class="fav-item">
                        <div class="fav-icon">⭐</div>
                        <div class="fav-info">
                            <div class="fav-title">Route 25G Bus</div>
                            <div class="fav-subtitle">Poonamallee to Anna Square</div>
                        </div>
                    </div>
                </div>
            `
        },
        'Transit Preferences': {
            title: 'Transit Preferences',
            html: `
                <div class="detail-section">
                    <p class="section-desc">Toggle your default transit methods for journey planning.</p>
                    <div class="toggle-row">
                        <span>Chennai Metro</span>
                        <label class="switch-toggle">
                            <input type="checkbox" checked>
                            <span class="switch-slider"></span>
                        </label>
                    </div>
                    <div class="toggle-row">
                        <span>MTC Bus</span>
                        <label class="switch-toggle">
                            <input type="checkbox" checked>
                            <span class="switch-slider"></span>
                        </label>
                    </div>
                    <div class="toggle-row">
                        <span>Auto Rickshaw</span>
                        <label class="switch-toggle">
                            <input type="checkbox">
                            <span class="switch-slider"></span>
                        </label>
                    </div>
                    <div class="toggle-row">
                        <span>Suburban Railway</span>
                        <label class="switch-toggle">
                            <input type="checkbox" checked>
                            <span class="switch-slider"></span>
                        </label>
                    </div>
                </div>
            `
        },
        'Payment Management': {
            title: 'Payment Management',
            html: `
                <div class="detail-section">
                    <p class="section-desc">Manage your saved cards, wallets, and UPI handles.</p>
                    <div class="payment-card-row">
                        <span class="card-brand">💳 Credit Card</span>
                        <span class="card-no">•••• 4321</span>
                    </div>
                    <div class="payment-card-row">
                        <span class="card-brand">🟢 UPI (Google Pay)</span>
                        <span class="card-no">ganesh@okaxis</span>
                    </div>
                    <div class="payment-card-row">
                        <span class="card-brand">📱 Paytm Wallet</span>
                        <span class="card-no">₹ 250.00</span>
                    </div>
                    <button class="add-payment-btn" onclick="alert('Add card process triggered')">+ Add New Payment Method</button>
                </div>
            `
        },
        'Share with Friends': {
            title: 'Share with Friends',
            html: `
                <div class="detail-section share-promo-box">
                    <div class="share-gift-icon">🎁</div>
                    <h3>Spread the Word</h3>
                    <p>Share Chennai One app with your friends to make transit easier for everyone!</p>
                    <div class="ref-code-box">
                        <span class="ref-label">Your Referral Code:</span>
                        <span class="ref-code">CH1-GANESH</span>
                    </div>
                    <button class="share-action-btn" onclick="navigator.clipboard.writeText('CH1-GANESH'); alert('Referral code copied to clipboard!');">Copy Code</button>
                </div>
            `
        },
        'My Rides': {
            title: 'My Rides',
            html: `
                <div class="detail-section">
                    <p class="section-desc">View your recently completed journeys and commutes.</p>
                    <div class="ride-history-item">
                        <span class="ride-route">Central Metro ➔ Guindy</span>
                        <span class="ride-meta">Today • Metro • ₹40</span>
                    </div>
                    <div class="ride-history-item">
                        <span class="ride-route">Avichi School ➔ Poonamallee B.T</span>
                        <span class="ride-meta">Yesterday • Bus Route 70 • ₹20</span>
                    </div>
                    <div class="ride-history-item">
                        <span class="ride-route">Koyambedu ➔ T. Nagar</span>
                        <span class="ride-meta">3 Aug 2026 • Auto • ₹120</span>
                    </div>
                </div>
            `
        },
        'Help and Support': {
            title: 'Help and Support',
            html: `
                <div class="detail-section">
                    <p class="section-desc">Have a question or run into transit issues? Get in touch.</p>
                    <div class="contact-item">
                        <strong>📞 Transit Helpline</strong>
                        <span>1800 425 1111</span>
                    </div>
                    <div class="contact-item">
                        <strong>🚑 Medical SOS</strong>
                        <span>108</span>
                    </div>
                    <div class="contact-item">
                        <strong>✉️ Support Email</strong>
                        <span>support@chennaione.in</span>
                    </div>
                    <h3 class="group-title" style="margin-top: 20px; font-size: 0.9rem; font-weight: 700; color: #000; margin-bottom: 8px;">Frequently Asked Questions</h3>
                    <div class="toggle-row" style="font-size: 0.78rem;" onclick="alert('FAQs document opened')">
                        <span>How do I refund my digital ticket?</span>
                        <span style="color: #007aff; font-weight: 600;">View FAQ</span>
                    </div>
                </div>
            `
        },
        'Safety': {
            title: 'Safety',
            html: `
                <div class="detail-section safety-screen" style="text-align: center;">
                    <button class="sos-trigger-btn" onclick="alert('SOS Alert Triggered! Transit authorities and emergency contacts have been notified of your GPS coordinates.')">🚨 Emergency SOS</button>
                    <p class="sos-warning">Pressing the SOS button triggers an instant alert to the transit control center and broadcasts your live location.</p>
                    <h3 class="group-title" style="text-align: left; font-size: 0.9rem; font-weight: 700; color: #000; margin-bottom: 8px; margin-top: 16px;">Emergency Call Contacts</h3>
                    <div class="emergency-contact-row">
                        <span>Transit Police</span>
                        <span>100</span>
                    </div>
                    <div class="emergency-contact-row">
                        <span>Women Helpline</span>
                        <span>1091</span>
                    </div>
                </div>
            `
        },
        'About Us': {
            title: 'About Us',
            html: `
                <div class="detail-section about-box">
                    <div class="app-logo-large">Chennai One</div>
                    <div class="app-version">Version 4.8.2</div>
                    <p>An integrated smart transit assistance and booking application powered by the Department of Transportation, Government of Tamil Nadu.</p>
                    <div class="about-links">
                        <span onclick="alert('Terms of Service')">Terms of Service</span>
                        <span onclick="alert('Privacy Policy')">Privacy Policy</span>
                    </div>
                </div>
            `
        },
        'App Language': {
            title: 'App Language',
            html: `
                <div class="detail-section">
                    <p class="section-desc">Select your preferred system language.</p>
                    <div class="lang-option checked" onclick="alert('Language set to English');">
                        <span>English</span>
                        <span class="lang-check">✓</span>
                    </div>
                    <div class="lang-option" onclick="alert('தமிழ் மொழி தேர்வு செய்யப்பட்டது');">
                        <span>தமிழ் (Tamil)</span>
                        <span class="lang-check"></span>
                    </div>
                    <div class="lang-option" onclick="alert('Hindi language selected');">
                        <span>हिन्दी (Hindi)</span>
                        <span class="lang-check"></span>
                    </div>
                </div>
            `
        },
        'Logout': {
            title: 'Logout',
            html: `
                <div class="detail-section logout-prompt">
                    <p>Are you sure you want to log out of GaneshKarthick M?</p>
                    <button class="confirm-logout-btn" onclick="alert('Logging out...'); location.reload();">Log Out</button>
                </div>
            `
        }
    };

    // Attach click listeners to settings items to open details panel
    document.querySelectorAll('.settings-item').forEach(item => {
        item.addEventListener('click', () => {
            const textElement = item.querySelector('.settings-item-left span:not(.settings-item-icon)');
            if (!textElement) return;
            const optionName = textElement.textContent.trim();
            
            // Skip validity picker as it has its own inline date trigger
            if (optionName === 'Validity') return;

            const data = settingsDetailData[optionName];
            if (data && detailPanel && detailTitle && detailContent) {
                detailTitle.textContent = data.title;
                detailContent.innerHTML = data.html;
                detailPanel.classList.add('active');
            }
        });
    });

    const planJourneyBtn = document.querySelector('.live-plan-btn');
    if (planJourneyBtn) {
        planJourneyBtn.addEventListener('click', () => {
            showToast("Searching active routes...");
        });
    }

    const homeSearch = document.querySelector('.home-search-bar');
    if (homeSearch) {
        homeSearch.addEventListener('click', () => {
            showToast("Search bus routes...");
        });
    }
});
