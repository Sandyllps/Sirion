import { response } from "express";
import { mysqlPool } from "../models/mysql.js";



//req: Requisoção (o que vem do front)
//res: Resposta (o que o servidor envia de volta)
//essa função de login serve pra verificar se as informações enviadas pela página batem com o banco
//função de login do usuário
async function login(req, res){
    try{
        const email = req.body.email //a requisição de login precisa receber no body email e senha.
        const senha = req.body.senha

        //mysqlPool.execute() envia a querySQL para o banco.
        const resposta = await mysqlPool.execute('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ? and senha_hash = ?', [email, senha]);
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


//função de cadastro do usuário
async function signUp(req, res){
    const { nome, email, senha } = req.body;

    if(nome == "" || email == "" || senha == ""){
        return res.status(400).json({resposta: 'Preencha todos os campos!'});
    }


    try{
        //aqui estou tentando inserir o cadastro na tabela. Se email já existir, será lançado um erro de Unique.
        const result = await mysqlPool.execute('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)', [nome, email, senha]);
        return res.status(201).json({resposta: 'Cadastro criado com sucesso :D',
            id: result.lastID //
        });
    } catch(erro){
        if(erro.message.includes('UNIQUE')) { //Acessando a mensagem do objeto erro e perguntando se ela contém a palavra UNIQUE
            return res.status(400).json({
                resposta: 'Este e-mail já está cadastrado. Faça login para começar'
            });
        }
        console.error(erro);
        return res.status(500).json({resposta: 'Erro no servidor :('});
    }
}


export {login}
export {signUp}



