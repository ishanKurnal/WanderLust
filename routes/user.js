const express = require("express"); // Import the Express framework
const router = express.Router(); // Create a new router instance for handling user routes
const User = require("../models/user"); // Import the User model
const wrapAsync = require("../utils/wrapAsync.js"); // Import utility to handle async errors
const passport = require("passport"); // Import Passport for authentication
const { saveRedirectUrl } = require("../middleware.js"); // Importing the saveRedirectUrl middleware function from middleware.js

const userController = require("../controllers/user.js");

// ======================= SIGNUP ROUTES =======================
// Signup routes using router.route()
router
  .route("/signup")
  // Get route render signup form
  .get(userController.renderSignupForm)
  // Post route to handle signup form submission
  .post(wrapAsync(userController.signup));

// ======================= LOGIN ROUTES =======================
router
  .route("/login")
  // Get Route to render login form
  .get(userController.renderLoginForm)
  // Post route to handle login form submission
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    userController.login
  );

// ======================== LOGOUT ROUTE ===========================
// GET Route to log out the user
router.get("/logout", userController.logout);



// Export router
module.exports = router; // Make this router available for app.js
