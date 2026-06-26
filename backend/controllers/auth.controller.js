import { response } from "express";
import { mysqlPool } from "../database/mysql.js";



//req: Requisoção (o que vem do front)
//res: Resposta (o que o servidor envia de volta)
//essa função de login serve pra verificar se as informações enviadas pela página batem com o banco
async function login(req, res){
    try{
        const email = req.body.email //a requisição de login precisa receber no body email e senha.
        const senha = req.body.senha

        //mysqlPool.execute() envia a querySQL para o banco.
        const resposta = await mysqlPool.execute('SELECT Id, nome, email, senha_hash FROM usuarios WHERE email = ? and senha_hash = ?', [email, senha]);
        const linhas = resposta[0]

        if(!linhas[0]){ //Se na posição [0] do array não tiver resposta com esse usuario e senha, retorna "usuario inválido".
            return res.status(401).json({
                response: "Usuário inválido"
            })
        }

        //Se chegar a essa parte, é porque email e senha do usuario coincidiram com os dados do banco de dados.
        return res.status(200).json({
            response:"OK",
            "id": linhas[0].id,
            "nome": linhas[0].nome,
            "email": linhas[0].email
        })
    }
    catch(erro_login){
        console.error("O erro é esse aqui: ", erro_login)
        return res.status(500).json({
            response:"Erro interno :("
        })
    }
}

export {login}