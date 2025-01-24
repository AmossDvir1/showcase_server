import mongoose, { Schema, Document } from 'mongoose';

interface ICountryInventory extends Document {
  id: number;
  name: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string | null;
  region: string;
  emoji: string;
}

const CountryInventorySchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true},
  name: { type: String, required: true },
  phone_code: { type: String, required: true },
  capital: { type: String, default: "" },
  currency: { type: String, default: "" },
  currency_name: { type: String, default: "" },
  currency_symbol: { type: String, default: "" },
  tld: { type: String, default: "" },
  native: { type: String, default: "" },
  region: { type: String, required: true },
  emoji: { type: String, required: true },
});

const Country = mongoose.model<ICountryInventory>('CountryInventory', CountryInventorySchema);

export default Country;
export { ICountryInventory };