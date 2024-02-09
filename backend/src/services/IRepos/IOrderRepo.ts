import {Repo} from '../../core/infra/Repo';
import {Order} from "../../domain/order/order";

export default interface IOrderRepo extends Repo<Order> {
    save(order: Order): Promise<Order>;

    findById(orderId: string): Promise<Order>;

    findAll(): Promise<Order[]>;

    findLastOrderNumber(): Promise<number>;

    findByResponsibleName(responsibleName: string): Promise<Order[]>;

    delete(orderId: string): Promise<void>;
}
