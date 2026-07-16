import express from "express"
import {
    createZone,
    getZone,
    editZone,
    deleteZone,
    controlarBombaManual
} from "../controllers/zone.controller.js"

const zoneRouter = express.Router() //criando um objeto para gerenciar as rotas de zone

zoneRouter.post("/", createZone)
zoneRouter.get("/", getZone)
zoneRouter.put(
    "/:id/bomba",
    controlarBombaManual
)
zoneRouter.put("/:id", editZone)
zoneRouter.delete("/:id", deleteZone)

export {zoneRouter}
