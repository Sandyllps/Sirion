import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", getDashboard);

export { dashboardRouter };