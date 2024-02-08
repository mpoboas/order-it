import {Router} from 'express';
import {celebrate, Joi} from 'celebrate';
import {Container} from 'typedi';

import config from '../../../config';
import IItemController from "../../controllers/IControllers/IItemController";

const route = Router();

export default (app: Router) => {
    app.use('/Items', route);

    const ctrl = Container.get(config.controllers.item.name) as IItemController;

    route.post(
        '',
        celebrate({
            body: Joi.object({
                itemName: Joi.string().required(),
                itemBrandType: Joi.string().required().valid('MARCA_BRANCA', 'ORIGINAL'),
                itemUnitsQuantity: Joi.number().required(),
                orderId: Joi.string().required(),
            }),
        }),
        (req, res) => ctrl.createItem(req, res),
    );


    route.get(
        '',
        (req, res) => ctrl.listItems(res),
    );

    route.get(
        '/:id',
        (req, res) => ctrl.listItemsByOrder(req, res),
    );

    route.put(
        '/:id',
        celebrate({
            body: Joi.object({
                itemPrice: Joi.number().allow(null),
                itemName: Joi.string().allow(null),
                itemBrandType: Joi.string().allow(null).valid('MARCA_BRANCA', 'ORIGINAL'),
                itemUnitsQuantity: Joi.number().allow(null),
            }),
        }),
        (req, res) => ctrl.editItem(req, res),
    );
};
