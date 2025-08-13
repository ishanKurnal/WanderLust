const express = require('express'); // Importing express framework
const app = express(); // Creating an instance of express
const path = require('path'); // Importing path module for handling file paths
const methodOverride = require('method-override'); // Middleware for supporting PUT and DELETE methods, informs Express about the HTTP methods used in forms
const mongoose = require('mongoose'); // Importing mongoose for MongoDB interaction
const ejsMate = require('ejs-mate'); // Importing ejs-mate for using EJS as the view engine with layout support
const ExpressError = require("./utils/ExpressError.js"); // Importing ExpressError for custom error handling
const session = require("express-session"); // Import the express-session middleware to manage sessions
const flash = require("connect-flash"); // Import connect-flash for flash messaging
const passport = require("passport"); // Import Passport for authentication handling
const LocalStrategy = require("passport-local"); // Import local strategy for username/password authentication
const User = require("./models/user.js"); // Import User model for database operations

const listingsRouter = require("./routes/listing.js"); // Importing the listing routes
const reviewsRouter = require("./routes/review.js") // Importing the review routes
const userRouter = require("./routes/user.js"); // Importing the user routes for login/signUp page

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

// Session configuration options
const sessionOptions = {  
  secret: "mysupersecretcode", // Secret key to sign the session ID cookie (must be kept private in production)
  resave: false,               // Prevents resaving a session if it wasn't modified during the request
  saveUninitialized: true,     // Forces uninitialized sessions (new but not modified) to be saved to the store
  
  // Cookie settings for the session ID
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expiration date (in ms) — here: current time + 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,               // Maximum age of the cookie in milliseconds (7 days)
    httpOnly: true                                 // Makes the cookie inaccessible to JavaScript (prevents XSS attacks)
  }
}

app.get("/", (req, res) => {
    res.send("Welcome to the WanderLust app!"); // Home route
});

// Register the session middleware with Express
app.use(session(sessionOptions)); // Enables session management for all incoming requests
app.use(flash()); // Enable flash middleware to store temporary messages

app.use(passport.initialize()); // Initialize Passport middleware for authentication
app.use(passport.session());  // Enable persistent login sessions

// use static serialize and deserialize of model for passport session support
// Link Passport's LocalStrategy to our User model's authenticate() method
// authenticate() is provided by passport-local-mongoose. It verifies username and password during login
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());  // Tells Passport how to store user data in the session (by user ID)
passport.deserializeUser(User.deserializeUser());  // Tells Passport how to retrieve full user details from the session data

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Store success flash messages in res.locals for templates
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;  // Makes the currently authenticated user available to all views (EJS templates) as 'currUser'
 
  // console.log(res.locals.success); // Debug: log success messages to console
  next(); // Proceed to next middleware/route
});

// Demo Route: Creating a User
// app.get("/demoUser", async (req, res) => {
//   let fakeUser = new User({   // Create a fake user instance with email & username
//     email: "lana@gmail.com",
//     username: "lanadelrey",
//   });

//   // register() is provided by passport-local-mongoose
//   // It adds a hashed password & stores the user in MongoDB. It Also ensures username is unique
//   let registeredUser = await User.register(fakeUser, "lana@12345");
//   res.send(registeredUser);
// });

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


app.use("/listings", listingsRouter); // Mount the listings router on the "/listings" path so all listing routes start with /listings
app.use("/listings/:id/reviews", reviewsRouter); // Mount the reviews router on the "/reviews" path
app.use("/", userRouter); // 


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