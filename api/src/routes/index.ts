import { Router } from "express";
import ProductsRouter from "./products.route"
const routes = Router();


routes.use("/products", ProductsRouter);

export default routes;