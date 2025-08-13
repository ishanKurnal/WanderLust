const express = require("express"); // Import the Express framework
const router = express.Router({ mergeParams: true }); // Create a new router instance that inherits route parameters from its parent router
const wrapAsync = require("../utils/wrapAsync.js"); // Importing wrapAsync for error handling
const ExpressError = require("../utils/ExpressError.js"); // Importing ExpressError for custom error handling
const Review = require("../models/review.js") // Importing the review model
const Listing = require('../models/listing'); // Importing the Listing model
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); // Import middleware functions: validateReview (Joi schema validation), isLoggedIn (check authentication), isReviewAuthor (check review ownership)


// Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  console.log(req.params.id);  let listing = await Listing.findById(req.params.id); // Find listing by ID
  let newReview = new Review(req.body.review); // Create new Review object
  newReview.author = req.user._id; // Set the author of the review to the current
  // console.log(newReview);
  listing.reviews.push(newReview); // Push review into listing's reviews array
  await newReview.save(); // Save review to DB
  await listing.save(); // Save updated listing to DB
  // console.log("New review saved!"); // Debug log
  // res.send("New review saved..."); // Test response
  req.flash("success", "New Review Created!");  // Flash success message after creation of a review
  res.redirect(`/listings/${listing._id}`); // Redirect to listing detail page
}));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  // Extract the listing ID and review ID from the request parameters
  let { id, reviewId } = req.params;

  // Remove the review reference from the 'reviews' array in the Listing document
  // $pull removes the specified reviewId from the array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual Review document from the 'reviews' collection
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!"); // Flash success message after deleteion of a review
  // Redirect back to the listing's page after deletion
  res.redirect(`/listings/${id}`);
}));


module.exports = router;