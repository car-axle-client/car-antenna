import express from 'express';

import "./src/routes/send";
import "./src/routes/messages";
import { rateLimit } from 'express-rate-limit'
import { messagesHandler } from './src/routes/messages';
import { sendHandler } from './src/routes/send';
import { body } from 'express-validator';
import { PORT } from './src/constants';

const app = express();

const limiter = rateLimit({
	windowMs: 1000, 
	limit: 1, 
	standardHeaders: 'draft-7',
	legacyHeaders: false,
})

app.use(limiter)
app.use(express.json());

// there is no "/" on purpose due to making it difficult to block

app.get('/messages', messagesHandler)
app.post(
    '/send',
    body("user").isAlphanumeric().notEmpty().trim().escape(),
    body("message").notEmpty().trim().escape().isLength({max: 100}),
    sendHandler
)


app.listen(PORT, () => {
    console.log('Server is running on http://localhost:4200');
});


export { app };
