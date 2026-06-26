import express from "express"
import {login} from "../controllers/auth.controller.js"
import { signUp } from "../controllers/auth.controller.js"

const authRouter = express.Router() //criando um objeto para gerenciar as rotas de auth

authRouter.post("/login", login)
authRouter.post("/signup", signUp)



export {authRouter}