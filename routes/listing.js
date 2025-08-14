const express = require("express"); // Import the Express framework
const router = express.Router();    // Create a new router instance for listing
const wrapAsync = require("../utils/wrapAsync.js"); // Importing wrapAsync for error handling
const Listing = require('../models/listing'); // Importing the Listing model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Importing authentication, authorization, and validation middlewares
const ListingController = require("../controllers/listings.js"); // Import the listings controller logic
const multer  = require('multer'); // Import multer for handling file uploads
const { storage } = require("../cloudConfig.js"); // Cloudinary storage adapter for multer
const upload = multer({ storage }); // Configure multer to use Cloudinary storage

// Index & Create Routes for listings using router.route()
router
  .route("/")
  // Index Route to display all listings
  .get(wrapAsync(ListingController.index))
  // Create Route to handle the form submission for creating a new listing
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.createNewListing));
  
  //.post(upload.single("listing[image][url]"), (req, res) => { // Handle single file upload from form field 'listing[image][url]'
  // res.send(req.file); // Send back uploaded file information as response


// New Route to display the form for creating a new listing
router.get("/new", isLoggedIn, ListingController.renderNewForm);

router
  .route("/:id")
  // Show Route to display a specific listing
  .get(wrapAsync(ListingController.showListing))
  // Update Route to handle the form submission for updating a specific listing
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.updateListing))
  // Delete Route to handle the deletion of a specific listing
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));

// Edit Route to display the form for editing a specific listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));


module.exports = router;