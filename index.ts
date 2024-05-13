import express from 'express';

import "./src/routes/send";
import "./src/routes/messages";
import { rateLimit } from 'express-rate-limit'
import { messagesHandler } from './src/routes/messages';
import { sendHandler } from './src/routes/send';
import { body } from 'express-validator';
import { PORT } from './src/constants';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();

var corsOptions = {
    // this is due to the frontend being able to used on every domainp
    origin: '*',
    optionsSuccessStatus: 200
}



const limiter = rateLimit({
	windowMs: 1000, 
	limit: 2, 
	standardHeaders: 'draft-7',
	legacyHeaders: false,
})

app.use(limiter)
app.use(express.json());
app.use(cors(corsOptions));

// there is no "/" on purpose due to making it difficult to block

app.get('/messages', cors(corsOptions),messagesHandler)
app.post(
    '/send',
    cors(corsOptions),
    body("user").isAlphanumeric().notEmpty().trim().escape(),
    body("message").notEmpty().trim().escape().isLength({max: 100}),
    sendHandler
)


app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});


export { app };
