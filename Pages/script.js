let trialTimerInterval = 0;
        let remainingSeconds = 0;
        let removalConfirmed = false;

        function callAHK(funcName, ...args) {
            try {
                const macroFuncs = window.chrome.webview.hostObjects.MacroFuncs;
                if (macroFuncs && macroFuncs[funcName]) {
                    macroFuncs[funcName](...args);
                } else {
                    console.error(`AHK function '${funcName}' not found.`);
                }
            } catch (e) {
                console.error('Error calling AHK function:', e);
            }
        }

        async function initializeUI() {
            console.log('Initializing UI...');
            try {
                if (!window.chrome || !window.chrome.webview || !window.chrome.webview.hostObjects || !window.chrome.webview.hostObjects.MacroFuncs) {
                    console.error('Host objects not ready. Retrying in 1 second...');
                    setTimeout(initializeUI, 1000);
                    return;
                }

                await window.chrome.webview.hostObjects.MacroFuncs.loadAllSettings();

                const autoFleetRepairEnabled = await window.chrome.webview.hostObjects.MacroFuncs.getAutoFleetRepairEnabled();
                console.log('Loaded autoFleetRepairEnabled:', autoFleetRepairEnabled);
                document.getElementById('toggleAutoFleetRepair').checked = autoFleetRepairEnabled;
                const autoFleetRepairKey = await window.chrome.webview.hostObjects.MacroFuncs.getAutoFleetRepairKey();
                console.log('Loaded autoFleetRepairKey:', autoFleetRepairKey);
                document.getElementById('autoFleetRepairKey').value = autoFleetRepairKey;
                const autoFleetRepairInterval = await window.chrome.webview.hostObjects.MacroFuncs.getAutoFleetRepairInterval();
                console.log('Loaded autoFleetRepairInterval:', autoFleetRepairInterval);
                document.getElementById('autoFleetRepairInterval').value = autoFleetRepairInterval;
                console.log('Setting autoFleetRepairInterval to:', autoFleetRepairInterval);
                const details = document.getElementById('autoFleetRepairDetails');
                details.style.display = autoFleetRepairEnabled ? 'block' : 'none';
                const isPremium = await window.chrome.webview.hostObjects.MacroFuncs.getIsPremium();
                document.getElementById('autoFleetRepairGroup').style.display = isPremium ? 'block' : 'none';
                const toggleDarkSeaI1 = await window.chrome.webview.hostObjects.MacroFuncs.getToggleDarkSeaI1();
                document.getElementById('toggleDarkSeaI1').checked = toggleDarkSeaI1;
                const darkSeaI1Key = await window.chrome.webview.hostObjects.MacroFuncs.getDarkSeaI1Key();
                document.getElementById('darkSeaI1Key').value = darkSeaI1Key;
                const darkSeaI1Details = document.getElementById('darkSeaI1Details');
                darkSeaI1Details.style.display = toggleDarkSeaI1 ? 'block' : 'none';

                const triggerConfidence = await window.chrome.webview.hostObjects.MacroFuncs.getFishTriggerConfidence();
                document.getElementById('fishTriggerConfidence').value = triggerConfidence;
                const method = await window.chrome.webview.hostObjects.MacroFuncs.getCurrentMethod();
                document.getElementById('methodSelect').value = method.toLowerCase();
                const key = await window.chrome.webview.hostObjects.MacroFuncs.getCurrentKey();
                document.getElementById('keySelect').value = key;
                const secondaryKey = await window.chrome.webview.hostObjects.MacroFuncs.getCurrentSecondaryKey();
                document.getElementById('secondaryKeySelect').value = secondaryKey;
                const toggleSecondary = await window.chrome.webview.hostObjects.MacroFuncs.getToggleSecondary();
                document.getElementById('toggleSecondary').checked = toggleSecondary;

                const cameraAdjustKey = await window.chrome.webview.hostObjects.MacroFuncs.getCameraAdjustKey();
                document.getElementById('cameraAdjustKey').value = cameraAdjustKey;
                const startMacroKey = await window.chrome.webview.hostObjects.MacroFuncs.getStartMacroKey();
                document.getElementById('startMacroKey').value = startMacroKey;
                const reloadMacroKey = await window.chrome.webview.hostObjects.MacroFuncs.getReloadMacroKey();
                document.getElementById('reloadMacroKey').value = reloadMacroKey;
                const screenshotKey = await window.chrome.webview.hostObjects.MacroFuncs.getScreenshotKey();
                document.getElementById('screenshotKey').value = screenshotKey;
                const exitKey = await window.chrome.webview.hostObjects.MacroFuncs.getExitKey();
                document.getElementById('exitKey').value = exitKey;

                const autoLureInterval = await window.chrome.webview.hostObjects.MacroFuncs.getAutoLureInterval();
                document.getElementById('autoLureInterval').value = autoLureInterval;
                const lureDetails = document.getElementById('autoLureDetails');
                lureDetails.style.display = toggleSecondary ? 'block' : 'none';
                const secondarySelect = document.getElementById('secondaryKeySelect');
                secondarySelect.style.display = toggleSecondary ? 'block' : 'none';
                const lureGroup = document.getElementById('lureKeyGroup');
                lureGroup.style.display = toggleSecondary ? 'flex' : 'none';

                const toggleFleetResupply = await window.chrome.webview.hostObjects.MacroFuncs.getToggleFleetResupply();
                document.getElementById('toggleFleetResupply').checked = toggleFleetResupply;
                const fleetResupplyKey = await window.chrome.webview.hostObjects.MacroFuncs.getFleetResupplyKey();
                document.getElementById('fleetResupplyKey').value = fleetResupplyKey;
                const fleetResupplyInterval = await window.chrome.webview.hostObjects.MacroFuncs.getFleetResupplyInterval();
                document.getElementById('fleetResupplyInterval').value = fleetResupplyInterval;
                const fleetResupplyDetails = document.getElementById('fleetResupplyDetails');
                fleetResupplyDetails.style.display = toggleFleetResupply ? 'block' : 'none';
                document.getElementById('fleetResupplyGroup').style.display = isPremium ? 'block' : 'none';

                const manualFleetRepairEnabled = await window.chrome.webview.hostObjects.MacroFuncs.getManualFleetRepairEnabled();
                document.getElementById('toggleManualFleetRepair').checked = manualFleetRepairEnabled;
                document.getElementById('repairPositionButtons').style.display = manualFleetRepairEnabled ? 'flex' : 'none';
                
                const manualFleetResupplyEnabled = await window.chrome.webview.hostObjects.MacroFuncs.getManualFleetResupplyEnabled();
                document.getElementById('toggleManualFleetResupply').checked = manualFleetResupplyEnabled;
                document.getElementById('resupplyPositionButtons').style.display = manualFleetResupplyEnabled ? 'flex' : 'none';

                const toggleSoundBeep = await window.chrome.webview.hostObjects.MacroFuncs.getToggleSoundBeep();
                document.getElementById('toggleSoundBeep').checked = toggleSoundBeep;
                const soundBeepFrequency = await window.chrome.webview.hostObjects.MacroFuncs.getSoundBeepFrequency();
                document.getElementById('soundBeepFrequency').value = soundBeepFrequency;
                const soundBeepDuration = await window.chrome.webview.hostObjects.MacroFuncs.getSoundBeepDuration();
                document.getElementById('soundBeepDuration').value = soundBeepDuration;
                const soundBeepInterval = await window.chrome.webview.hostObjects.MacroFuncs.getSoundBeepInterval();
                document.getElementById('soundBeepInterval').value = soundBeepInterval;
                const soundBeepDetails = document.getElementById('soundBeepDetails');
                soundBeepDetails.style.display = toggleSoundBeep ? 'block' : 'none';

                const automaticAreas = await window.chrome.webview.hostObjects.MacroFuncs.getAutomaticAreas();
                document.getElementById('automaticAreas').checked = automaticAreas;
                const buttonsToHide = ['fishCaughtArea', 'fishTriggerArea', 'baitArea'];
                buttonsToHide.forEach(id => {
                    const button = document.getElementById(id);
                    if (button) {
                        button.style.display = automaticAreas ? 'none' : 'inline-flex';
                    }
                });

                document.getElementById('automaticAreas').addEventListener('change', (e) => {
                    const isAutomatic = e.target.checked;
                    buttonsToHide.forEach(id => {
                        const button = document.getElementById(id);
                        if (button) {
                            button.style.display = isAutomatic ? 'none' : 'inline-flex';
                        }
                    });
                    console.log('Automatic Areas changed to:', isAutomatic);
                    callAHK('updateAutomaticAreas', isAutomatic);
                });

                await startTrialTimer();
                console.log('UI initialized successfully');
            } catch (e) {
                console.error('Error initializing UI:', e);
                setTimeout(initializeUI, 50);
            }
        }

        async function startTrialTimer() {
            console.log('Fetching initial remaining time and license status from AHK...');
            try {
                const initialRemaining = await window.chrome.webview.hostObjects.MacroFuncs.getAOVunoxTrialRemainingTime();
                console.log('Initial remaining time from AHK:', initialRemaining);
                remainingSeconds = initialRemaining || 0;
                let license = { status: "Unknown", remaining: 0 };
                try {
                    license = await window.chrome.webview.hostObjects.MacroFuncs.getLicenseStatus();
                    console.log('License status from AHK:', license);
                } catch (e) {
                    console.error('Error fetching license status:', e);
                }
                if (trialTimerInterval) {
                    clearInterval(trialTimerInterval);
                }
                updateTimerDisplay(license);
                if (remainingSeconds > 0 && license.status !== "Premium") {
                    console.log('Starting countdown timer with', remainingSeconds, 'seconds');
                    trialTimerInterval = setInterval(() => {
                        remainingSeconds--;
                        updateTimerDisplay(license);
                        if (remainingSeconds <= 0) {
                            clearInterval(trialTimerInterval);
                            trialTimerInterval = null;
                            updateTimerDisplay(license);
                        }
                    }, 1000);
                } else {
                    console.log('No time remaining or premium, not starting timer');
                }
            } catch (e) {
                console.error('Error starting trial timer:', e);
                remainingSeconds = 0;
                updateTimerDisplay({ status: "Expired", remaining: 0 });
            }
        }

        function updateTimerDisplay(license) {
            console.log('Updating timer display with remainingSeconds:', remainingSeconds, 'and license:', license);
            const statusEl = document.getElementById("licenseStatus");
            const timeEl = document.getElementById("licenseTime");
            const btn = document.getElementById("premiumBtn");

            window.chrome.webview.hostObjects.MacroFuncs.getIsPremium().then(isPremium => {
                if (isPremium || (license && license.status === "Premium")) {
                    statusEl.textContent = "Status: Premium";
                    timeEl.textContent = "Time remaining: Unlimited";
                    btn.textContent = "Remove Premium";
                    closeModal();
                } else if (remainingSeconds > 0) {
                    statusEl.textContent = "Status: Free Trial";
                    const min = Math.floor(remainingSeconds / 60);
                    const sec = remainingSeconds % 60;
                    timeEl.textContent = "Time remaining: " + String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
                    btn.textContent = "Go Premium";
                    closeModal();
                } else {
                    statusEl.textContent = "Status: Trial Expired";
                    timeEl.textContent = "Time remaining: 00:00";
                    btn.textContent = "Go Premium";
                }
            }).catch(err => {
                console.error('Error getting premium status:', err);
                if (license && license.status === "Premium") {
                    statusEl.textContent = "Status: Premium";
                    timeEl.textContent = "Time remaining: Unlimited";
                    btn.textContent = "Remove Premium";
                } else {
                    statusEl.textContent = "Status: Trial Expired";
                    timeEl.textContent = "Time remaining: 00:00";
                    btn.textContent = "Go Premium";
                }
            });
        }

        async function showModal() {
            console.log('Showing trial modal...');
            try {
                const modal = document.getElementById('trialModal');
                modal.style.display = 'block';
                modal.style.pointerEvents = 'auto';
                const content = modal.querySelector('.modal-content');
                if (content) {
                    content.style.pointerEvents = 'auto';
                }
            } catch (e) {
                console.error('Error showing modal:', e);
            }
        }

        document.getElementById('toggleSoundBeep').addEventListener('change', (e) => {
            const details = document.getElementById('soundBeepDetails');
            details.style.display = e.target.checked ? 'block' : 'none';
            callAHK('updateToggleSoundBeep', e.target.checked);
        });

        document.getElementById('soundBeepFrequency').addEventListener('change', (e) => {
            const level = parseInt(e.target.value, 10);
            if (level >= 0 && level <= 100) {
                callAHK('updateSoundBeepFrequency', level);
            } else {
                showToast('Volume Level must be between 0 and 100.');
                e.target.value = 50;
            }
        });

        document.getElementById('soundBeepDuration').addEventListener('change', (e) => {
            const seconds = parseFloat(e.target.value);
            if (seconds >= 0.1 && seconds <= 10) {
                callAHK('updateSoundBeepDuration', seconds);
            } else {
                showToast('Duration must be between 0.1 and 10 seconds.');
                e.target.value = 0.15;
            }
        });

        document.getElementById('soundBeepInterval').addEventListener('change', (e) => {
            const interval = parseInt(e.target.value, 10);
            if (interval >= 1) {
                callAHK('updateSoundBeepInterval', interval);
            } else {
                showToast('Interval must be at least 1.');
                e.target.value = 10;
            }
        });

        document.getElementById('toggleFleetResupply').addEventListener('change', (e) => {
            const details = document.getElementById('fleetResupplyDetails');
            details.style.display = e.target.checked ? 'block' : 'none';
            callAHK('updateToggleFleetResupply', e.target.checked);
        });

        document.getElementById('fleetResupplyKey').addEventListener('change', (e) => {
            const key = e.target.value.trim();
            if (key) {
                callAHK('updateFleetResupplyKey', key);
            }
        });

        document.getElementById('fleetResupplyInterval').addEventListener('change', (e) => {
            const interval = parseInt(e.target.value, 10);
            if (interval >= 1) {
                callAHK('updateFleetResupplyInterval', interval);
            } else {
                showToast('Interval must be at least 1.');
                e.target.value = 5;
            }
        });

        document.getElementById('setRepairPos').addEventListener('click', (e) => {
            callAHK('selectRepairPosition');
            e.target.blur();
        });
        document.getElementById('setRepairYesPos').addEventListener('click', (e) => {
            callAHK('selectRepairYesPosition');
            e.target.blur();
        });
        document.getElementById('setResupplyPos').addEventListener('click', (e) => {
            callAHK('selectResupplyPosition');
            e.target.blur();
        });
        document.getElementById('setResupplyYesPos').addEventListener('click', (e) => {
            callAHK('selectResupplyYesPosition');
            e.target.blur();
        });

        document.getElementById('startMacro').addEventListener('click', async (e) => {
            console.log('Start Macro clicked - DEBUG');
            try {
                const statusText = document.getElementById('licenseStatus').textContent;
                const isPremium = await window.chrome.webview.hostObjects.MacroFuncs.getIsPremium().catch(() => false);

                if (!isPremium && (statusText.includes('Trial Expired') || statusText.includes('Expired'))) {
                    console.log('Trial expired (checking license status display)');
                    showModal();
                } else {
                    console.log('Starting macro (not expired or premium)');
                    callAHK('start');
                }
            } catch (error) {
                console.error('Error in start macro:', error);
                showToast('Error starting macro. Check console.');
            }
            e.target.blur();
        });

        document.getElementById('startAutoFleetRepair').addEventListener('click', async (e) => {
            console.log('Start Auto Fleet Repair clicked');
            try {
                callAHK('startAutoFleetRepair');
            } catch (error) {
                console.error('Error starting auto fleet repair:', error);
                showToast('Error starting auto fleet repair. Check console.');
            }
            e.target.blur();
        });

        document.getElementById('reloadMacro').addEventListener('click', (e) => {
            callAHK('reload');
            e.target.blur();
        });

        document.getElementById('fishTrigger').addEventListener('click', (e) => {
            callAHK('saveFishTrigger');
            e.target.blur();
        });

        document.getElementById('fishCaughtArea').addEventListener('click', (e) => {
            callAHK('selectFishCaughtArea');
            e.target.blur();
        });

        document.getElementById('fishTriggerArea').addEventListener('click', (e) => {
            callAHK('selectFishTriggerArea');
            e.target.blur();
        });

        document.getElementById('baitArea').addEventListener('click', (e) => {
            callAHK('selectBaitArea');
            e.target.blur();
        });

        document.getElementById('methodSelect').addEventListener('change', (e) => {
            const method = e.target.value;
            callAHK('updateMethod', method);
        });

        document.getElementById('keySelect').addEventListener('change', (e) => {
            const key = e.target.value;
            callAHK('updateKey', key);
        });

        document.getElementById('toggleSecondary').addEventListener('change', (e) => {
            const secondarySelect = document.getElementById('secondaryKeySelect');
            secondarySelect.style.display = e.target.checked ? 'block' : 'none';
            const lureDetails = document.getElementById('autoLureDetails');
            lureDetails.style.display = e.target.checked ? 'block' : 'none';
            callAHK('updateToggleSecondary', e.target.checked);
        });

        document.getElementById('secondaryKeySelect').addEventListener('change', (e) => {
            const key = e.target.value;
            callAHK('updateSecondaryKey', key);
        });

        document.getElementById('fishTriggerConfidence').addEventListener('change', (e) => {
            const confidence = parseInt(e.target.value, 10);
            if (confidence >= 0 && confidence <= 100) {
                callAHK('updateFishTriggerConfidence', confidence);
            } else {
                showToast('Confidence must be between 0 and 100.');
                e.target.value = 60;
            }
        });

        document.getElementById('keybindsToggle').addEventListener('click', (e) => {
            const section = document.getElementById('keybindsSection');
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
            e.target.blur();
        });

        document.getElementById('cameraAdjustKey').addEventListener('change', (e) => {
            const key = e.target.value.trim();
            if (key) {
                callAHK('updateCameraAdjustKey', key);
            }
        });

        document.getElementById('startMacroKey').addEventListener('change', (e) => {
            const key = e.target.value.trim();
            if (key) {
                callAHK('updateStartMacroKey', key);
            }
        });

        document.getElementById('reloadMacroKey').addEventListener('change', (e) => {
            const key = e.target.value.trim();
            if (key) {
                callAHK('updateReloadMacroKey', key);
            }
        });

        document.getElementById('screenshotKey').addEventListener('change', (e) => {
            const key = e.target.value.trim();
            if (key) {
                callAHK('updateScreenshotKey', key);
            }
        });

        document.getElementById('exitKey').addEventListener('change', (e) => {
            const key = e.target.value.trim();
            if (key) {
                callAHK('updateExitKey', key);
            }
        });

        document.getElementById('toggleAutoFleetRepair').addEventListener('change', (e) => {
            callAHK('updateAutoFleetRepairEnabled', e.target.checked);
        });

        document.getElementById('autoFleetRepairKey').addEventListener('change', (e) => {
            const key = e.target.value.trim();
            if (key) {
                callAHK('updateAutoFleetRepairKey', key);
            }
        });

        document.getElementById('autoFleetRepairInterval').addEventListener('change', (e) => {
            const interval = parseInt(e.target.value, 10);
            if (interval >= 1) {
                callAHK('updateAutoFleetRepairInterval', interval);
            } else {
                showToast('Interval must be at least 1.');
                e.target.value = 5;
            }
        });

        document.getElementById('toggleAutoFleetRepair').addEventListener('change', (e) => {
            const details = document.getElementById('autoFleetRepairDetails');
            details.style.display = e.target.checked ? 'block' : 'none';
            callAHK('updateAutoFleetRepairEnabled', e.target.checked);
        });

        document.getElementById('autoLureInterval').addEventListener('change', (e) => {
            const interval = parseInt(e.target.value, 10);
            if (interval >= 1) {
                callAHK('updateAutoLureInterval', interval);
            } else {
                showToast('Interval must be at least 1.');
                e.target.value = 5;
            }
        });

        document.getElementById('toggleDarkSeaI1').addEventListener('change', (e) => {
            const details = document.getElementById('darkSeaI1Details');
            details.style.display = e.target.checked ? 'block' : 'none';
            callAHK('updateToggleDarkSeaI1', e.target.checked);
        });

        document.getElementById('darkSeaI1Key').addEventListener('change', (e) => {
            const key = e.target.value.trim();
            if (key) {
                callAHK('updateDarkSeaI1Key', key);
            }
        });

        document.getElementById('toggleSecondary').addEventListener('change', (e) => {
            const lureGroup = document.getElementById('lureKeyGroup');
            lureGroup.style.display = e.target.checked ? 'flex' : 'none';
            const lureDetails = document.getElementById('autoLureDetails');
            lureDetails.style.display = e.target.checked ? 'block' : 'none';
            callAHK('updateToggleSecondary', e.target.checked);
        });

        document.getElementById('toggleManualFleetRepair').addEventListener('change', (e) => {
            const buttons = document.getElementById('repairPositionButtons');
            buttons.style.display = e.target.checked ? 'flex' : 'none';
            callAHK('updateManualFleetRepairEnabled', e.target.checked);
        });

        document.getElementById('toggleManualFleetResupply').addEventListener('change', (e) => {
            const buttons = document.getElementById('resupplyPositionButtons');
            buttons.style.display = e.target.checked ? 'flex' : 'none';
            callAHK('updateManualFleetResupplyEnabled', e.target.checked);
        });

        async function refreshTimer() {
            await startTrialTimer();
        }

        window.addEventListener('load', initializeUI);

        async function premiumAction() {
            const btn = document.getElementById("premiumBtn");
            if (btn.textContent === "Remove Premium") {
                showRemovalConfirmation();
            } else {
                showGoPremiumModal();
            }
        }

        function showRemovalConfirmation() {
            const modal = document.createElement('div');
            modal.id = 'removalModal';
            modal.className = 'modal';
            modal.innerHTML = `
            <div class="modal-content">
                <h2>Remove Premium</h2>
                <p>Are you sure you want to remove premium?</p>
                <button class="unlock-btn" onclick="confirmRemoval()">Yes</button>
                <button class="cancel-btn" onclick="closeModal('removalModal')">No</button>
            </div>
        `;
            document.body.appendChild(modal);
            modal.style.display = 'block';
        }

        async function confirmRemoval() {
            closeModal('removalModal');
            try {
                const isValid = await window.chrome.webview.hostObjects.MacroFuncs.removePremium();
                if (isValid) {
                    showToast('Premium removed! Restarting...');
                    window.chrome.webview.hostObjects.MacroFuncs.reload();
                } else {
                    showToast('Error removing premium.');
                }
            } catch (e) {
                console.error('Error in confirmRemoval:', e);
                showToast('Error removing premium. Check console for details.');
            }
        }

        function closeModal(modalId = 'trialModal') {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                modal.style.pointerEvents = 'none';
                if (modalId === 'removalModal') {
                    modal.remove();
                }
            }
        }

        function showGoPremiumModal() {
            document.getElementById('goPremiumModal').style.display = 'block';
            document.getElementById('goPremiumError').style.display = 'none';
            loadGoPremiumInfo();
        }

        async function loadGoPremiumInfo() {
            try {
                const serial = await window.chrome.webview.hostObjects.MacroFuncs.getAOVunoxPremiumSerial();
                const hwid = await window.chrome.webview.hostObjects.MacroFuncs.getHWID();
                document.getElementById('goPremiumInfo').textContent = `Serial: ${serial}\nHWID: ${hwid}`;
            } catch (e) {
                console.error('Error loading Go Premium info:', e);
                document.getElementById('goPremiumInfo').textContent = 'Error loading info.';
            }
        }

        function nextGoPremiumStep() {
            document.getElementById('goPremiumStep1').style.display = 'none';
            document.getElementById('goPremiumStep2').style.display = 'block';
        }

        async function activateGoPremium() {
            const otp = document.getElementById('goPremiumOTP').value.trim();
            if (!otp) {
                document.getElementById('goPremiumError').textContent = 'Please enter OTP.';
                document.getElementById('goPremiumError').style.display = 'block';
                return;
            }
            try {
                const isValid = await window.chrome.webview.hostObjects.MacroFuncs.validateOTP(otp);
                if (isValid) {
                    showToast('Premium activated! Restarting...');
                    window.chrome.webview.hostObjects.MacroFuncs.reload();
                } else {
                    document.getElementById('goPremiumError').textContent = 'Invalid OTP. Try again.';
                    document.getElementById('goPremiumError').style.display = 'block';
                }
            } catch (e) {
                console.error('Error activating Go Premium:', e);
                document.getElementById('goPremiumError').textContent = 'Error activating.';
                document.getElementById('goPremiumError').style.display = 'block';
            }
        }

        function closeGoPremiumModal() {
            document.getElementById('goPremiumModal').style.display = 'none';
        }

        (function waitForHost() {
            const MAX_DELAY = 20000;
            let delay = 100;
            let attempts = 0;
            const toastId = 'host-connect-toast';

            function createHostToast() {
                if (document.getElementById(toastId)) return;
                const t = document.createElement('div');
                t.id = toastId;
                t.style = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:10px 16px;border-radius:6px;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,0.2);font-family:sans-serif;';
                document.body.appendChild(t);
            }
            function showHostToastLocal(msg, type = 'info', duration = 1000) {
                createHostToast();
                const t = document.getElementById(toastId);
                t.textContent = msg;
                t.style.background = (type === 'error') ? '#b00020' : '#333';
                t.style.display = 'block';
                if (t._hideTimeout) { clearTimeout(t._hideTimeout); t._hideTimeout = null; }
                if (type !== 'error') {
                    t._hideTimeout = setTimeout(hideHostToastLocal, duration);
                }
            }
            function hideHostToastLocal() {
                const t = document.getElementById(toastId);
                if (t) {
                    t.style.display = 'none';
                    if (t._hideTimeout) { clearTimeout(t._hideTimeout); t._hideTimeout = null; }
                }
            }
            window.showHostToast = function (msg, type, duration) {
                showHostToastLocal(msg, type, duration);
            }
            window.hideHostToast = hideHostToastLocal;

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(tryAttach, 0);
            } else {
                document.addEventListener('DOMContentLoaded', () => setTimeout(tryAttach, 0));
            }
        })();

        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => toast.classList.add('show'), 10);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 500);
        }

        function toggleSidePanel() {
            const panel = document.getElementById('sidePanel');
            panel.classList.toggle('open');
        }

        function closeSidePanel() {
            const panel = document.getElementById('sidePanel');
            panel.classList.remove('open');
        }