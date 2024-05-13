import express from 'express';
import { client } from './send';

const messagesHandler = (_: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');

    const collection = client.db('chat').collection('messages');
    collection.find().toArray().then(messages => {
        res.json(messages);
    });
}

export { messagesHandler };
