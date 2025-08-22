const mongoose = require('mongoose'); // Importing mongoose for MongoDB interaction
const initData = require('./data'); // Importing initial data for the database
const Listing = require('../models/listing'); // Importing the Listing model
const path = require('path');
if (process.env.NODE_ENV != "production") {
  require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
}

const dbURL = process.env.ATLASDB_URL; // MongoDB connection URL

main()
  .then((res) => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL); // Connecting to MongoDB database named 'wanderlust'
}

const initDB = async () => {
    await Listing.deleteMany({}); // Clearing the existing listings in the database
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '68a84e0181aff1fd571eaee9'}));  
    await Listing.insertMany(initData.data); // Inserting initial data into the listings collection
    console.log("Database initialized with sample data!"); // Logging the initialization status
};

initDB();


