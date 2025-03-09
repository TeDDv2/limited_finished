import { Pool } from "pg";
import { Server } from "socket.io";
import { getProductData } from "./getProductData";

export const database = async (pool: Pool, io: Server) => {
    const client = await pool.connect();
    try {
        await client.query('LISTEN product_update');

        client.on('notification', async (msg) => {
            if (msg.channel === 'product_update') {
                const updatedData = await getProductData(pool);
                io.emit('update', updatedData);
            }
        });
    } catch (error) {
        console.error('Error in listenForChanges:', error);
    }
};