import { Router } from 'express';
import { createProduct, getProducts, deleteProduct } from '../controllers/product.js';

const router = Router();

router.post('/add-product', createProduct);
router.get('/', getProducts);
router.delete('/delete-product/:id', deleteProduct)
// router.delete('/:id', deleteProduct);

export default router;