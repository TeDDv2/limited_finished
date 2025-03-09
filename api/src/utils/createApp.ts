import express, { Express, NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { database } from "./databaseListen";
import { initializePool } from "./db";
import routes from "../routes";

import { config } from "dotenv";
config()

export async function createApp(): Promise<{ app: Express, io: Server }> {
    const app = express();

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            methods: ["GET", "POST"]
        }
    });

    app.use(cors({
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }))

    app.use(express.json());

    app.use("/api", routes)

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({ message: 'Something went wrong!' });
    });

    const pool = initializePool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432'),
    });

    io.on('connection', (socket) => {
        console.log(socket.id);
    });


    await database(pool, io);

    return { app, io };
}

