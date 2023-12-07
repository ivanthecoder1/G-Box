import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './GamePage.css';
import { useAuth } from '../components/AuthContent';
import logo from "../assets/logo.png";


const GamePage = () => {
    const location = useLocation();
    const game = location.state?.game;
    const { isAdminLoggedIn } = useAuth();
    const { logoutAdmin } = useAuth();
    const navigate = useNavigate();

    // Conditionally render the Admin Page link
    const adminLink = isAdminLoggedIn ? (
        <Link to="/admin">
            <h1 className="navbar-brand">Admin Page</h1>
        </Link>
    ) : null;

    const handleSignOut = () => {
        // Call logoutAdmin to set isAdminLoggedIn to false
        logoutAdmin();
        // Navigate to the login page
        navigate('/');
    };

    return (
        <div className="GamePage">
            {/* Navigation bar */}
            <nav className="navbar">
                {/* Take you back to sign out */}
                <Link to="/home">
                    {/* Include the logo */}
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
                {adminLink} {/* Render the adminLink conditionally */}
                <div id="signInDiv"></div>
                <button onClick={handleSignOut}>Sign Out</button>
            </nav>

            {/* Call game play page */}
            <div className="Card">
                <h3>{game.GameName}</h3>
                <iframe src={game.GameEmbedCode} width="485" height="402" frameBorder="0" scrolling="no"></iframe>
                <p>
                    {game.GameDescription}
                </p>
            </div>
        </div>
    );
}

export default GamePage;
