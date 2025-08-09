const express = require('express'); // Importing express framework
const app = express(); // Creating an instance of express
const path = require('path'); // Importing path module for handling file paths
const methodOverride = require('method-override'); // Middleware for supporting PUT and DELETE methods, informs Express about the HTTP methods used in forms
const mongoose = require('mongoose'); // Importing mongoose for MongoDB interaction
const Listing = require('./models/listing'); // Importing the Listing model
const ejsMate = require('ejs-mate'); // Importing ejs-mate for using EJS as the view engine with layout support
const wrapAsync = require("./utils/wrapAsync.js"); // Importing wrapAsync for error handling
const ExpressError = require("./utils/ExpressError.js"); // Importing ExpressError for custom error handling
const { listingSchema, reviewSchema } = require("./schema.js"); // Importing the Joi validation schema for listings
const Review = require("./models/review.js") // Importing the review model

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'; // MongoDB connection URL

main()
  .then((res) => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL); // Connecting to MongoDB database named 'wanderlust'

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/WanderLust');` if your database has auth enabled
}

const port = 3009; // Setting the port for the server

app.set("view engine", "ejs"); // Setting EJS as the view engine
app.engine("ejs", ejsMate); // Using ejs-mate for EJS templates with layout support
app.set("views", path.join(__dirname, "views")); // Setting the views directory for EJS templates
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodOverride("_method")); // Middleware to support PUT and DELETE methods in forms
app.use(express.static(path.join(__dirname, "public"))); // Serving static files from the 'public' directory

app.get("/", (req, res) => {
    res.send("Welcome to the WanderLust app!"); // Home route
});

// Creating a route to test the Listing model by saving a sample listing
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "California",
//     country: "USA"
//   });
//   await sampleListing.save(); // Saving the sample listing to the database
//   res.send("Sample listing saved to database!");
//   console.log("Sample listing saved to database:", sampleListing); // Logging the saved listing
// });


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


// Index Route to display all listings
app.get("/listings", wrapAsync(async (req, res) => {
  // await Listing.find({})
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  const allListings = await Listing.find({}); // Fetching all listings from the database
  res.render("listings/index.ejs", { allListings }); // Rendering the index view with all listings
}));

// New Route to display the form for creating a new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs"); // Rendering the new listing form view
});

// Show Route to display a specific listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  const listing = await Listing.findById(id).populate("reviews"); // Finding the listing by ID in the database and populating its reviews
  res.render("listings/show.ejs", { listing }); // Rendering the show view with the specific listing
}));

// Create Route to handle the form submission for creating a new listing
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    // let { title, description, price, location, country } = req.body; // Extracting form data from the request body
    //let listing = req.body.listing; // Getting the listing data from the request body
    //console.log(req.body); // Logging the form data

    // // Validate the request body against the Joi schema
    // let result = listingSchema.validate(req.body);
    // console.log(result); // Logs validation result for debugging

    // // If validation fails, throw a custom error with status 400
    // if (result.error) {
    //   throw new ExpressError(400, result.error);
    // }

    // // Additional check in case 'listing' field is missing
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listing.");
    // }

    const newListing = new Listing(req.body.listing); // Creating a new Listing instance with the form data
    await newListing.save(); // Saving the new listing to the database
    res.redirect("/listings"); // Redirecting to the index route after saving the new listing
}));

// Edit Route to display the form for editing a specific listing
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  const listing = await Listing.findById(id); // Finding the listing by ID in the
  res.render("listings/edit.ejs", { listing });
}));

// Update Route to handle the form submission for updating a specific listing
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing.");
  // }
  let { id } = req.params; // Extracting the listing ID from the request parameters
  await Listing.findByIdAndUpdate(id, {...req.body.listing }); // Updating the listing in the database with the new data
  res.redirect(`/listings/${id}`); // Redirecting to the show route of the updated listing
}));

// Delete Route to handle the deletion of a specific listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  let deletedListing = await Listing.findByIdAndDelete(id); // Deleting the listing from the database
  console.log("Deleted Listing:", deletedListing); // Logging the deleted listing
  res.redirect("/listings"); // Redirecting to the index route after deletion
}));

// Reviews
// Post Review Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id); // Find listing by ID
  let newReview = new Review(req.body.review); // Create new Review object
  listing.reviews.push(newReview); // Push review into listing's reviews array
  await newReview.save(); // Save review to DB
  await listing.save(); // Save updated listing to DB
  // console.log("New review saved!"); // Debug log
  // res.send("New review saved..."); // Test response
  res.redirect(`/listings/${listing._id}`); // Redirect to listing detail page
}));

// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
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


// Custom error handling when page not found!
app.all(/.*/, (req, res, next) => {  // When the client tries to search an invalid route ("*")
  next(new ExpressError(404, "Page not found!"));
});

// Custom error handling middleware
app.use((err, req, res, next) => {
  // res.send("Something went wrong!");
  let { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(port, () => {
    console.log("Server is listening to port:", port); // Starting the server and logging the port
});