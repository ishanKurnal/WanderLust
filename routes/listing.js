const express = require("express"); // Import the Express framework
const router = express.Router();    // Create a new router instance for listing
const wrapAsync = require("../utils/wrapAsync.js"); // Importing wrapAsync for error handling
const ExpressError = require("../utils/ExpressError.js"); // Importing ExpressError for custom error handling
const { listingSchema } = require("../schema.js"); // Importing the Joi validation schema for listings
const Listing = require('../models/listing'); // Importing the Listing model


// Middleware function to validate the request body using Joi schema
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);  // Validate the request body against the listingSchema
  if (error) {  // If there is a validation error
    // Extract and concatenate all error messages into a single string
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);  // Throw a custom ExpressError with status code 400 (Bad Request)
  } 
  else {
    next();   // If no error, pass control to the next middleware or route handler
  }
};


// Index Route to display all listings
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({}); // Fetching all listings from the database
  res.render("listings/index.ejs", { allListings }); // Rendering the index view with all listings
}));

// New Route to display the form for creating a new listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs"); // Rendering the new listing form view
});

// Show Route to display a specific listing
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  const listing = await Listing.findById(id).populate("reviews"); // Finding the listing by ID in the database and populating its reviews
  res.render("listings/show.ejs", { listing }); // Rendering the show view with the specific listing
}));

// Create Route to handle the form submission for creating a new listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing); // Creating a new Listing instance with the form data
    await newListing.save(); // Saving the new listing to the database
    res.redirect("/listings"); // Redirecting to the index route after saving the new listing
}));

// Edit Route to display the form for editing a specific listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  const listing = await Listing.findById(id); // Finding the listing by ID in the
  res.render("listings/edit.ejs", { listing });
}));

// Update Route to handle the form submission for updating a specific listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  await Listing.findByIdAndUpdate(id, {...req.body.listing }); // Updating the listing in the database with the new data
  res.redirect(`/listings/${id}`); // Redirecting to the show route of the updated listing
}));

// Delete Route to handle the deletion of a specific listing
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  let deletedListing = await Listing.findByIdAndDelete(id); // Deleting the listing from the database
  console.log("Deleted Listing:", deletedListing); // Logging the deleted listing
  res.redirect("/listings"); // Redirecting to the index route after deletion
}));


module.exports = router;