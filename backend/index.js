import express from "express" //express é um framework que simplifica o tratamento de requisições, rotas, e facilita a troca de info. entre a página e o servidor

import 'dotenv/config' //esse import carrega as vaariáveis do arquivo .env (nesse arquivo estão os dados do banco de dados).


const app = express() 


app.use(express.json()) //indicando pro meu servidor que vou trabalhar com JSON

//Busca a porta  definida no arquivo .env
const port = process.env.PORT

//INICIALIZAÇÃO DO SERVIDOR
//Aquio servidor começa efetivamente a "ouvir" as chamadas que a página faz na porta definida"
app.listen(port, function(){
    console.log("Servidor Sirion rodando com sucesso!");
    console.log("Escutando em: http://localhost:"+ port);
})