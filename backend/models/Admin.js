const mongoose = require('mongoose');


// Admin Schema
const adminSchema = new mongoose.Schema({
    AdminID: {
        type: Number,
        index: {unique: true},
    },
    AdminUser: {
        type: String,
        required: true,
    },
    AdminPassword: {
        type: String,
        required: true,
    }
});


// Create admin id
async function createAdminID() {
    try {
        // Find the document with the maximum AdminID
        const maxAdmin = await this.constructor.findOne({}, { AdminID: 1 }, { sort: { AdminID: -1 } });


        // If a document with a AdminID exists, increment it by 1; otherwise, start from 1
        const newAdminID = maxAdmin ? maxAdmin.AdminID + 1 : 1;


        return newAdminID;
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error creating AdminID:', error);
        throw error;
    }
}


// Save newly created AdminID to schema when generated
adminSchema.pre('save', async function (next) {
    if (!this.AdminID) {
        try {
            // Call the createAdminID function to generate a new AdminID
            const newAdminID = await createAdminID.call(this);


            // Assign the generated AdminID to the current document
            this.AdminID = newAdminID;
        } catch (error) {
            // Handle any errors that may occur during AdminID generation
            console.error('Error generating AdminID:', error);
            return next(error);
        }
    }
    next();
});


const Admin = mongoose.model('Admin', adminSchema);


module.exports = Admin;