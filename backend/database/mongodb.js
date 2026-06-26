import mongoose from "mongoose";

async function conectarMongoDB(){
    try{
        //URI de conxão local do Atlas
        await mongoose.connect('mongodb://localhost:27017/sirion_db');
        console.log('Conexão com o MongoDB estabelecida.');
    } catch (error){
        console.error('Erro ao conectar no MongoDB: ', error);
    }
}

export {conectarMongoDB};