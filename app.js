const express = require('express'); // Importing express framework
const app = express(); // Creating an instance of express
const path = require('path'); // Importing path module for handling file paths
const methodOverride = require('method-override'); // Middleware for supporting PUT and DELETE methods, informs Express about the HTTP methods used in forms
const mongoose = require('mongoose'); // Importing mongoose for MongoDB interaction
const ejsMate = require('ejs-mate'); // Importing ejs-mate for using EJS as the view engine with layout support
const ExpressError = require("./utils/ExpressError.js"); // Importing ExpressError for custom error handling

const listings = require("./routes/listing.js"); // Importing the listing routes
const reviews = require("./routes/review.js") // Importing the review routes

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


app.use("/listings", listings); // Mount the listings router on the "/listings" path so all listing routes start with /listings
app.use("/listings/:id/reviews", reviews); // Mount the reviews router on the "/reviews" path so



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