import {IItemPersistence} from '../../dataschema/IItemPersistence';
import mongoose, {Schema} from 'mongoose';

const ItemSchema = new Schema(
    {
        id: {
            type: String,
            unique: true,
        },

        itemName: {
            type: String,
        },

        itemBrandType: {
            type: String,
        },

        itemUnitsQuantity: {
            type: Number,
        },

        itemPrice: {
            type: Number,
        },

        orderId: {
            type: String,
            index: true,
        }
    },
    {
        timestamps: true,
    },
);

export default mongoose.model<IItemPersistence & mongoose.Document>('Item', ItemSchema);
