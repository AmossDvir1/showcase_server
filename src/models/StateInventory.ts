import mongoose, { Schema, Document } from 'mongoose';

interface IState {
    id: number;
    name: string;
    state_code: string;
}


interface IStateInventory extends Document {
    country_id: number;
    states: IState[];
}


const StateSchema: Schema = new Schema<IState>({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    state_code: { type: String, required: true },
}, { _id: false });


const StateInventorySchema: Schema = new Schema<IStateInventory>({
    country_id: { type: Number, required: true, unique: true },
    states: { type: [StateSchema], required: true }
});

const StateInventory = mongoose.model<IStateInventory>('StateInventory', StateInventorySchema);

export default StateInventory;
export { IStateInventory, IState };