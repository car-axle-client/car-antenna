import express from 'express';
import { chat } from "./send";

const messagesHandler = (_: express.Request, res: express.Response) => {
    res.send(chat)
}

export { messagesHandler };
