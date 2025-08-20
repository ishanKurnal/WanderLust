const mongoose = require('mongoose'); // Importing mongoose for MongoDB interaction
const Review = require('./review'); // Importing the reviews Schema
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
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        // Coordinates are stored as an array of numbers [longitude, latitude]
        // This is the GeoJSON format for points
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

// Post middleware for 'findOneAndDelete' on the Listing model
// This runs AFTER a Listing document is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    // Check if a listing was actually found and deleted
    if (listing) {
        // Delete all reviews whose _id is present in the 'reviews' array of the deleted listing
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});



const Listing = mongoose.model('Listing', listingSchema); // Creating a model named 'Listing' using the schema
module.exports = Listing; // Exporting the Listing model for use in other files