import dotenv from 'dotenv';
import app from './app.js'
import { connectionToDB } from './db.js';
dotenv.config({
    path: './.env'
});

connectionToDB(process.env.DB_URL)

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));