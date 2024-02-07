import {Request, Response} from 'express';

export default interface IOrderController {

    createOrder(req: Request, res: Response): Promise<Response>;

    listOrders(res: Response): Promise<Response>;

    editOrder(req: Request, res: Response): Promise<Response>;
}
