import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import TelegramLogin from './components/TelegramLogin';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [greetMsg, setGreetMsg] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function greet() {
    try {
      setGreetMsg(await invoke('greet', { name }));
    } catch (error) {
      console.error('Error invoking greet:', error);
      setGreetMsg('Error: ' + error.message);
    }
  }

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    console.log("Logged in successfully:", user);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">NyxDrive</h1>
      
      {!isLoggedIn ? (
        <div className="mb-8">
          <TelegramLogin onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to NyxDrive!</h2>
          <p className="text-gray-700 mb-4">
            You're now logged in to your Telegram account. NyxDrive uses Telegram to provide unlimited cloud storage for your files.
          </p>
          <p className="text-gray-700 mb-4">
            Files are stored in your Telegram "Saved Messages" chat, giving you access to your data anytime, anywhere.
          </p>
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Coming soon: File uploads, downloads, and organization features.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Test Tauri Communication</h2>
        <div className="flex flex-col items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              greet();
            }}
            className="flex items-center"
          >
            <input
              id="greet-input"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name..."
              className="border p-2 rounded mr-2"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Greet
            </button>
          </form>
          {greetMsg && <p className="mt-4">{greetMsg}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
