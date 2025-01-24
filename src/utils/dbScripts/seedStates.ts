// Use this command in the terminal to update the StateInventory collection: 
// npx ts-node ./src/utils/dbScripts/seedStates.ts

import mongoose from "mongoose";
import dotenv from "dotenv";
import stateData from "../../../../misc/statesminified.json"; // Import the JSON data
import StateInventory from "../../models/StateInventory";

dotenv.config();


const seedStates = async () => {
    try {
      if (!process.env.DB_CONNECTION) {
        console.log("No connection string! exiting...");
        process.exit();
      }
      await mongoose.connect(process.env.DB_CONNECTION);
      console.log("Connected to DB successfully");
  
      // Clear the collection before inserting new data
      await StateInventory.deleteMany({});
      console.log(
        "Deleted all documents in StateInventory collection successfully"
      );
  
      // Drop all indexes before inserting data
      await StateInventory.collection.dropIndexes();
      console.log("Dropped indexes successfully");
  

      for(const countryStates of stateData){

        await StateInventory.create({
            country_id: countryStates.id,
            states: countryStates.states,
        });
    }
    console.log('StateInventory data populated successfully.');

    } catch (error) {
      console.error("Error populating data:", error);
    } finally {
      mongoose.connection.close();
    }
  };
  
  seedStates();