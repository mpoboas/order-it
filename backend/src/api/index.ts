import {Router} from 'express';
import {errorHandler} from './middlewares/error.middleware';
import ordersRoute from "./routes/ordersRoute";
import itemsRoute from "./routes/itemsRoute";

export default () => {
    const app = Router();

    ordersRoute(app);
    itemsRoute(app);
    app.use(errorHandler);

    return app;
};
