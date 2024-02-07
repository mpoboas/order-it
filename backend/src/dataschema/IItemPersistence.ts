export interface IItemPersistence {
    _id: string;
    itemPrice: number | null;
    itemName: string;
    itemBrandType: string;
    itemUnitsQuantity: number;
    orderId: string | null;
}
