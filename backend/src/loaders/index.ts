import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({expressApp}) => {
    const mongoConnection = await mongooseLoader();
    Logger.info('✌️ DB loaded and connected!');

    const orderSchema = {
        name: 'orderSchema',
        schema: '../persistence/schemas/orderSchema',
    };

    const itemSchema = {
        // compare with the approach followed in repos and services
        name: 'itemSchema',
        schema: '../persistence/schemas/itemSchema',
    };

    const orderController = {
        name: config.controllers.order.name,
        path: config.controllers.order.path,
    };

    const itemController = {
        name: config.controllers.item.name,
        path: config.controllers.item.path,
    };

    const orderRepo = {
        name: config.repos.order.name,
        path: config.repos.order.path,
    };

    const itemRepo = {
        name: config.repos.item.name,
        path: config.repos.item.path,
    };

    const orderService = {
        name: config.services.order.name,
        path: config.services.order.path,
    };

    const itemService = {
        name: config.services.item.name,
        path: config.services.item.path,
    };

    dependencyInjectorLoader({
        mongoConnection,
        schemas: [
            orderSchema,
            itemSchema,
        ],
        controllers: [
            orderController,
            itemController,
        ],
        repos: [
            orderRepo,
            itemRepo,
        ],
        services: [
            orderService,
            itemService,
        ],
    });
    Logger.info('✌️ Schemas, Controllers, Repositories & Services loaded');

    expressLoader({app: expressApp});
    Logger.info('✌️ Express loaded');
};
