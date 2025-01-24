import { Request, Response } from "express";
import CityInventory from "../../../models/CityInventory";

const getCitiesByStatesAndCountries = async (req: Request, res: Response) => {
  const { countryId, stateId } = req.params;

  try {
    const cityInventory = await CityInventory.findOne(
      { country_id: countryId },
      { _id: 0, states: { $elemMatch: { id: parseInt(stateId) } } }
    );
    if (!cityInventory || cityInventory.states.length === 0) {
      return res
        .status(404)
        .json({ message: "No cities found for this state and country" });
    }

    const cities = cityInventory.states[0].cities.map((city) => ({
      id: city.id,
      name: city.name,
    }));
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve cities" });
  }
};

export { getCitiesByStatesAndCountries };
