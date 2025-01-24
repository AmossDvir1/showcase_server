import { Request, Response } from "express";
import Country from "../../../models/CountryInventory";

const getCountries = async (req: Request, res: Response) => {

  try {
    const countries = await Country.find({}, { _id: 0, id: 1, name: 1 }).sort({name: 1});
    return res.json(countries);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve countries" });
  }
};

export { getCountries };