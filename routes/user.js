const express = require("express"); // Import the Express framework
const router = express.Router(); // Create a new router instance for handling user routes
const User = require("../models/user"); // Import the User model
const wrapAsync = require("../utils/wrapAsync.js"); // Import utility to handle async errors
const passport = require("passport"); // Import Passport for authentication
const { saveRedirectUrl } = require("../middleware.js"); // Importing the saveRedirectUrl middleware function from middleware.js

// ======================= SIGNUP ROUTES =======================

// Get route render signup form
router.get("/signup", (req, res) => { 
    res.render("./users/signup.ejs"); // Display signup page
});

// Post route to handle signup form submission
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body; // Extract form data
        const newUser = new User({ email, username }); // Create a new User object without password
        const registeredUser = await User.register(newUser, password); // Register user with hashed password
        console.log(registeredUser); // Debug: log registered user details
        req.login(registeredUser, (err) => {   
            if (err) {
                return next(err); // If there's an error during login, pass it to the error handler
            }
            req.flash("success", "Welcome to WanderLust!"); // Success flash message
            res.redirect("/listings"); // Redirect to listings page
        });
    }
    catch (e) {
        req.flash("error", e.message); // Show error message if registration fails
        res.redirect("/signup"); // Redirect back to signup page
    }
}));

// ======================= LOGIN ROUTES =======================

// Get Route to render login form
router.get("/login", (req, res) => {
    res.render("./users/login.ejs"); // Display login page
});

// Post route to handle login form submission
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), // Authenticate using Passport local strategy
    async (req, res) => {
        req.flash("success", "Welcome back to WanderLust"); // Success message after login
        let redirectUrl = res.locals.redirectUrl || "/listings" //
        res.redirect(redirectUrl); // 
    }
);

// ======================== LOGOUT ROUTE ===========================

// GET Route to log out the user
router.get("/logout", (req, res, next) => {
    // Passport's logout method removes the user from the session
    req.logout((err) => { 
        if (err) { 
            return next(err); // If there's an error during logout, pass it to the error handler
        }
        // Flash a success message after successful logout
        req.flash("success", "You are logged out!");
        // Redirect the user back to the listings page
        res.redirect("/listings");
    });
});


// Export router
module.exports = router; // Make this router available for app.js
