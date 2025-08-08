const mongoose = require('mongoose'); // Importing mongoose for MongoDB interaction
const initData = require('./data'); // Importing initial data for the database
const Listing = require('../models/listing'); // Importing the Listing model

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'; // MongoDB connection URL

main()
  .then((res) => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL); // Connecting to MongoDB database named 'wanderlust'
}

const initDB = async () => {
    await Listing.deleteMany({}); // Clearing the existing listings in the database
    await Listing.insertMany(initData.data); // Inserting initial data into the listings collection
    console.log("Database initialized with sample data!"); // Logging the initialization status
};

initDB();


