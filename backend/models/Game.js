const mongoose = require('mongoose');

// Game schema
const gameSchema = new mongoose.Schema({
    // GameID - ID of a game
    GameID: {
        type: Number,
        index: {unique: true},
    },
    // GameName - name of the game
    GameName: {
        type: String, 
        required: true,
    },
    // GameDescription - description of the game
    GameDescription: {
        type: String,
        required: true,
    },
    // GameImage - image of the game (link format: https://i.natgeofe.com/n/548/NationalGeographic_2572187_square.jpg)
    GameImage: {
        type: String,
        required: true,
    },
    // GameEmbedCode - the embed code of the game (ex: https://scratch.mit.edu/projects/908077715/embed)
    GameEmbedCode: {
        type: String,
        required: true,
    }
});

// Create GameID
async function createGameID(){
    try {
        // Find the document with the maximum GameID
        const maxGame = await this.constructor.findOne({}, { GameID: 1 }, { sort: { GameID: -1 } });

        // If a document with a GameID exists, increment it by 1; otherwise, start from 1
        const newGameID = maxGame ? maxGame.GameID + 1 : 1;

        return newGameID;
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error creating GameID:', error);
        throw error;
    }
}

// Save newly created GameID to schema when generated
gameSchema.pre('save', async function (next) {
    if (!this.GameID) {
        try {
            // Call the createGameID function to generate a new GameID
            const newGameID = await createGameID.call(this);

            // Assign the generated GameID to the current document
            this.GameID = newGameID;
        } catch (error) {
            // Handle any errors that may occur during GameID generation
            console.error('Error generating GameID:', error);
            return next(error);
        }
    }
    next();
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;