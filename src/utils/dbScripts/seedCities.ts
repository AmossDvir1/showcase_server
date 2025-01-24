// Use this command in the terminal to update the CityInventory collection: 
// npx ts-node ./src/utils/dbScripts/seedCities.ts

import mongoose from "mongoose";
import dotenv from "dotenv";
import cityData from "../../../../misc/citiesminified.json"; // Import the JSON data
import CityInventory from "../../models/CityInventory";

dotenv.config();


const seedCities = async () => {
    try {
      if (!process.env.DB_CONNECTION) {
        console.log("No connection string! exiting...");
        process.exit();
      }
      await mongoose.connect(process.env.DB_CONNECTION);
      console.log("Connected to DB successfully");
  
      // Clear the collection before inserting new data
      await CityInventory.deleteMany({});
      console.log(
        "Deleted all documents in CityInventory collection successfully"
      );
  
      // Drop all indexes before inserting data
      await CityInventory.collection.dropIndexes();
      console.log("Dropped indexes successfully");
  

      for(const countryStates of cityData){
        const states = countryStates.states.map((state: any) => {
            const cities = state.cities.map((city: any) => ({
                id: city.id,
                name: city.name
            }));
            return { id: state.id, cities };
        })

        await CityInventory.create({country_id: countryStates.id, states: states})
    }
    console.log('CityInventory data populated successfully.');

    } catch (error) {
      console.error("Error populating data:", error);
    } finally {
      mongoose.connection.close();
    }
  };
  
  seedCities();