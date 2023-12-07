// Page for admin to add, delete, edit a game
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContent';
import logo from "../assets/logo.png";
import './Admin.css';

const Admin = () => {
    // Handle game inputs
    const [newGameTitle, setNewGameTitle] = useState('');
    const [newGameDescription, setNewGameDescription] = useState('');
    const [newGameImage, setNewGameImage] = useState('');
    const [newGameEmbedCode, setNewGameEmbedCode] = useState('');
    const navigate = useNavigate();
    const backendUrl = "http://localhost:3001";
    const { logoutAdmin } = useAuth();

    // Submit the game
    const submitForm = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Basic validation to check if all fields are filled
        if (!newGameTitle || !newGameDescription || !newGameImage || !newGameEmbedCode) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            // Send POST request
            const response = await fetch(`${backendUrl}/games`, {
                method: 'POST',
                body: JSON.stringify({
                    GameName: newGameTitle,
                    GameDescription: newGameDescription,
                    GameImage: newGameImage,
                    GameEmbedCode: newGameEmbedCode,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (response.ok) {
                alert('Game added successfully!');
                // Clear the form fields after successful submission
                setNewGameTitle('');
                setNewGameDescription('');
                setNewGameImage('');
                setNewGameEmbedCode('');
            } else {
                alert(`Error: ${response.status}\n${response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the game.');
        }
    };

    const handleSignOut = () => {
        // Call logoutAdmin to set isAdminLoggedIn to false
        logoutAdmin();
        // Navigate to the login page
        navigate('/');
    };

    return (
        <div className="admin">
            {/* Navigation bar */}
            <nav className="navbar">
                {/* Take you back to sign out */}
                <Link to="/home">
                    {/* Include the logo */}
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
                <Link to="/admin">
                    <h1 className="navbar-brand">Admin Page</h1>
                </Link>
                <div id="signInDiv"> </div>
                <button onClick={handleSignOut}>Sign Out</button>
            </nav>

            <div className="container">
                {/* Add a game form */}
                <div className="small-container">
                    <h3>Add a game</h3>
                    <form onSubmit={submitForm}>
                        <label htmlFor="g-title">Game Name</label> <br />
                        <input
                            type="text"
                            id="g-title"
                            name="g-title"
                            value={newGameTitle}
                            onChange={(e) => setNewGameTitle(e.target.value)}
                        /><br />
                        <br />

                        <label htmlFor="description">Game Description</label><br />
                        <textarea
                            rows="5"
                            cols="50"
                            id="description"
                            value={newGameDescription}
                            onChange={(e) => setNewGameDescription(e.target.value)}
                        ></textarea>
                        <br />

                        <label htmlFor="author">Game Image</label><br />
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={newGameImage}
                            onChange={(e) => setNewGameImage(e.target.value)}
                        /><br />
                        <br />

                        <label htmlFor="embed-code">Game Embed Code</label><br />
                        <input
                            type="text"
                            id="embed-code"
                            name="embed-code"
                            value={newGameEmbedCode}
                            onChange={(e) => setNewGameEmbedCode(e.target.value)}
                        /><br />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Admin;