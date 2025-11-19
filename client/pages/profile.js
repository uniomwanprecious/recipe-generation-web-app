import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Link from 'next/link'; 

// Mock User ID for demonstration until real login is implemented
const MOCK_USER_ID = 1;

export default function Profile() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoginView, setIsLoginView] = useState(true);
    const [authData, setAuthData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Placeholder data for the mock user display
    const mockUser = {
        id: MOCK_USER_ID,
        username: 'BudgetChefMaster',
        email: 'user@example.com',
        memberSince: '2025-10-26',
        preferences: ['Vegetarian', 'Low Carb']
    };

    useEffect(() => {
        // In a real app, this checks for a JWT token. 
        // For now, we simulate being logged in immediately after a successful action.
        if (isLoggedIn) {
            setUser(mockUser);
        }
    }, [isLoggedIn]);

    const handleChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        const endpoint = isLoginView ? 'login' : 'register';
        const url = `http://localhost:5000/api/users/${endpoint}`;

        try {
            const response = await axios.post(url, authData);
            
            if (response.data.success) {
                setMessage(response.data.message);
                setIsLoggedIn(true);
                // After successful registration, switch to login view
                if (!isLoginView) {
                    setIsLoginView(true); 
                }
            } else {
                 setMessage(response.data.message || "An unexpected error occurred.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || `Failed to ${isLoginView ? 'login' : 'register'}. Check server logs.`;
            setMessage(<span className="error-message">{errorMessage}</span>);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setMessage('You have been logged out.');
        setAuthData({ username: '', email: '', password: '' });
    };

    const renderAuthForm = () => (
        <div className="input-container">
            <h2 className="title-h2 text-center">
                {isLoginView ? 'User Login' : 'Register Account'}
            </h2>
            
            {message && <div className="message-box">{message}</div>}

            <form onSubmit={handleSubmit}>
                {!isLoginView && (
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={authData.username}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={authData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={authData.password}
                    onChange={handleChange}
                    className="input-field"
                    required
                />
                <button 
                    type="submit" 
                    className="button-primary" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : isLoginView ? 'Log In' : 'Register Account'}
                </button>
            </form>
            
            <p className="tip-text text-center" style={{marginTop: '1rem'}}>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginView(!isLoginView); setMessage('');}}>
                    {isLoginView ? 'Don\'t have an account? Register here.' : 'Already have an account? Log In.'}
                </a>
            </p>
        </div>
    );

    const renderUserProfile = () => (
        <div className="input-container">
            <h2 className="title-h2">Welcome Back, {user.username}!</h2>
            
            <div className="detail-section">
                <h3 className="title-h3">Account Details</h3>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Member Since:</strong> {user.memberSince}</p>
            </div>
            
            <div className="detail-section">
                <h3 className="title-h3">Default Preferences</h3>
                <p>{user.preferences.join(', ')}</p>
                <p className="tip-text">(This is where you'd change your default diet and allergy settings.)</p>
            </div>
            
            <button onClick={handleLogout} className="button-secondary">
                Log Out
            </button>
        </div>
    );

    return (
        <div>
            <Head>
                <title>User Profile & Settings</title>
            </Head>
            
            {/* START UNIVERSAL NAVIGATION BLOCK */}
            <header className="nav-header">
                <div className="container nav-container">
                    <Link href="/" className="nav-link">
                        🏠 Pantry Input
                    </Link>
                    <Link href="/saved" className="nav-link">
                        ⭐ Saved Recipes
                    </Link>
                    <Link href="/profile" className="nav-link">
                        👤 Profile/Login
                    </Link>
                </div>
            </header>
            {/* END UNIVERSAL NAVIGATION BLOCK */}

            <main className="main-content">
                <div className="container">
                    <h1 className="title-h1 text-center">User Profile & Settings</h1>
                    
                    {isLoggedIn && user ? renderUserProfile() : renderAuthForm()}

                </div>
            </main>
        </div>
    );
}