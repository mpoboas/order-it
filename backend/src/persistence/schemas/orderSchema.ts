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

        orderNumber: {
            type: Number,
            unique: true,
        },

        orderNote: {
            type: String,
        },

        payerName: {
            type: String,
        },

        receiverName: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model<IOrderPersistence & mongoose.Document>('Order', OrderSchema);
