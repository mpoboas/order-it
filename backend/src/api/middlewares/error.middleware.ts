import { Request, Response } from 'express';
import { Utils} from "../../core/logic/Utils";

export const errorHandler = (error: any, request: Request, response: Response) => {

  if (error.name === 'ValidationError') {
    const err = {
      message: Utils.formatCelebrateErrorMessage(error.details[0].message),
    };
    return response
      .status(400)
      .send(err)
      .end();
  }

  const status = 500;
  const message = 'Internal Server Error';

  response.status(status).json({ message });
};
