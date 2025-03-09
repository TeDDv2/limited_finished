import { Router } from 'express';
import { getPool } from '../utils/db';
import { getProductData } from '../utils/getProductData';
const router = Router();

router.get('/', async (req, res) => {
    try {
        const pool = getPool();
        const data = await getProductData(pool);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

export default router;