import {Router} from 'express';
import {celebrate, Joi} from 'celebrate';
import {Container} from 'typedi';

import config from '../../../config';
import IOrderController from "../../controllers/IControllers/IOrderController";

const route = Router();

export default (app: Router) => {
    app.use('/Orders', route);

    const ctrl = Container.get(config.controllers.order.name) as IOrderController;

    route.post(
        '',
        celebrate({
            body: Joi.object({
                responsibleName: Joi.string().required(),
                orderNote: Joi.string().allow(null).allow(''),
            }),
        }),
        (req, res) => ctrl.createOrder(req, res),
    );


    route.get(
        '',
        (req, res) => ctrl.listOrders(res),
    );

    route.patch(
        '/:id',
        celebrate({
            body: Joi.object({
                payerName: Joi.string().allow(null).allow(''),
                orderNote: Joi.string().allow(null).allow(''),
            }),
        }),
        (req, res) => ctrl.editOrder(req, res),
    );
};
