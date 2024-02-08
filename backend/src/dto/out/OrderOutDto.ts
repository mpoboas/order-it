interface OrderOutDto {
    id: string;
    orderNumber: number;
    responsibleName: string;
    orderPrice: number;
    payerName: string;
    orderNote?: string;
}

export default OrderOutDto;

