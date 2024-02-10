import {Inject, Service} from 'typedi';

import {Document, FilterQuery, Model} from 'mongoose';
import IItemRepo from "../services/IRepos/IItemRepo";
import {Item} from "../domain/item/item";
import {IItemPersistence} from "../dataschema/IItemPersistence";
import {ItemMapper} from "../mappers/itemMapper";
import {UniqueEntityID} from "../core/domain/UniqueEntityID";

@Service()
export default class ItemRepo implements IItemRepo {
    constructor(@Inject('itemSchema') private itemSchema: Model<IItemPersistence & Document>) {
    }

    public async findById(itemId: string): Promise<Item> {
        const query = {id: itemId};
        const itemDocument = await this.itemSchema.findOne(query);
        if (itemDocument === null) {
            return null;
        }
        return ItemMapper.toDomain(itemDocument);
    }

    public async findByOrderId(orderId: string): Promise<Item[]> {
        const query = {orderId: orderId};
        const itemDocuments = await this.itemSchema.find(query);
        const items = itemDocuments.map(ItemMapper.toDomain);
        return Promise.all(items);
    }

    public async exists(item: Item): Promise<boolean> {
        const idX = item.id instanceof UniqueEntityID ? (<UniqueEntityID>item.id).toValue() : item.id;

        const query = {id: idX};
        const itemDocument = this.itemSchema.findOne(query as FilterQuery<IItemPersistence & Document>);

        return !!itemDocument === true;
    }

    public async save(item: Item): Promise<Item> {
        const query = {id: item.id.toString()};
        const itemDocument = await this.itemSchema.findOne(query);

        try {
            if (itemDocument === null) {
                const rawItem: any = ItemMapper.toPersistence(item);

                const itemCreated = await this.itemSchema.create(rawItem);

                return ItemMapper.toDomain(itemCreated);
            } else {
                if (item.price !== null) {
                    itemDocument.itemPrice = item.price.price;
                } else {
                    itemDocument.itemPrice = null;
                }
                itemDocument.itemBrandType = item.brandType;
                itemDocument.itemName = item.name.value;
                itemDocument.itemUnitsQuantity = item.unitsQuantity.numberOfUnits;

                await itemDocument.save();
                return item;
            }
        } catch (err) {
            throw err;
        }
    }

    public async findAll(): Promise<Item[]> {
        const itemRecords = await this.itemSchema.find();
        const items = itemRecords.map(ItemMapper.toDomain);
        return Promise.all(items);
    }

    public async deleteItemsByOrderId(orderId: string): Promise<void> {
        const query = {orderId: orderId};
        await this.itemSchema.deleteMany(query);
    }
}
