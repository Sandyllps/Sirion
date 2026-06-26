import mongoose from "mongoose";

async function conectarMongoDB(){
    try{
        //URI de conxão local do Atlas
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexão com o MongoDB estabelecida.');
    } catch (error){
        console.error('Erro ao conectar no MongoDB: ', error);
    }
}

export {conectarMongoDB};