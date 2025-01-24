import mongoose, { Schema, Document } from "mongoose";

interface ICity {
  id: number;
  name: string;
}

interface IState {
  id: number;
  cities: ICity[];
}

interface ICityInventory extends Document {
  country_id: number;
  states: IState[];
}

const CitySchema: Schema = new Schema<ICity>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const StateSchema: Schema = new Schema<IState>(
  {
    id: { type: Number, required: true },
    cities: { type: [CitySchema], required: true },
  },
  { _id: false }
);

const CityInventorySchema: Schema = new Schema<ICityInventory>({
  country_id: { type: Number, required: true, unique: true },
  states: { type: [StateSchema], required: true },
});

const CityInventory = mongoose.model<ICityInventory>(
  "CityInventory",
  CityInventorySchema
);

export default CityInventory;
export { ICityInventory, ICity, IState };
