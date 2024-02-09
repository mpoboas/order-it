import {Service, Inject} from 'typedi';
import config from '../../../config';
import {FailureType, Result} from '../../core/logic/Result';
import IOrderService from "../IServices/IOrderService";
import IOrderRepo from "../IRepos/IOrderRepo";
import OrderCreateDto from "../../dto/create/OrderCreateDto";
import OrderOutDto from "../../dto/out/OrderOutDto";
import {OrderMapper} from "../../mappers/orderMapper";
import OrderEditDto from "../../dto/edit/OrderEditDto";
import {PayerName} from "../../domain/order/payerName";
import {OrderNote} from "../../domain/order/orderNote";
import IItemRepo from "../IRepos/IItemRepo";
import {ReceiverName} from "../../domain/order/receiverName";

@Service()
export default class OrderService implements IOrderService {
    constructor(
        @Inject(config.repos.order.name) private orderRepo: IOrderRepo,
        @Inject(config.repos.item.name) private itemRepo: IItemRepo,
    ) {
    }

    /**
     * Creates a new order.
     * @param orderCreateDto - The Dto of the order to be created.
     * @returns A promise that resolves to a Result object indicating success or failure, with the created order dto as the value.
     */
    public async createOrder(orderCreateDto: OrderCreateDto): Promise<Result<OrderOutDto>> {
        try {
            // Get the last order number
            let lastOrder = await this.orderRepo.findLastOrderNumber();

            // If there are no orders, set the last order number to 0
            if (!lastOrder) {
                lastOrder = 0;
            }

            // Create order entity
            orderCreateDto.orderNumber = lastOrder + 1;
            const order = await OrderMapper.toDomain(orderCreateDto);

            // Save order entity
            await this.orderRepo.save(order);

            // Return orderDTO
            const orderDTOResult = OrderMapper.toDTO(order) as OrderOutDto;
            return Result.ok<OrderOutDto>(orderDTOResult);
        } catch (e) {
            if (e instanceof TypeError) {
                return Result.fail<OrderOutDto>(e.message, FailureType.InvalidInput);
            }
            return Result.fail<OrderOutDto>(e.message, FailureType.DatabaseError);
        }
    }

    /**
     * Lists all orders.
     * @returns A promise that resolves to an array of orders Dto's.
     */
    public async listOrders(): Promise<OrderOutDto[]> {
        try {
            // Get all orders from the database but add the field orderPrice by looking for the items of each order and summing their prices to get the total order price
            const orders = await this.orderRepo.findAll();

            // Return ordersDto's
            return orders.map(order => OrderMapper.toDTO(order) as OrderOutDto);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Lists all orders by responsible name.
     * @param responsibleName - The responsible name to list all orders.
     * @returns A promise that resolves to an array of orders Dto's.
     */
    public async listOrderByResponsibleName(responsibleName: string): Promise<OrderOutDto[]> {
        try {
            // Get all orders from the database but add the field orderPrice by looking for the items of each order and summing their prices to get the total order price
            const orders = await this.orderRepo.findByResponsibleName(responsibleName);

            // Return ordersDto's
            return orders.map(order => OrderMapper.toDTO(order) as OrderOutDto);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Edits an existing order.
     * @param id - The ID of the order to edit.
     * @param orderEditDto - The updated order DTO.
     * @returns A promise that resolves to a Result object indicating success or failure, with the updated order DTO as the value.
     */
    public async editOrder(id: string, orderEditDto: OrderEditDto): Promise<Result<OrderOutDto>> {
        try {
            // Check if the order exists
            const order = await this.orderRepo.findById(id);
            if (!order) {
                return Result.fail<OrderOutDto>(`No Order found with id=${id}`, FailureType.EntityDoesNotExist);
            }

            // Check if a payer name was provided
            if (orderEditDto.payerName) {
                // Create the payer name value object
                const payerName = PayerName.create(orderEditDto.payerName);
                // Mark the order as paid
                order.markAsPaid(payerName.getValue());
            }

            // Check if an order note was provided
            if (orderEditDto.orderNote) {
                // Create the order note value object
                const orderNote = OrderNote.create(orderEditDto.orderNote);
                // Update the order note
                order.updateOrderNote(orderNote.getValue());
            }

            // Check if a receiver name was provided
            if (orderEditDto.receiverName) {
                // Create the receiver name value object
                const receiverName = ReceiverName.create(orderEditDto.receiverName);
                // Update the receiver name
                order.updateReceiverName(receiverName.getValue());
            }

            // If it succeeds, save the updated order
            await this.orderRepo.save(order);

            // Return the order Dto
            const orderDTOResult = OrderMapper.toDTO(order) as OrderOutDto;
            return Result.ok<OrderOutDto>(orderDTOResult);
        } catch (e) {
            if (e instanceof TypeError) {
                return Result.fail<OrderOutDto>(e.message, FailureType.InvalidInput);
            } else {
                return Result.fail<OrderOutDto>(e.message, FailureType.DatabaseError);
            }
        }
    }

    /**
     * Deletes an order.
     * @param id - The ID of the order to delete.
     * @returns A promise that resolves to a Result object indicating success or failure.
     */
    public async deleteOrder(id: string): Promise<Result<void>> {
        try {
            // Check if the order exists
            const order = await this.orderRepo.findById(id);
            if (!order) {
                return Result.fail<void>(`No Order found with id=${id}`, FailureType.EntityDoesNotExist);
            }

            // Delete all the items of the order
            await this.itemRepo.deleteItemsByOrderId(id);

            // If it exists, delete it
            await this.orderRepo.delete(id);

            return Result.ok<void>();
        } catch (e) {
            console.log(e);
            return Result.fail<void>(e.message, FailureType.DatabaseError);
        }
    }
}
