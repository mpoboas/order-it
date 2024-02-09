import {Result} from '../../core/logic/Result';
import OrderCreateDto from "../../dto/create/OrderCreateDto";
import OrderOutDto from "../../dto/out/OrderOutDto";
import OrderEditDto from "../../dto/edit/OrderEditDto";

export default interface IOrderService {
    /**
     * Creates a new Order.
     * @param orderCreateDto the orderCreateDto to create a new order
     */
    createOrder(orderCreateDto: OrderCreateDto): Promise<Result<OrderOutDto>>;

    /**
     * Lists all orders.
     */
    listOrders(): Promise<OrderOutDto[]>;

    /**
     * Edits an order.
     * @param id the order id to edit
     * @param orderEditDto contains the order data to edit
     */
    editOrder(id: string, orderEditDto: OrderEditDto): Promise<Result<OrderOutDto>>;

    /**
     * Deletes an order.
     * @param id the order id to delete
     */
    deleteOrder(id: string): Promise<Result<void>>;
}
