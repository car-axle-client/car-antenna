import express from 'express';
import { client } from './send';

const messagesHandler = (_: express.Request, res: express.Response) => {
    res.header("Content-Type",'application/json');
    res.header("Access-Control-Allow-Origin", "*");

    const collection = client.db('chat').collection('messages');
    collection.find().toArray().then(messages => {
        res.json(messages);
    });
}

export { messagesHandler };
