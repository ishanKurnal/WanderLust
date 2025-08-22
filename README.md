# WanderLust: A Full-Stack Travel Listing Platform

WanderLust is a feature-rich web application designed for travelers to discover, share, and review unique accommodations around the world. Built with a modern technology stack, this platform provides a seamless and interactive user experience, from browsing listings with interactive maps to secure user authentication and image uploads.

**Live Demo:** [https://wanderlust-ept2.onrender.com](https://wanderlust-ept2.onrender.com)

**(Optional: You can add a screenshot of your application here)**
![WanderLust Screenshot](link-to-your-screenshot.png)

## Table of Contents

*   [In-Depth Features](#in-depth-features)
*   [Architectural Overview](#architectural-overview)
*   [Technology Stack](#technology-stack)
*   [Installation and Setup](#installation-and-setup)
*   [API Endpoints](#api-endpoints)
*   [File Structure](#file-structure)
*   [Contributing](#contributing)
*   [License](#license)

## In-Depth Features

*   **Complete User Authentication System:**
    *   Secure user registration with password hashing using `passport-local-mongoose`.
    *   User login and logout functionality with persistent sessions stored in MongoDB using `connect-mongo`.
    *   Protected routes to ensure that only authenticated users can create listings and leave reviews.
    *   Authorization middleware to ensure that users can only edit and delete their own listings and reviews.

*   **Comprehensive CRUD Functionality for Listings:**
    *   **Create:** Authenticated users can create new listings with a title, description, price, location, country, category, and an image.
    *   **Read:** All users can view all listings, with detailed information on the show page.
    *   **Update:** Users can edit the details of their own listings.
    *   **Delete:** Users can delete their own listings.

*   **Interactive Maps and Geocoding:**
    *   Each listing's location is displayed on an interactive map on the show page using the Mapbox API.
    *   When a new listing is created, the address is automatically geocoded to get the latitude and longitude for the map marker.

*   **Reviews and Ratings:**
    *   Authenticated users can submit reviews with a star rating (1-5) and a comment for any listing.
    *   All reviews for a listing are displayed on the listing's show page.

*   **Cloud Image Uploads:**
    *   Image uploads are handled using Multer and are directly uploaded to Cloudinary, keeping the application's server stateless and scalable.

*   **Advanced Search and Filtering:**
    *   Users can search for listings by title, description, location, or country.
    *   Listings can be filtered by category (e.g., Trending, Rooms, Mountains, etc.).

*   **User-Friendly Interface:**
    *   A clean and modern UI built with Bootstrap.
    *   Responsive design that works on all screen sizes.
    *   Informative flash messages to provide feedback to the user on their actions.

## Architectural Overview

This project is built using the **Model-View-Controller (MVC)** architectural pattern, which separates the application's logic into three interconnected components:

*   **Models:** Define the structure of the data and handle interactions with the MongoDB database. The schemas for `Listing`, `User`, and `Review` are defined in the `/models` directory.
*   **Views:** The user interface of the application, rendered using EJS (Embedded JavaScript) templates. The view files are located in the `/views` directory.
*   **Controllers:** Contain the application's business logic. They handle user requests from the routes, interact with the models to manipulate data, and render the appropriate views to the user. This separation of concerns makes the application more organized, easier to maintain, and scalable.

## Technology Stack

### Backend

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web framework for Node.js.
*   **MongoDB:** NoSQL database for storing data.
*   **Mongoose:** ODM for MongoDB.
*   **Passport.js:** Authentication middleware.
*   **Joi:** For server-side data validation.

### Frontend

*   **EJS (Embedded JavaScript):** Templating engine.
*   **Bootstrap:** CSS framework for responsive design.
*   **HTML5, CSS3, JavaScript**

### APIs & Services

*   **MongoDB Atlas:** Cloud database service.
*   **Cloudinary:** Cloud-based image management.
*   **Mapbox:** For interactive maps and geocoding.

### Deployment

*   **Render:** For hosting and deploying the application.

## Installation and Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/WanderLust.git
    cd WanderLust
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following environment variables. Replace the placeholder values with your actual credentials.
    ```
    ATLASDB_URL=<your_mongodb_atlas_connection_string>
    CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUD_API_KEY=<your_cloudinary_api_key>
    CLOUD_API_SECRET=<your_cloudinary_api_secret>
    MAP_TOKEN=<your_mapbox_api_token>
    SECRET=<a_strong_session_secret>
    ```

    ### Explanation of Environment Variables

 1. **ATLASDB_URL**

   * What it is: This is the connection string that your application uses to connect to your MongoDB Atlas database. It contains the necessary information for your application to find
     and authenticate with your database cluster in the cloud.
   * Where to get it:
       1. Log in to your MongoDB Atlas (https://cloud.mongodb.com/) account.
       2. Navigate to your cluster and click the "Connect" button.
       3. Select "Connect your application".
       4. Choose the Node.js driver and the appropriate version.
       5. Copy the provided connection string. It will look something like this:
   1         mongodb+srv://<username>:<password>@<cluster-address>/test?retryWrites=true&w=majority
       6. Replace <password> with the password for your database user.
       7. Replace test with wanderlust to use your desired database name.

  2. **CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET**

   * What they are: These are your credentials for your Cloudinary account. They are used by the application to authenticate with the Cloudinary API and upload images to your Cloudinary
     storage.
   * Where to get them:
       1. Log in to your Cloudinary (https://cloudinary.com/) account.
       2. Navigate to your Dashboard.
       3. You will find your Cloud Name, API Key, and API Secret displayed on the dashboard. Copy and paste these values into your .env file.

  3. **MAP_TOKEN**

   * What it is: This is your access token for your Mapbox account. It is used to authenticate with the Mapbox API, which allows your application to display maps and perform geocoding
     (converting addresses to coordinates).
   * Where to get it:
       1. Log in to your Mapbox (https://www.mapbox.com/) account.
       2. On your main account page (the first page you see after logging in), you will find your "Default public token". Copy this token and paste it into your .env file.

  4. **SECRET**

   * What it is: This is a secret key that is used by express-session to sign the session ID cookie. This signature helps to protect the session cookie from being tampered with on the
     client side, which is an important security measure to prevent session hijacking.
   * How to create it:
       * This should be a long, random, and unique string of characters.
       * You can use an online random string generator to create a strong secret, or you can simply type a long and complex sentence.
       * Example: SECRET=my-super-secret-and-long-session-key-that-is-hard-to-guess
       * Important: Do not use a simple or easily guessable secret. Keep this value private.


4.  **Initialize the database (optional):**
    To populate the database with some sample data, run the following command:
    ```bash
    node init/index.js
    ```

5.  **Start the application:**
    ```bash
    node app.js
    ```
    The application should now be running on `http://localhost:3009`.

## API Endpoints

### Listings

| Method   | Endpoint           | Description                  |
| :------- | :----------------- | :--------------------------- |
| `GET`    | `/listings`        | Get all listings             |
| `GET`    | `/listings/new`    | Form to create a new listing |
| `POST`   | `/listings`        | Create a new listing         |
| `GET`    | `/listings/:id`    | Get a single listing         |
| `GET`    | `/listings/:id/edit`| Form to edit a listing       |
| `PUT`    | `/listings/:id`    | Update a listing             |
| `DELETE` | `/listings/:id`    | Delete a listing             |
| `GET`    | `/listings/search` | Search for listings          |

### Reviews

| Method   | Endpoint                    | Description                       |
| :------- | :-------------------------- | :-------------------------------- |
| `POST`   | `/listings/:id/reviews`     | Create a new review for a listing |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Delete a review                   |

### Users

| Method | Endpoint  | Description      |
| :----- | :-------- | :--------------- |
| `GET`  | `/signup` | Form to sign up  |
| `POST` | `/signup` | Create a new user|
| `GET`  | `/login`  | Form to log in   |
| `POST` | `/login`  | Log in a user    |
| `GET`  | `/logout` | Log out a user   |

## File Structure

```
/
├── app.js              # Main application file
├── cloudConfig.js      # Cloudinary configuration
├── middleware.js       # Custom middleware
├── package.json        # Project dependencies
├── schema.js           # Joi validation schemas
├── .env                # Environment variables
├── controllers/        # Route handlers (business logic)
│   ├── listings.js
│   ├── reviews.js
│   └── user.js
├── init/               # Database initialization scripts
│   ├── data.js
│   └── index.js
├── models/             # Mongoose models (database schemas)
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── public/             # Static assets (CSS, JS, images)
│   ├── css/
│   └── js/
├── routes/             # Express routes
│   ├── listing.js
│   ├── review.js
│   └── user.js
└── views/              # EJS templates
    ├── includes/
    ├── layouts/
    ├── listings/
    └── users/
```

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
