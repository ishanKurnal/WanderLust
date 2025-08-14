const express = require("express"); // Import the Express framework
const router = express.Router({ mergeParams: true }); // Create a new router instance that inherits route parameters from its parent router
const wrapAsync = require("../utils/wrapAsync.js"); // Importing wrapAsync for error handling
const ExpressError = require("../utils/ExpressError.js"); // Importing ExpressError for custom error handling
const Review = require("../models/review.js") // Importing the review model
const Listing = require('../models/listing'); // Importing the Listing model
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); // Import middleware functions: validateReview (Joi schema validation), isLoggedIn (check authentication), isReviewAuthor (check review ownership)

const ReviewController = require("../controllers/reviews.js");

// Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroyReview));


module.exports = router;