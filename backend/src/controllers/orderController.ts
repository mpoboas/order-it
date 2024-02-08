import {Request, Response} from 'express';
import {Inject, Service} from 'typedi';
import config from '../../config';

import {FailureType, Result} from '../core/logic/Result';
import {Utils} from '../core/logic/Utils';
import IOrderController from "./IControllers/IOrderController";
import IOrderService from "../services/IServices/IOrderService";
import OrderCreateDto from "../dto/create/OrderCreateDto";
import OrderOutDto from "../dto/out/OrderOutDto";
import OrderEditDto from "../dto/edit/OrderEditDto";

@Service()
export default class OrderController implements IOrderController {
    constructor(@Inject(config.services.order.name) private orderServiceInstance: IOrderService) {
    }

    public async createOrder(req: Request, res: Response) {
        // Call the service to create a new order.
        const orderOrError =
            (await this.orderServiceInstance.createOrder(req.body as OrderCreateDto)) as Result<OrderOutDto>;

        // Handle any errors from the service.
        if (orderOrError.isFailure) {
            return this.returnError(orderOrError, res);
        }

        // If the service succeeds, return the created order.
        const orderDto = orderOrError.getValue();
        return res.status(201).json(orderDto);
    }

    public async listOrders(res: Response) {
        // Call the service to list all orders.
        const orders = await this.orderServiceInstance.listOrders();

        // If the request succeeds, return the orders.
        return res.json(orders).status(200);
    }

    public async editOrder(req: Request, res: Response) {
        // Call the service to edit an order.
        const orderOrError = (await this.orderServiceInstance.editOrder(
            req.params.id,
            req.body as OrderEditDto,
        )) as Result<OrderOutDto>;

        // Handle any errors from the service.
        if (orderOrError.isFailure) {
            return this.returnError(orderOrError, res);
        }

        // If the service succeeds, return the edited building.
        const buildingDTO = orderOrError.getValue();
        return res.status(200).json(buildingDTO);
    }

    private returnError(result: Result<any>, res: Response) {
        const errorDto = Utils.convertToErrorDTO(result.errorValue());
        switch (result.failureType) {
            case FailureType.InvalidInput:
                return res.status(400).send(errorDto);
            case FailureType.EntityDoesNotExist:
                return res.status(404).send(errorDto);
            case FailureType.EntityAlreadyExists:
                return res.status(409).send(errorDto);
            case FailureType.DatabaseError:
                return res.status(503).send(errorDto);
        }
    }
}
