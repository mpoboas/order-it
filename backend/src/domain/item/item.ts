import {UniqueEntityID} from '../../core/domain/UniqueEntityID';
import {Guard} from '../../core/logic/Guard';
import {FailureType, Result} from '../../core/logic/Result';
import {ItemName} from './itemName';
import {ItemPrice} from './itemPrice';
import {ItemBrandType} from './itemBrandType';
import {ItemUnitsQuantity} from './itemUnitsQuantity';
import {ValueObject} from '../../core/domain/ValueObject';
import {AggregateRoot} from "../../core/domain/AggregateRoot";
import {Entity} from "../../core/domain/Entity";

interface ItemProps {
    itemName: ItemName;
    itemBrandType: ItemBrandType;
    itemUnitsQuantity: ItemUnitsQuantity;
    orderId: UniqueEntityID;
    itemPrice?: ItemPrice;
}

export class Item extends Entity<ItemProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get name(): ItemName {
        return this.props.itemName;
    }

    get brandType(): ItemBrandType {
        return this.props.itemBrandType;
    }

    get orderId(): UniqueEntityID {
        return this.props.orderId;
    }

    get unitsQuantity(): ItemUnitsQuantity {
        return this.props.itemUnitsQuantity;
    }

    set name(newName: ItemName) {
        this.props.itemName = newName;
    }

    set price(newPrice: ItemPrice) {
        this.props.itemPrice = newPrice;
    }

    get price(): ItemPrice {
        return this.props.itemPrice;
    }

    set unitsQuantity(newUnitsQuantity: ItemUnitsQuantity) {
        this.props.itemUnitsQuantity = newUnitsQuantity;
    }

    set brandType(newBrandType: ItemBrandType) {
        this.props.itemBrandType = newBrandType;
    }

    private constructor(props: ItemProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: ItemProps, id?: UniqueEntityID): Result<Item> {
        const guardResult = Guard.againstNullOrUndefined(props.itemName, 'Item Name');
        if (!guardResult.succeeded) {
            return Result.fail<Item>(guardResult.message, FailureType.InvalidInput);
        }

        // Check if brand type is null or undefined.
        const guardResultBrandType = Guard.againstNullOrUndefined(props.itemBrandType, 'Item Brand Type');
        if (!guardResultBrandType.succeeded) {
            return Result.fail<Item>(guardResultBrandType.message, FailureType.InvalidInput);
        }

        const item = new Item({
            ...props,
        }, id);

        return Result.ok<Item>(item);
    }
}
