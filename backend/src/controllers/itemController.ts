import {Request, Response} from 'express';
import {Inject, Service} from 'typedi';
import config from '../../config';

import {FailureType, Result} from '../core/logic/Result';
import {Utils} from '../core/logic/Utils';
import IItemController from "./IControllers/IItemController";
import IItemService from "../services/IServices/IItemService";
import ItemOutDto from "../dto/out/ItemOutDto";
import ItemCreateDto from "../dto/create/ItemCreateDto";
import ItemEditDto from "../dto/edit/ItemEditDto";

@Service()
export default class ItemController implements IItemController {
    constructor(@Inject(config.services.item.name) private itemServiceInstance: IItemService) {
    }

    public async createItem(req: Request, res: Response) {
        // Call the service to create a new item.
        const itemOrError =
            (await this.itemServiceInstance.createItem(req.body as ItemCreateDto)) as Result<ItemOutDto>;

        // Handle any errors from the service.
        if (itemOrError.isFailure) {
            return this.returnError(itemOrError, res);
        }

        // If the service succeeds, return the created item.
        const itemDto = itemOrError.getValue();
        return res.status(201).json(itemDto);
    }

    public async listItems(res: Response) {
        // Call the service to list all items.
        const items = await this.itemServiceInstance.listItems();

        // If the request succeeds, return the items.
        return res.json(items).status(200);
    }

    public async listItemsByOrder(req: Request, res: Response) {
        // Call the service to list all order items.
        const orderItems = await this.itemServiceInstance.listItemsByOrder(req.params.id);

        // If the request succeeds, return the order items.
        return res.json(orderItems).status(200);
    }

    public async editItem(req: Request, res: Response) {
        // Call the service to edit an item.
        const itemOrError = (await this.itemServiceInstance.editItem(
            req.params.id,
            req.body as ItemEditDto,
        )) as Result<ItemOutDto>;

        // Handle any errors from the service.
        if (itemOrError.isFailure) {
            return this.returnError(itemOrError, res);
        }

        // If the service succeeds, return the edited item.
        const itemDto = itemOrError.getValue();
        return res.status(200).json(itemDto);
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
