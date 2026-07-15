import express from "express"
import {login, signUp, recuperarSenha} from "../controllers/auth.controller.js";

const authRouter = express.Router() //criando um objeto para gerenciar as rotas de auth

authRouter.post("/login", login)
authRouter.post("/signup", signUp)
authRouter.put("/recuperar-senha", recuperarSenha);


export {authRouter}