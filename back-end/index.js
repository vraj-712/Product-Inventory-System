import dotenv from 'dotenv';
import app from './app.js'
import { connectionToDB } from './db.js';
dotenv.config({
    path: './.env'
});

connectionToDB()
.then(() => console.log('Connected to the database'))
.catch((error) => console.error('Failed to connect to the database:', error));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));