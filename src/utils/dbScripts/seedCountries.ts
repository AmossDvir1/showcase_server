// Use this command in the terminal to update the TechnologiesInventory collection: 
// npx ts-node ./src/utils/dbScripts/seedCountries.ts

import mongoose from "mongoose";
import dotenv from "dotenv";
import CountryInventory from "../../models/CountryInventory";
import countryData from "../../../../misc/countriesminified.json"; // Import the JSON data

dotenv.config();

const seedCountries = async () => {
  try {
    if (!process.env.DB_CONNECTION) {
      console.log("No connection string! exiting...");
      process.exit();
    }
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Connected to DB successfully");

    // Clear the collection before inserting new data
    await CountryInventory.deleteMany({});
    console.log(
      "Deleted all documents in TechnologiesInventory collection successfully"
    );

    // Drop all indexes before inserting data
    await CountryInventory.collection.dropIndexes();
    console.log("Dropped indexes successfully");

    // Insert data if the collection is empty
    await CountryInventory.insertMany(countryData);
    console.log("Countries data populated successfully.");
  } catch (error) {
    console.error("Error populating data:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedCountries();
