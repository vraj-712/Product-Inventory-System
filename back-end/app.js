import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://product-inventory-system-one.vercel.app'], // Ensure no trailing slash
    credentials: true
}));
  
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

import productRoutes from './routes/product.js';
import categoryRoutes from './routes/category.js';

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

export default app;