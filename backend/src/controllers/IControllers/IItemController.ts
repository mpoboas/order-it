import {Request, Response} from 'express';

export default interface IItemController {

    createItem(req: Request, res: Response): Promise<Response>;

    listItems(res: Response): Promise<Response>;

    editItem(req: Request, res: Response): Promise<Response>;

    listItemsByOrder(req: Request, res: Response): Promise<Response>;
}
