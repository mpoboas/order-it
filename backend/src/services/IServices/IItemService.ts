import {Result} from '../../core/logic/Result';
import ItemCreateDto from "../../dto/create/ItemCreateDto";
import ItemOutDto from "../../dto/out/ItemOutDto";
import ItemEditDto from "../../dto/edit/ItemEditDto";

export default interface IItemService {
    /**
     * Creates a new Item.
     * @param itemCreateDto the itemCreateDto to create a new item
     */
    createItem(itemCreateDto: ItemCreateDto): Promise<Result<ItemOutDto>>;

    /**
     * Lists all items.
     */
    listItems(): Promise<ItemOutDto[]>;

    /**
     * Edits an item.
     * @param id the item id to edit
     * @param itemEditDto contains the item data to edit
     */
    editItem(id: string, itemEditDto: ItemEditDto): Promise<Result<ItemOutDto>>;

    /**
     * Lists all items by order.
     * @param orderId the order id to list the items
     */
    listItemsByOrder(orderId: string): Promise<ItemOutDto[]>;
}
