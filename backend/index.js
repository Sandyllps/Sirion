import express from "express"; //express é um framework que simplifica o tratamento de requisições, rotas, e facilita a troca de info. entre a página e o servidor
import cors from "cors";
import 'dotenv/config'; //esse import carrega as vaariáveis do arquivo .env (nesse arquivo estão os dados do banco de dados).
import { authRouter } from "./routes/auth.route.js";
import { conectarMongoDB } from "./models/mongodb.js";
import { zoneRouter } from "./routes/zone.route.js";
import { dashboardRouter } from "./routes/dashboard.route.js";
import { iniciarBrokerMQTT } from "./broker_mqtt.js";



const app = express();

app.use(cors());
app.use(express.json()); //indicando pro meu servidor que vou trabalhar com JSON
app.use(express.static("public"))
app.use("/auth", authRouter);
app.use("/zone", zoneRouter);
app.use("/dashboard", dashboardRouter);

//Busca a porta  definida no arquivo .env
const port = process.env.PORT

//Dispara a conexão do mongoDB
conectarMongoDB();


//INICIALIZAÇÃO DO SERVIDOR
//Aquio servidor começa de fato a ouvir as chamadas que a página faz na porta definida
const server = app.listen(port, function(){
    console.log("Servidor Sirion rodando com sucesso!");
    console.log("Escutando em: http://localhost:"+ port);
    iniciarBrokerMQTT();
})

//Escutando eventos de erro na instância do servidor
server.on('error',
    /*Essa função que criei será executada quando acotecer um erro:*/(erro) =>{
    console.error("Erro: "+ erro)
})