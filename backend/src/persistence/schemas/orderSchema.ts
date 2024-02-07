import mongoose, {Schema} from 'mongoose';
import {IOrderPersistence} from "../../dataschema/IOrderPersistence";

const OrderSchema = new Schema(
    {
        id: {
            type: String,
            unique: true,
        },

        responsibleName: {
            type: String,
        },

        orderNote: {
            type: String,
        },

        payerName: {
            type: String,
        },
    },
    {
        timestamps: true,
        _id: false,
    },
);

export default mongoose.model<IOrderPersistence & mongoose.Document>('Order', OrderSchema);
