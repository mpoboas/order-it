export interface IOrderPersistence {
    _id: string;
    orderNumber: number;
    responsibleName: string;
    orderNote: string| null;
    payerName: string | null;
}
