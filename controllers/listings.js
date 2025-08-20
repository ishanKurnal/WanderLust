const { Query } = require("mongoose");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); // Importing Mapbox Geocoding service
const mapToken = process.env.MAP_TOKEN; // Getting the Mapbox token from environment variables
const geocodingClinet = mbxGeocoding({ accessToken: mapToken }); // Initializing the geocoder with the Mapbox token 

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}); // Fetching all listings from the database
  res.render("listings/index.ejs", { allListings }); // Rendering the index view with all listings
}

module.exports.renderNewForm =  (req, res) => {
  // console.log(req.user);
  res.render("listings/new.ejs"); // Rendering the new listing form view
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner"); // Fetch the listing by its ID, populate the 'reviews' field (including each review's 'author'), and populate the 'owner' field
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing }); // Rendering the show view with the specific listing
}

module.exports.createNewListing = async (req, res, next) => {
  let response = await geocodingClinet
      .forwardGeocode({
        // query: "New Delhi, India",
        query: req.body.listing.location, // Use the location from the form data
        limit: 1
      })
      .send(); // Using Mapbox Geocoding to get coordinates for the location "New Delhi, India"
  // console.log(response.body.features[0].geometry.coordinates);
  // res.send("Done");


  const newListing = new Listing(req.body.listing); // Creating a new Listing instance with the form data
  newListing.owner = req.user._id; // Setting the owner of the listing to the current user who has logged in    // If a file is uploaded, save its path and filename
  if (req.file) {
        newListing.image = {
            url: req.file.path,     // Cloudinary URL of the uploaded image
            filename: req.file.filename // Public ID / filename in Cloudinary
        };
  }
  newListing.geometry = response.body.features[0].geometry; // Setting the geometry field with coordinates from Mapbox Geocoding response
  let savedListing = await newListing.save(); // Saving the new listing to the database
  console.log("Saved Listing:", savedListing); // Logging the saved listing
  req.flash("success", "Created a new listing!"); // Flash success message after creation of a listing
  res.redirect("/listings"); // Redirecting to the index route after saving the new listing
}

// module.exports.createNewListing = async (req, res) => {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     console.log(url, "..", filename);
//     const newListing = new Listing(req.body.listing); // Creating a new Listing instance with the form data
//     // console.log(req.user);
//     newListing.owner = req.user._id; // Setting the owner of the listing to the current user who has logged in
//     newListing.image = { url, filename };
//     await newListing.save(); // Saving the new listing to the database
//     req.flash("success", "Created a new listing!"); // Flash success message after creation of a listing
//     res.redirect("/listings"); // Redirecting to the index route after saving the new listing
// }

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params; // Extracting the listing ID from the request parameters
    const listing = await Listing.findById(id); // Finding the listing by ID in the database
    if (!listing) { // If the listing is not found
        req.flash("error", "Listing you requested for doesn't exist!"); // Flash error message
        return res.redirect("/listings"); // Redirect to the listings index page
    }
    let originalImageUrl = listing.image.url; // Getting the original image URL
    // Modifying the image URL to display a resized version (250px width) for preview in the edit form
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    // Rendering the edit form page with the listing data and the resized preview image
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params; // Extracting the listing ID from the route parameters
    // Finding the listing by ID and updating it with the new form data
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // If a new image is uploaded, update the image URL and filename
    if (req.file) {
        let url = req.file.path; // Cloudinary URL of the uploaded image
        let filename = req.file.filename; // Public ID / filename in Cloudinary
        listing.image = { url, filename }; // Updating the image field of the listing
        await listing.save(); // Saving the updated listing with the new image
    }
    req.flash("success", "Listing updated successfully!"); // Flash success message after updating the listing
    res.redirect(`/listings/${id}`); // Redirecting to the updated listing's show page
};


module.exports.destroyListing = async (req, res) => {
  let { id } = req.params; // Extracting the listing ID from the request parameters
  let deletedListing = await Listing.findByIdAndDelete(id); // Deleting the listing from the database
  console.log("Deleted Listing:", deletedListing); // Logging the deleted listing
  req.flash("success", "Listing deleted successfully!"); // Flash success message after deletion of a listing
  res.redirect("/listings"); // Redirecting to the index route after deletion
}