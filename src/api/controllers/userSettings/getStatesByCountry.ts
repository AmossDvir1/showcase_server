import { Request, Response } from "express";
import StateInventory from "../../../models/StateInventory";

const getStatesByCountry = async (req: Request, res: Response) => {

  const { countryId } = req.params;
  try {
    const stateInventory = await StateInventory.findOne({ country_id: countryId }, { _id: 0, "states.cities": 0 });
      if(!stateInventory){
        return res.status(404).json({message: 'No states found for this country'})
      }
      const states = stateInventory.states.map(state => ({ id: state.id, name: state.name, state_code: state.state_code }));
      res.json(states);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve states" });
  }
};

export { getStatesByCountry };