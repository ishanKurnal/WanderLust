const express = require("express"); // Import the Express framework
const router = express.Router({ mergeParams: true }); // Create a new router instance that inherits route parameters from its parent router
const wrapAsync = require("../utils/wrapAsync.js"); // Importing wrapAsync for error handling
const ExpressError = require("../utils/ExpressError.js"); // Importing ExpressError for custom error handling
const { reviewSchema } = require("../schema.js"); // Importing the Joi validation schema for listings
const Review = require("../models/review.js") // Importing the review model
const Listing = require('../models/listing'); // Importing the Listing model


// Middleware function to validate the request body using Joi schema
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);  // Validate the request body against the reviewSchema
  if (error) {  // If there is a validation error
    // Extract and concatenate all error messages into a single string
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);  // Throw a custom ExpressError with status code 400 (Bad Request)
  } 
  else {
    next();   // If no error, pass control to the next middleware or route handler
  }
};


// Post Review Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
  console.log(req.params.id);  let listing = await Listing.findById(req.params.id); // Find listing by ID
  let newReview = new Review(req.body.review); // Create new Review object
  listing.reviews.push(newReview); // Push review into listing's reviews array
  await newReview.save(); // Save review to DB
  await listing.save(); // Save updated listing to DB
  // console.log("New review saved!"); // Debug log
  // res.send("New review saved..."); // Test response
  res.redirect(`/listings/${listing._id}`); // Redirect to listing detail page
}));

// Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  // Extract the listing ID and review ID from the request parameters
  let { id, reviewId } = req.params;

  // Remove the review reference from the 'reviews' array in the Listing document
  // $pull removes the specified reviewId from the array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual Review document from the 'reviews' collection
  await Review.findByIdAndDelete(reviewId);

  // Redirect back to the listing's page after deletion
  res.redirect(`/listings/${id}`);
}));


module.exports = router;