import express from "express"
import { createZone } from "../controllers/zone.controller.js"

const zoneRouter = express.Router() //criando um objeto para gerenciar as rotas de zone

zoneRouter.post("/", createZone)

export {zoneRouter}