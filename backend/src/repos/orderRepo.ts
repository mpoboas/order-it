import {Inject, Service} from 'typedi';

import {Document, FilterQuery, Model} from 'mongoose';
import {UniqueEntityID} from "../core/domain/UniqueEntityID";
import IOrderRepo from "../services/IRepos/IOrderRepo";
import {Order} from "../domain/order/order";
import {OrderMapper} from "../mappers/orderMapper";
import {IOrderPersistence} from "../dataschema/IOrderPersistence";

@Service()
export default class OrderRepo implements IOrderRepo {
    constructor(@Inject('orderSchema') private orderSchema: Model<IOrderPersistence & Document>) {
    }

    public async findById(orderId: string): Promise<Order> {
        const query = {id: orderId};
        const orderDocument = await this.orderSchema.findOne(query);
        if (orderDocument === null) return null;
        return OrderMapper.toDomain(orderDocument);
    }

    public async exists(order: Order): Promise<boolean> {
        const idX = order.id instanceof UniqueEntityID ? (<UniqueEntityID>order.id).toValue() : order.id;

        const query = {id: idX};
        const orderDocument = this.orderSchema.findOne(query as FilterQuery<IOrderPersistence & Document>);

        return !!orderDocument === true;
    }

    public async save(order: Order): Promise<Order> {
        const query = {id: order.id.toString()};
        const orderDocument = await this.orderSchema.findOne(query);

        try {
            if (orderDocument === null) {
                const rawItem: any = OrderMapper.toPersistence(order);

                const orderCreated = await this.orderSchema.create(rawItem);

                return OrderMapper.toDomain(orderCreated);
            } else {

                if (order.orderNote) {
                    orderDocument.orderNote = order.orderNote.text;
                } else {
                    orderDocument.orderNote = null;
                }

                if (order.payerName) {
                    orderDocument.payerName = order.payerName.value;
                } else {
                    orderDocument.payerName = null;
                }

                await orderDocument.save();
                return order;
            }
        } catch (err) {
            throw err;
        }
    }

    public async findAll(): Promise<Order[]> {
        // Aggregation pipeline that gets all orders and adds the field orderPrice by looking for the items of each order and summing their prices to get the total order price
        const orderRecords = await this.orderSchema.aggregate([
            {
                $lookup: {
                    from: 'items',
                    localField: 'id',
                    foreignField: 'orderId',
                    as: 'items'
                }
            },
            {
                $addFields: {
                    orderPrice: {
                        $reduce: {
                            input: "$items",
                            initialValue: 0,
                            in: {
                                $add: [
                                    "$$value",
                                    { $multiply: ["$$this.itemPrice", "$$this.itemUnitsQuantity"] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    orderPrice: { $round: ["$orderPrice", 2] }
                }
            }
        ]);

        const orders = orderRecords.map(OrderMapper.toDomain);
        return Promise.all(orders);
    }

    public async findLastOrderNumber(): Promise<number> {
        const orderRecord = await this.orderSchema.findOne().sort({orderNumber: -1});
        if (orderRecord != null) {
            return orderRecord.orderNumber;
        } else return 0;
    }

    public async findByResponsibleName(responsibleName: string): Promise<Order[]> {
        const query = {responsibleName: responsibleName};
        const orderRecords = await this.orderSchema.find(query);
        const orders = orderRecords.map(OrderMapper.toDomain);
        return Promise.all(orders);
    }

    public async delete(orderId: string): Promise<void> {
        await this.orderSchema.deleteOne({id: orderId});
    }
}
