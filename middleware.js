const Listing = require("./models/listing"); // Importing the listing model
const Review = require("./models/review.js") // Importing the review model
const ExpressError = require("./utils/ExpressError.js"); // Importing ExpressError for custom error handling
const { listingSchema, reviewSchema } = require("./schema.js"); // Importing the Joi validation schemas for listings and reviews

// Middleware: Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    // If not logged in, save the original URL they were trying to visit
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store in session
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login"); // Redirect to login page
    }
    next(); // Proceed if authenticated
};

// Middleware: Pass saved redirect URL to res.locals
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) { // Check if redirect URL is stored in session
        res.locals.redirectUrl = req.session.redirectUrl; // Store it in res.locals for access in templates or next middleware
    }
    next(); // Continue to the next middleware or route handler
}


// Middleware to check if the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params; // Extract listing ID from URL parameters
    let listing = await Listing.findById(id); // Find the listing in the database by its ID
    if (!listing.owner.equals(res.locals.currUser._id)) { // Compare the listing's owner with the logged-in user
        req.flash("error", "You are not the owner of this listing!"); // Show error if not the owner
        return res.redirect(`/listings/${id}`); // Redirect back to the listing page
    }
    next(); // Continue to the next middleware or route handler
}


// Middleware function to validate the request body using Joi schema
module.exports.validateListing = (req, res, next) => {
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


// Middleware function to validate the request body using Joi schema
module.exports.validateReview = (req, res, next) => {
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


// Middleware to check if the logged-in user is the author of a specific review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params; // Extract listing ID and review ID from URL parameters
    let review = await Review.findById(reviewId); // Find the review in the database by its ID
    if (!review.author.equals(res.locals.currUser._id)) { // Compare the review's owner with the logged-in user
        req.flash("error", "You are not the author of this review!"); // Show error if not the author
        return res.redirect(`/listings/${id}`); // Redirect back to the listing page
    }
    next(); // Continue to the next middleware or route handler
}
