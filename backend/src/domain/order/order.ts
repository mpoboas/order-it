import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { FailureType, Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';
import { ResponsibleName } from './responsibleName';
import { OrderNote } from './orderNote';
import {PayerName} from "./payerName";
import {ReceiverName} from "./receiverName";

interface OrderProps {
    orderNumber: number;
    orderNote?: OrderNote;
    responsibleName: ResponsibleName;
    payerName?: PayerName;
    receiverName?: ReceiverName;
    orderPrice?: number;
}

export class Order extends AggregateRoot<OrderProps> {
    get orderNote(): OrderNote {
        return this.props.orderNote;
    }

    get orderNumber(): number {
        return this.props.orderNumber;
    }

    get responsibleName(): ResponsibleName {
        return this.props.responsibleName;
    }

    get receiverName(): ReceiverName {
        return this.props.receiverName;
    }

    get payerName(): PayerName {
        return this.props.payerName;
    }

    get orderPrice(): number {
        return this.props.orderPrice;
    }

    private constructor(props: OrderProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: OrderProps, id?: UniqueEntityID): Result<Order> {
        const bulkGuard = Guard.againstNullOrUndefinedBulk([
            { argument: props.responsibleName, argumentName: 'Responsible Name' },
        ]);
        if (!bulkGuard.succeeded) {
            return Result.fail<Order>(bulkGuard.message, FailureType.InvalidInput);
        }

        const order = new Order({
            ...props,
        }, id);

        return Result.ok<Order>(order);
    }

    public markAsPaid(payerName: PayerName): void {
        this.props.payerName = payerName;
    }

    public updateOrderNote(orderNote: OrderNote) {
        this.props.orderNote = orderNote;
    }

    public updateReceiverName(receiverName: ReceiverName) {
        this.props.receiverName = receiverName;
    }
}
