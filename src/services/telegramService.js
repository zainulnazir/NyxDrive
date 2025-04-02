import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { invoke } from '@tauri-apps/api/core';
import { appConfigDir } from '@tauri-apps/api/path';

// Load these from your .env file in the Tauri app
const API_ID = parseInt(import.meta.env.VITE_TELEGRAM_API_ID || "12311784", 10);
const API_HASH = import.meta.env.VITE_TELEGRAM_API_HASH || "10b8a227f56d25c92ac5fcec25401d3a";

let client = null;

export async function initTelegramClient(sessionData = "") {
  try {
    const stringSession = new StringSession(sessionData);
    client = new TelegramClient(stringSession, API_ID, API_HASH, {
      connectionRetries: 3,
    });
    return client;
  } catch (error) {
    console.error("Error initializing Telegram client:", error);
    throw error;
  }
}

export async function loadSession() {
  try {
    // Get app data directory
    const dataDir = await appConfigDir();
    const sessionPath = `${dataDir}/session.txt`;
    
    // Check if session file exists
    try {
      // Using invoke instead of direct fs calls
      const fileExists = await invoke('plugin:fs|exists', { path: sessionPath });
      if (!fileExists) {
        return "";
      }
      
      // Read session data
      const sessionData = await invoke('plugin:fs|read_text_file', { path: sessionPath });
      return sessionData;
    } catch (error) {
      console.error("File operation error:", error);
      return "";
    }
  } catch (error) {
    console.error("Error loading session:", error);
    return "";
  }
}

export async function saveSession(sessionString) {
  try {
    // Get app data directory
    const dataDir = await appConfigDir();
    
    // Create directory if it doesn't exist
    try {
      await invoke('plugin:fs|create_dir', { 
        path: dataDir, 
        options: { recursive: true } 
      });
    } catch (error) {
      // Directory might already exist
      console.log("Directory creation error (might already exist):", error);
    }
    
    // Save session data
    const sessionPath = `${dataDir}/session.txt`;
    await invoke('plugin:fs|write_text_file', { 
      path: sessionPath, 
      contents: sessionString 
    });
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
}

export async function loginWithTelegram(phoneNumber, code = "", password = "") {
  try {
    let sessionData = await loadSession();
    const client = await initTelegramClient(sessionData);
    
    // Start the client and handle authentication
    await client.start({
      phoneNumber: async () => phoneNumber,
      phoneCode: async () => code,
      password: async () => password,
      onError: (err) => {
        console.error("Telegram login error:", err);
        throw err;
      }
    });
    
    // Save the session for future use
    sessionData = client.session.save();
    await saveSession(sessionData);
    
    // Get the user info to confirm successful login
    const me = await client.getMe();
    return { 
      success: true, 
      user: {
        id: me.id,
        firstName: me.firstName,
        lastName: me.lastName,
        username: me.username
      }
    };
  } catch (error) {
    console.error("Login failed:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export async function isLoggedIn() {
  try {
    const sessionData = await loadSession();
    if (!sessionData) {
      return false;
    }
    
    const client = await initTelegramClient(sessionData);
    await client.connect();
    const isAuthorized = await client.isUserAuthorized();
    return isAuthorized;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

export async function logout() {
  try {
    if (client) {
      await client.disconnect();
    }
    // Clear the session
    await saveSession("");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
}
