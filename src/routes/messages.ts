import express from 'express';
import { chat } from "./send";

const messagesHandler = (_: express.Request, res: express.Response) => {
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(chat))
}

export { messagesHandler };
