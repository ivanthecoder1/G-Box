import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import GamePage from './GamePage';
import { useAuth } from '../components/AuthContent';
import logo from "../assets/logo.png";


const Login = () => {
    // Manage and hold username, steamID inputs, password inputs
    const [InputAdminUsername, setInputAdminUsername] = useState('');
    const [InputAdminPassword, setInputAdminPassword] = useState('');
    const [InputSteamID, setInputSteamID] = useState('');
    
    // To check if admin is logged in or not
    const { isAdminLoggedIn, loginAdmin } = useAuth();

    // For navigation to other pages
    const navigate = useNavigate();


    const backendUrl = "http://localhost:3001";

    // Display successful login message if admin sign ins correctly
    useEffect(() => {
        if (isAdminLoggedIn) {
            alert('Admin logged in successfully!');
            navigate('/home');
        }
    }, [isAdminLoggedIn]);

    // Handle admin login through post route
    const adminLogin = async (e) => {
        e.preventDefault();

        if (!InputAdminUsername || !InputAdminPassword) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/login/admin`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    AdminUser: InputAdminUsername,
                    AdminPassword: InputAdminPassword,
                }),
            });

            if (response.ok) {
                loginAdmin();
            } else {
                alert(`Incorrect username or password: ${response.status}\n${response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in.');
        }
    };

    // Login in with steam 
    const loginSteam = async (e) => {
        e.preventDefault();

        if (!InputSteamID) {
            alert('Please fill in the Steam ID field.');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/login/${InputSteamID}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                alert(`Steam login successful! Welcome, ${userData.UserName}!`);
                navigate('/home');
            } else {
                alert(`Steam login failed: ${response.status}\n${response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in.');
        }
    };



    return (
        <><img className="rectangle" alt="Rectangle" src="https://images.pushsquare.com/0fab4c05fb7ae/stray-rating.large.jpg" />
            <div className='image-overlay'>
                <div className='login-container'>
                    <div className="text-wrapper">GAME LAUNCHER</div>
                    <form onSubmit={adminLogin}>
                        <label htmlFor="adminUsername">Admin Username </label>
                        <input
                            type="text"
                            id="adminUsername"
                            value={InputAdminUsername}
                            onChange={(e) => setInputAdminUsername(e.target.value)}
                        />
                        <label htmlFor="adminPassword">Admin Password</label>
                        <input
                            type="password"
                            id="adminPassword"
                            value={InputAdminPassword}
                            onChange={(e) => setInputAdminPassword(e.target.value)}
                        />
                        <br></br>
                        <button className='btn'>Login as Admin</button>

                    </form>
                    <form onSubmit={loginSteam}>
                        <label htmlFor="steamID">Steam ID   </label>
                        <input
                            type="text"
                            id="steamID"
                            value={InputSteamID}
                            onChange={(e) => setInputSteamID(e.target.value)}
                        />
                        <br />
                        <button class="btn" onClick={loginSteam}>Log in with Steam</button>
                    </form>
                    <br></br>
                </div>
            </div>
        </>

    );
};

export default Login;
