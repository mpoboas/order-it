interface OrderOutDto {
    id: string;
    orderNumber: number;
    responsibleName: string;
    orderPrice: number;
    payerName: string;
    receiverName?: string;
    orderNote?: string;
}

export default OrderOutDto;

