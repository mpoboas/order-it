import {Mapper} from '../core/infra/Mapper';
import {UniqueEntityID} from '../core/domain/UniqueEntityID';
import {Item} from "../domain/item/item";
import {ItemName} from "../domain/item/itemName";
import {ItemBrandType} from "../domain/item/itemBrandType";
import {ItemUnitsQuantity} from "../domain/item/itemUnitsQuantity";
import {ItemPrice} from "../domain/item/itemPrice";
import ItemOutDto from "../dto/out/ItemOutDto";

export class ItemMapper extends Mapper<Item> {
    public static toDTO(item: Item): ItemOutDto {
        return {
            itemName: item.name.value,
            itemBrandType: item.brandType,
            itemUnitsQuantity: item.unitsQuantity.numberOfUnits,
            itemPrice: item.totalPrice,
        };
    }

    public static async toDomain(raw: any): Promise<Item> {
        // Create the item name value object.
        const itemNameOrError = ItemName.create(raw.itemName);
        if (itemNameOrError.isFailure) {
            throw new TypeError(itemNameOrError.errorMessage());
        }

        // Loop through the item brand type enum and find the matching value.
        let itemBrandType: ItemBrandType;
        for (const type in ItemBrandType) {
            if (raw.itemBrandType.trim().toUpperCase() === type) {
                itemBrandType = ItemBrandType[type];
                break;
            }
        }

        // Create the item units quantity value object.
        const itemUnitsQuantityOrError = ItemUnitsQuantity.create(raw.itemUnitsQuantity);
        if (itemUnitsQuantityOrError.isFailure) {
            throw new TypeError(itemUnitsQuantityOrError.errorMessage());
        }

        // Create the item price value object or handle failure.
        let itemPrice = null;
        if (raw.itemPrice != null) {
            const itemPriceOrError = ItemPrice.create(raw.itemPrice);
            if (itemPriceOrError.isFailure) {
                throw new TypeError(itemPriceOrError.errorMessage());
            }
            itemPrice = itemPriceOrError.getValue();
        }

        // Assure the order id is a valid UniqueEntityID.
        const orderId = new UniqueEntityID(raw.orderId);

        // Create the item entity.
        const itemOrError = Item.create({
                itemName: itemNameOrError.getValue(),
                itemBrandType: itemBrandType,
                itemUnitsQuantity: itemUnitsQuantityOrError.getValue(),
                itemPrice: itemPrice,
                orderId: orderId,
            },
            new UniqueEntityID(raw.id),
        );

        if (itemOrError.isFailure) {
            throw new TypeError(itemOrError.errorMessage());
        }

        return itemOrError.getValue();
    }


    public static toPersistence(item: Item): any {
        const persistenceObject: any = {
            id: item.id.toString(),
            itemName: item.name.value,
            itemBrandType: item.brandType,
            itemUnitsQuantity: item.unitsQuantity.numberOfUnits,
            orderId: item.orderId.toString(),
        };

        // Optional props
        if (item.price != null) {
            persistenceObject.itemPrice = item.price.price;
        }

        return persistenceObject;
    }
}
