import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';
import GamePage from "./GamePage";
import { useAuth } from '../components/AuthContent';
import logo from "../assets/logo.png";


// Game structure
const Game = {
    GameID: 0,
    GameName: '',
    GameDescription: '',
    GameImage: '',
    GameEmbedCode: '',
};

const Home = () => {
    // Indicate the game should conform to Game structure
    const [games, setGames] = useState([Game]);
    const [editing, setEditing] = useState(false); // Used to check if edit mode is on or off

    // State to hold the message being edited, initialized as null when not in edit mode
    const [editedGame, setEditedGame] = useState(null);

    const navigate = useNavigate();
    const { isAdminLoggedIn } = useAuth();
    const { logoutAdmin } = useAuth();


    // Conditionally render the Admin Page link
    const adminLink = isAdminLoggedIn ? (
        <Link to="/admin">
            <h1 className="navbar-brand">Admin Page</h1>
        </Link>
    ) : null;


    const backendUrl = "http://localhost:3001";

    // Delete a game function
    const deleteGame = async (gameID) => {
        try {
            // Send a DELETE request to the backend to delete the game with the specified ID
            await fetch(`${backendUrl}/games/${gameID}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });

            // After successfully deleting the game, update the state to remove the deleted game
            setGames(prevGames => prevGames.filter(game => game.GameID !== gameID));
        } catch (error) {
            // If an error occurs during the deletion process, log the error and display an alert
            console.error('Error deleting game:', error);
            window.alert('Error deleting game');
        }
    };

    // Edit a game function
    const editGame = async (specifiedGameID, newGameName, newGameDescription, newGameImage, newGameEmbedCode) => {
        try {
            // Construct the request body with the new info
            const requestBody = JSON.stringify({
                GameName: newGameName,
                GameDescription: newGameDescription,
                GameImage: newGameImage,
                GameEmbedCode: newGameEmbedCode,
            });

            // Send a PUT request to the backend to update the game with the specified ID
            const response = await fetch(`${backendUrl}/games/${specifiedGameID}`, {
                method: 'PUT',
                body: requestBody,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });

            if (response.ok) {
                // If the update request is successful, update the local state with the edited game
                setGames(prevGames =>
                    prevGames.map(game =>
                        game.GameID === specifiedGameID
                            ? {
                                ...game,
                                GameName: newGameName,
                                GameDescription: newGameDescription,
                                GameImage: newGameImage,
                                GameEmbedCode: newGameEmbedCode,
                            }
                            : game
                    )
                );

                // Clear the edit form and exit editing mode
                setEditing(false);
                setEditedGame(null);
            } else {
                // Handle errors by logging and showing an alert
                console.error('Error updating game:', response);
                window.alert('Error updating game');
            }
        } catch (error) {
            // Handle unspecified errors and log the error
            console.error('Something went wrong with editing.', error);
            window.alert('Unspecified error');
        }
    };


    // Fetch games 
    // The game list rerenders everytime there is an update
    useEffect(() => {
        // Asynchronously fetch game from the server
        const fetchGames = async () => {
            try {
                // Send a GET request to the server to retrieve each message by looping through the indexes
                const response = await fetch(`${backendUrl}/games`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                });
                // Update the local state with the retrieved games if response is
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    // alert(JSON.stringify(data))
                    setGames(data);
                } else {
                    console.error('Error response:', response);
                    window.alert(`The server replied not ok: ${response.status}\n${response.statusText}`);
                }
            } catch (error) {
                console.error('Something went wrong.', error);
                window.alert("Unspecified error");
            }
        };

        // Call function
        fetchGames();

    },
        []);

    // Sign out function to navigate back to login page and change admin authentication back to false
    const handleSignOut = async () => {
        try {
            await logoutAdmin();
            navigate('/');
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };

    return (
        <div className="Home">
            {/* Navigation bar */}
            <nav className="navbar">
                {/* Take you back to sign out */}
                <Link to="/home">
                    {/* Include the logo */}
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
                {adminLink} {/* Render the adminLink conditionally */}
                <div id="signInDiv"> </div>
                <button onClick={handleSignOut}>Sign Out</button>
            </nav>

            <div className="game-container">
                {games.map((game) => (
                    <div className="game-preview">
                        {/* Render the edit form when edit button is clicked otherwise display the game */}
                        {editing && editedGame?.GameID === game.GameID ? (
                            // Edit form
                            <div className="editIdea">
                                <h3>Edit a game</h3>
                                <label>Game Name</label>
                                <input
                                    type="text"
                                    value={editedGame.GameName}
                                    onChange={(e) => setEditedGame({ ...editedGame, GameName: e.target.value })}
                                />
                                <label>Game Description</label>
                                <input
                                    type="text"
                                    value={editedGame.GameDescription}
                                    onChange={(e) => setEditedGame({ ...editedGame, GameDescription: e.target.value })}
                                />
                                <label>Game Image</label>
                                <input
                                    type="text"
                                    value={editedGame.GameImage}
                                    onChange={(e) => setEditedGame({ ...editedGame, GameImage: e.target.value })}
                                />
                                <label>Game Embed Code</label>
                                <input
                                    type="text"
                                    value={editedGame.GameEmbedCode}
                                    onChange={(e) => setEditedGame({ ...editedGame, GameEmbedCode: e.target.value })}
                                />
                                <button onClick={() =>
                                    editGame(
                                        editedGame.GameID,
                                        editedGame.GameName,
                                        editedGame.GameDescription,
                                        editedGame.GameImage,
                                        editedGame.GameEmbedCode
                                    )
                                }>
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div className="Card">
                                <h4>{game.GameName}</h4>
                                <img src={game.GameImage} alt={`Game: ${game.GameName}`} />
                                <p>{game.GameDescription}</p>

                                {/* Use useNavigate to navigate to GamePage with state */}
                                <button onClick={() => navigate('/gamepage', { state: { game } })}>Play</button>

                                {/* Conditionally render "Delete" and "Edit" buttons only if admin is logged in */}
                                {isAdminLoggedIn && (
                                    <div>
                                        <button onClick={() => deleteGame(game.GameID)}>Delete game</button>
                                        <button onClick={() => {
                                            setEditing(true);
                                            setEditedGame(game);
                                        }}>Edit Idea</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;