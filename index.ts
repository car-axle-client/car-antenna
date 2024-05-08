import express from 'express';

import "./src/routes/send";
import "./src/routes/messages";
import { rateLimit } from 'express-rate-limit'
import { messagesHandler } from './src/routes/messages';
import { sendHandler } from './src/routes/send';
import { body } from 'express-validator';

const app = express();

const limiter = rateLimit({
	windowMs: 1000, // 15 minutes
	limit: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

app.use(limiter)
app.use(express.json());

app.get('/', (_, res) => {
  res.send('welcome to the backend, please use /chat to see the chat or /send to send a message');
});

app.get('/messages', messagesHandler)
app.post('/send',
         body("user").isAlphanumeric().notEmpty().trim().escape(),
         body("message").notEmpty().trim().escape().isLength({max: 100}),
         sendHandler)


app.listen(4200, () => {
    console.log('Server is running on http://localhost:4200');
});


export { app };