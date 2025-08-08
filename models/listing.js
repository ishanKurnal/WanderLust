const mongoose = require('mongoose'); // Importing mongoose for MongoDB interaction
const Schema = mongoose.Schema; // Getting the Schema constructor from mongoose

const listingSchema = new Schema({ // Defining the schema for a listing
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: {
            filename: {
                type: String,
                default: "defaultimage", // Default filename if not provided
                set: v => v === "" ? "defaultimage" : v
            },
            url: {
                type: String,
                // If the URL is an empty string, set it to the default Unsplash URL
                set: (v) =>
                    v === ""
                        ? "https://plus.unsplash.com/premium_photo-1669748157617-a3a83cc8ea23?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        : v,
                default:
                    "https://plus.unsplash.com/premium_photo-1669748157617-a3a83cc8ea23?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Default image if none is provided
            },
        },
        default: {
            filename: "defaultimage",
            url: "https://plus.unsplash.com/premium_photo-1669748157617-a3a83cc8ea23?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Default image object if image is missing
        },
    },
    price: {
        type: Number,
        required: true
    },
    location: String,
    country: String
});


const Listing = mongoose.model('Listing', listingSchema); // Creating a model named 'Listing' using the schema
module.exports = Listing; // Exporting the Listing model for use in other files