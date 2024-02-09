import {Repo} from '../../core/infra/Repo';
import {Item} from "../../domain/item/item";

export default interface IItemRepo extends Repo<Item> {
    save(item: Item): Promise<Item>;

    findById(itemId: string): Promise<Item>;

    findAll(): Promise<Item[]>;

    findByOrderId(orderId: string): Promise<Item[]>;

    deleteItemsByOrderId(orderId: string): Promise<void>;
}
