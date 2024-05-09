import { STOREDMESSAGES } from "../constants";
import { Message } from "../types";
import fs from 'fs';
import express from 'express';
import { validationResult } from 'express-validator';
import Filter from 'bad-words';

var chat: Message[] = JSON.parse(fs.readFileSync(STOREDMESSAGES, 'utf-8'));

const sendHandler = (req: express.Request, res: express.Response ) => {

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


    // writes the message to the file
    chat.push(message);

    fs.writeFile(STOREDMESSAGES, JSON.stringify(chat), (err) => {
        if (err) {
            res.status(500).send('Internal server error');
            return;
        }
    });
    
    res.send('Message sent successfully');
}

export { sendHandler, chat };
