import debug from "debug";
import { DebugModeHandler } from "./debug-handler";
import { MenuKey, menuCommandService } from "./menu";
import { urlHandler } from "./url-handler";

const log = debug("app:main");

function registerMenuCommands() {
  menuCommandService.register(MenuKey.debugMode, () => {
    DebugModeHandler.init().toggle();
    alert(
      `Debug mode is ${DebugModeHandler.isDebugModeEnable() ? "ON" : "OFF"}`,
    );
  });

  menuCommandService.register(MenuKey.sayHello, () => {
    alert("Hello from TabBridge!");
  });
}

async function main() {
  log("running...");
  urlHandler();
  registerMenuCommands();
}

main().catch((e) => {
  log(e);
});

/*

// ==UserScript==
// @name         Cross Tab Messaging Example
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Communicate between tabs using Tampermonkey
// @author       You
// @match        *://*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    // Function to send a message to other tabs
    function sendMessage(message) {
        GM_setValue('cross_tab_message', {
            content: message,
            timestamp: Date.now() // ensures value changes every time
        });
        console.log('Message sent:', message);
    }

    // Listener to receive messages from other tabs
    GM_addValueChangeListener('cross_tab_message', (name, oldValue, newValue, remote) => {
        if (remote) { // only trigger when another tab sets it
            console.log('Message received from another tab:', newValue.content);
        }
    });

    // Add menu command to test sending a message
    GM_registerMenuCommand('Send Test Message', () => {
        const testMessage = 'Hello from tab ' + Math.floor(Math.random() * 1000);
        sendMessage(testMessage);
    });

})();


*/

/*

// ==UserScript==
// @name         Professional Cross-Tab Messaging System
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Advanced inter-tab communication system with comprehensive message metadata
// @author       Professional Developer
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'cross_tab_message_v2',
        TAB_ID_KEY: 'tab_session_id',
        MESSAGE_RETENTION: 60000, // 60 seconds
    };

    // Generate unique tab identifier
    const TAB_ID = generateTabId();

    function generateTabId() {
        const stored = sessionStorage.getItem(CONFIG.TAB_ID_KEY);
        if (stored) return stored;

        const id = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem(CONFIG.TAB_ID_KEY, id);
        return id;
    }


    function sendMessage(content, messageType = 'broadcast', additionalMetadata = {}) {
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            senderId: TAB_ID,
            senderUrl: window.location.href,
            senderTitle: document.title,
            senderOrigin: window.location.origin,
            senderPathname: window.location.pathname,
            content: content,
            timestamp: Date.now(),
            messageType: messageType,
            metadata: {
                userAgent: navigator.userAgent,
                screenResolution: `${screen.width}x${screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                ...additionalMetadata
            }
        };

        try {
            GM_setValue(CONFIG.STORAGE_KEY, message);
            console.log('[Cross-Tab Messaging] Message sent:', {
                id: message.id,
                type: message.messageType,
                content: message.content
            });
            return message.id;
        } catch (error) {
            console.error('[Cross-Tab Messaging] Failed to send message:', error);
            return null;
        }
    }


    function onMessage(handler) {
        GM_addValueChangeListener(CONFIG.STORAGE_KEY, (name, oldValue, newValue, remote) => {
            if (!remote) return; // Ignore messages from current tab
            if (!newValue) return;

            // Filter out old messages
            const messageAge = Date.now() - newValue.timestamp;
            if (messageAge > CONFIG.MESSAGE_RETENTION) {
                console.warn('[Cross-Tab Messaging] Ignored stale message:', newValue.id);
                return;
            }

            // Ignore messages from self (additional safety check)
            if (newValue.senderId === TAB_ID) return;

            console.log('[Cross-Tab Messaging] Message received:', {
                id: newValue.id,
                from: newValue.senderId,
                type: newValue.messageType,
                url: newValue.senderUrl,
                content: newValue.content
            });

            try {
                handler(newValue);
            } catch (error) {
                console.error('[Cross-Tab Messaging] Error in message handler:', error);
            }
        });
    }


    function broadcast(content, metadata = {}) {
        return sendMessage(content, 'broadcast', metadata);
    }


    function getTabId() {
        return TAB_ID;
    }

    function sendDirectMessage(recipientId, content) {
        return sendMessage(content, 'direct', { recipientId });
    }

    // Initialize message receiver
    onMessage((message) => {
        // Handle direct messages
        if (message.messageType === 'direct' &&
            message.metadata.recipientId &&
            message.metadata.recipientId !== TAB_ID) {
            console.log('[Cross-Tab Messaging] Ignoring direct message for another tab');
            return;
        }

        // Display notification for received messages
        console.info(`[Cross-Tab Messaging] 📨 New message from ${message.senderId}:`, message.content);

        // Custom event for application integration
        window.dispatchEvent(new CustomEvent('crossTabMessage', { detail: message }));
    });

    // Register menu commands for testing
    GM_registerMenuCommand('📤 Send Test Message', () => {
        const testMessage = `Hello from ${TAB_ID.substr(0, 12)}... at ${new Date().toLocaleTimeString()}`;
        broadcast(testMessage, { priority: 'normal', category: 'test' });
    });

    GM_registerMenuCommand('📋 Show Tab Info', () => {
        console.log('[Cross-Tab Messaging] Current Tab Information:', {
            tabId: TAB_ID,
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString()
        });
        alert(`Tab ID: ${TAB_ID}\nURL: ${window.location.href}`);
    });

    GM_registerMenuCommand('🔔 Send Priority Message', () => {
        const priorityMsg = 'URGENT: This is a high-priority message';
        broadcast(priorityMsg, { priority: 'high', urgent: true });
    });

    // Export API to window for external access
    window.CrossTabMessaging = {
        send: sendMessage,
        broadcast: broadcast,
        sendDirect: sendDirectMessage,
        onMessage: onMessage,
        getTabId: getTabId,
        version: '2.0.0'
    };

    // Log initialization
    console.log(`[Cross-Tab Messaging] System initialized (Tab ID: ${TAB_ID})`);

})();


*/
