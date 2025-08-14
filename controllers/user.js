const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => { 
    // If a redirectUrl is present in the query, save it to the session
    if (req.query.redirectUrl) {
        req.session.redirectUrl = req.query.redirectUrl;
    }
    res.render("./users/signup.ejs"); // Display signup page
}

module.exports.signup = async (req, res) => {
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
            // Redirect to the saved redirectUrl or to the default /listings page
            const redirectUrl = req.session.redirectUrl || '/listings';
            delete req.session.redirectUrl; // Delete the redirectUrl from the session
            res.redirect(redirectUrl);
        });
    }
    catch (e) {
        req.flash("error", e.message); // Show error message if registration fails
        res.redirect("/signup"); // Redirect back to signup page
    }
}

module.exports.renderLoginForm = (req, res) => {
    // If a redirectUrl is present in the query, save it to the session
    if (req.query.redirectUrl) {
        req.session.redirectUrl = req.query.redirectUrl;
    }
    res.render("./users/login.ejs"); // Display login page
}

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome back to WanderLust"); // Success message after login
        // Redirect to the saved redirectUrl or to the default /listings page
        const redirectUrl = res.locals.redirectUrl || req.session.redirectUrl || "/listings";
        delete req.session.redirectUrl; // Delete the redirectUrl from the session
        res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
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
}