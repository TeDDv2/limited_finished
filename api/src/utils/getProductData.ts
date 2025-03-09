import { Pool } from "pg";

export const getProductData = async (pool: Pool) => {
    try {
        const productsQuery = await pool.query('SELECT * FROM products');
        const sizesQuery = await pool.query('SELECT * FROM sizes');

        const data = {
            products: productsQuery.rows,
            sizes: sizesQuery.rows,
        };
        return data;
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
};