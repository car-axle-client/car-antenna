import { Message } from "../types";
import express from 'express';
import { validationResult } from 'express-validator';
import Filter from 'bad-words';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI || '');

connect().catch(console.error);

async function connect() {
    await client.connect();
}

async function insertMessage(message: Message) {
    const result = await client.db('chat').collection('messages').insertOne(message);
    console.log('Inserted message with id: ' + result.insertedId);
}

const sendHandler = (req: express.Request, res: express.Response ) => {
    res.setHeader('Content-Type', 'application/json');
    
    const valid = validationResult(req);

    if (!valid.isEmpty()) {
        res.status(400).send('Invalid message: ' + valid.array().map(e => e.msg).join(', '));
        return;
    }

    // checks if req.body is a valid Message
    let message: Message = req.body;
    if (!message.user || !message.message) {
        res.status(400).send('Invalid message');
        return;
    }

    let filter = new Filter();
    
    if (filter.isProfane(message.user)) {
        res.status(400).send('Invalid message');
        return;
    }

    message.message = filter.clean(message.message);

    insertMessage(message);

    
    res.send('Message sent successfully');
}

export { sendHandler, client };
