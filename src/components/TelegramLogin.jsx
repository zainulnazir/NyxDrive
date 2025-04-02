import React, { useState, useEffect } from 'react';
import { loginWithTelegram, isLoggedIn, logout } from '../services/telegramService';

function TelegramLogin({ onLoginSuccess }) {
  const [step, setStep] = useState('phone'); // phone, code, password, or logged-in
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    setLoading(true);
    try {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        setStep('logged-in');
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (error) {
      console.error("Login status check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Start the login process with just the phone number
      const result = await loginWithTelegram(phoneNumber);
      
      // If no error, it means we need to enter the code next
      setStep('code');
    } catch (error) {
      setError(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setError('Verification code is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await loginWithTelegram(phoneNumber, code);
      
      if (result.error && result.error.includes('PASSWORD_REQUIRED')) {
        setStep('password');
      } else if (result.success) {
        setUser(result.user);
        setStep('logged-in');
        if (onLoginSuccess) onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await loginWithTelegram(phoneNumber, code, password);
      
      if (result.success) {
        setUser(result.user);
        setStep('logged-in');
        if (onLoginSuccess) onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'Invalid password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setStep('phone');
      setPhoneNumber('');
      setCode('');
      setPassword('');
      setUser(null);
    } catch (error) {
      setError(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {step === 'logged-in' ? 'Logged In' : 'Telegram Login'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone Number (with country code)
            </label>
            <input
              id="phone"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Send Code
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleCodeSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="12345"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Verify Code
          </button>
          <button
            type="button"
            className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setStep('phone')}
          >
            Back
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Two-Factor Authentication Password
            </label>
            <input
              id="password"
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
          <button
            type="button"
            className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setStep('code')}
          >
            Back
          </button>
        </form>
      )}

      {step === 'logged-in' && (
        <div>
          <div className="mb-4 text-center">
            <p className="text-green-500 font-semibold">Successfully logged in!</p>
            {user && (
              <div className="mt-2">
                <p><span className="font-bold">Name:</span> {user.firstName} {user.lastName}</p>
                {user.username && <p><span className="font-bold">Username:</span> @{user.username}</p>}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default TelegramLogin;
