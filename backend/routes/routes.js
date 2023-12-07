//We are going to use the steam api to get the games

//Require express and router
const express = require('express');
const Game = require('../models/Game');
const Admin = require('../models/Admin');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
//Dynamically import fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// get /games - Get route to get all games from game collection on mongodb
router.get('/games', async (req, res, next) => {
    try {
        // Get all games from mongodb
        const games = await Game.find();
        // Return all games
        return res.json(games);
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error getting games:', error);
        return next(error);
    }
});

// get /games/:gameID - Get route to get a specific game from game collection on mongodb
router.get('/games/:gameID', async (req, res, next) => {
    try {
        // Check to see if gameID is valid
        if (isNaN(req.params.gameID)) {
            // Return error if gameID is not valid
            return res.status(400).json({ error: 'Invalid gameID' });
        }
        // Get game from mongodb
        const game = await Game.findOne({ GameID: req.params.gameID });
        // Check to see if game exists
        if (!game) {
            // Return error if game does not exist
            return res.status(404).json({ error: 'Game not found' });
        }
        // Return game
        return res.json(game);
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error getting game:', error);
        return next(error);
    }
});


// Only admin can update/add/delete games

// post /games - Post route to add a game to game collection on mongodb
router.post('/games', async (req, res, next) => {
    try {
        // Create game
        const game = new Game({
            GameName: req.body.GameName,
            GameDescription: req.body.GameDescription,
            GameImage: req.body.GameImage,
            GameEmbedCode: req.body.GameEmbedCode,
        });
        // Save game to mongodb
        await game.save();
        // Return game
        return res.json(game);
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error adding game:', error);
        return next(error);
    }
});

// put /games/:gameID - Put route to update a game from game collection on mongodb
router.put('/games/:gameID', async (req, res, next) => {
    try {
        // Check to see if gameID is valid
        if (isNaN(req.params.gameID)) {
            // Return error if gameID is not valid
            return res.status(400).json({ error: 'Invalid gameID' });
        }
        // Check to see if game already exists
        const gameExists = await Game.findOne({ GameID: req.params.gameID });
        if (!gameExists) {
            // Return error if game does not exist
            return res.status(404).json({ error: 'Game not found' });
        }
        // Update game
        const game = await Game.findOneAndUpdate({ GameID: req.params.gameID }, {
            GameID: req.body.GameID,
            GameName: req.body.GameName,
            GameDescription: req.body.GameDescription,
            GameImage: req.body.GameImage,
            GameEmbedCode: req.body.GameEmbedCode,
        }, { new: true });
        // Return game
        return res.json(game);
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error updating game:', error);
        return next(error);
    }
});

// delete /games/:gameID Delete route to delete a game from game collection on mongodb
router.delete('/games/:gameID', async (req, res, next) => {
    try {
        // Check to see if gameID is valid
        if (isNaN(req.params.gameID)) {
            // Return error if gameID is not valid
            return res.status(400).json({ error: 'Invalid gameID' });
        }
        // Check to see if game already exists
        const gameExists = await Game.findOne({ GameID: req.params.gameID });
        if (!gameExists) {
            // Return error if game does not exist
            return res.status(404).json({ error: 'Game not found' });
        }
        // Delete game
        await Game.findOneAndDelete({ GameID: req.params.gameID });
        // Return success
        return res.json({ success: true });
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error deleting game:', error);
        return next(error);
    }
});

// post /login/admin - use admin username and password from admin collection to verify an admin
// allows us to see who is an admin and not, if they are admin then they will be able to add/update/delete games
router.post('/login/admin', async (req, res, next) => {
    try {
        // Check admin credentials
        const admin = await Admin.findOne({
            AdminUser: req.body.AdminUser,
            AdminPassword: req.body.AdminPassword
        });
        // Check to see if admin credentials are valid
        if (!admin) {
            // Return error if admin credentials are not valid
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }
        // Return admin
        return res.json(admin);
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error getting admin:', error);
        return next(error);
    }
});

// We can hardcode in an admin account, and use that
// Regular Users cannot login as an admin or sign up to be one, they can login via steam

// Steam API
// get /login - use steam api to use steam credentials to get a token or something to login
router.get('/login/:steamID', async (req, res, next) => {
    try {
        dotenv.config({ path: '../.env' });

        let data = null;

        // Check to see if steamID is valid
        await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${req.params.steamID}`)
            .then(res => res.json())
            .then(json => {
                data = json.response.players[0];
            });

        // Check to see if user already exists
        const userExists = await User.findOne({SteamID: req.params.steamID});
        if (!userExists){
            // Create user
            newUser = new User({
                SteamID: data.steamid,
                UserName: data.personaname,
            });
            // Save user to mongodb
            await newUser.save();

            return res.json(newUser);
        }

        // Return user
        return res.json(userExists);
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error getting steam login:', error);
        return next(error);
    }
});

module.exports = router;