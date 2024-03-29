import {Mapper} from '../core/infra/Mapper';
import OrderOutDto from "../dto/out/OrderOutDto";
import {Order} from '../domain/order/order';
import {ItemMapper} from './itemMapper';
import {OrderNote} from '../domain/order/orderNote';
import {ResponsibleName} from '../domain/order/responsibleName';
import {UniqueEntityID} from "../core/domain/UniqueEntityID";
import {PayerName} from "../domain/order/payerName";
import {ReceiverName} from "../domain/order/receiverName";

export class OrderMapper extends Mapper<Order> {
    public static toDTO(order: Order): OrderOutDto {
        return {
            id: order.id.toString(),
            orderNumber: order.orderNumber,
            responsibleName: order.responsibleName.value,
            orderPrice: order.orderPrice,
            payerName: order.payerName ? order.payerName.value : 'NPY',
            orderNote: order.orderNote ? order.orderNote.text : null,
            receiverName: order.receiverName ? order.receiverName.value : null,
        };
    }

    public static async toDomain(raw: any): Promise<Order> {
        // Create the responsible name value object.
        const responsibleNameOrError = ResponsibleName.create(raw.responsibleName);
        if (responsibleNameOrError.isFailure) {
            throw new TypeError(responsibleNameOrError.errorMessage());
        }

        // If the order note is provided, create the order note value object.
        let orderNote = null;
        if (raw.orderNote) {
            const orderNoteOrError = OrderNote.create(raw.orderNote);
            if (orderNoteOrError.isFailure) {
                throw new TypeError(orderNoteOrError.errorMessage());
            }
            orderNote = orderNoteOrError.getValue();
        }

        // If the payer name is provided, create the payer name value object.
        let payerName = null;
        if (raw.payerName) {
            const payerNameOrError = PayerName.create(raw.payerName);
            if (payerNameOrError.isFailure) {
                throw new TypeError(payerNameOrError.errorMessage());
            }
            payerName = payerNameOrError.getValue();
        }

        // If the receiver name is provided, create the receiver name value object.
        let receiverName = null;
        if (raw.receiverName) {
            const receiverNameOrError = ReceiverName.create(raw.receiverName);
            if (receiverNameOrError.isFailure) {
                throw new TypeError(receiverNameOrError.errorMessage());
            }
            receiverName = receiverNameOrError.getValue();
        }

        // Create the order entity.
        const orderOrError = Order.create({
                orderNumber: raw.orderNumber,
                responsibleName: responsibleNameOrError.getValue(),
                orderNote: orderNote,
                payerName: payerName,
                receiverName: receiverName,
                orderPrice: raw.orderPrice ? raw.orderPrice : 0.0
            },
            new UniqueEntityID(raw.id),
        );

        if (orderOrError.isFailure) {
            throw new TypeError(orderOrError.errorMessage());
        }

        return orderOrError.getValue();
    }

    public static toPersistence(order: Order): any {
        const persistenceOrder : any = {
            id: order.id.toString(),
            orderNumber: order.orderNumber,
            responsibleName: order.responsibleName.value,
        };

        if (order.payerName) {
            persistenceOrder.payerName = order.payerName.value;
        }

        if (order.orderNote) {
            persistenceOrder.orderNote = order.orderNote.text;
        }

        if (order.receiverName) {
            persistenceOrder.receiverName = order.receiverName.value;
        }

        return persistenceOrder;
    }
}
