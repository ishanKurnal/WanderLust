const express = require("express"); // Import the Express framework
const router = express.Router();    // Create a new router instance for listing
const wrapAsync = require("../utils/wrapAsync.js"); // Importing wrapAsync for error handling
const Listing = require('../models/listing'); // Importing the Listing model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Importing authentication, authorization, and validation middlewares



// Index Route to display all listings
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({}); // Fetching all listings from the database
  res.render("listings/index.ejs", { allListings }); // Rendering the index view with all listings
}));

// New Route to display the form for creating a new listing
router.get("/new", isLoggedIn, (req, res) => {
  // console.log(req.user);
  res.render("listings/new.ejs"); // Rendering the new listing form view
});

// Show Route to display a specific listing
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner"); // Fetch the listing by its ID, populate the 'reviews' field (including each review's 'author'), and populate the 'owner' field
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing }); // Rendering the show view with the specific listing
}));

// Create Route to handle the form submission for creating a new listing
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing); // Creating a new Listing instance with the form data
    // console.log(req.user);
    newListing.owner = req.user._id; // Setting the owner of the listing to the current user who has logged in
    await newListing.save(); // Saving the new listing to the database
    req.flash("success", "Created a new listing!"); // Flash success message after creation of a listing
    res.redirect("/listings"); // Redirecting to the index route after saving the new listing
}));

// Edit Route to display the form for editing a specific listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  const listing = await Listing.findById(id); // Finding the listing by ID in the
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// Update Route to handle the form submission for updating a specific listing
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  await Listing.findByIdAndUpdate(id, {...req.body.listing }); // Updating the listing in the database with the new data
  req.flash("success", "Listing updated successfully!"); // Flash success message after updation of a listing
  res.redirect(`/listings/${id}`); // Redirecting to the show route of the updated listing
}));

// Delete Route to handle the deletion of a specific listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  let deletedListing = await Listing.findByIdAndDelete(id); // Deleting the listing from the database
  console.log("Deleted Listing:", deletedListing); // Logging the deleted listing
  req.flash("success", "Listing deleted successfully!"); // Flash success message after deletion of a listing
  res.redirect("/listings"); // Redirecting to the index route after deletion
}));


module.exports = router;