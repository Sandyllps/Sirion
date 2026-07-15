import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
  id_usuario: { 
    type: Number, 
    required: true 
  },
  nome: { 
    type: String, 
    required: true 
  },
  min_umidade: { 
    type: Number, 
    required: true 
  },
  max_umidade: { 
    type: Number, 
    required: true 
  },

  modo_irrigacao: {
    type: String,
    enum: ["automatico", "manual"],
    default: "automatico"
  },

  ultima_irrigacao: {
    type: Date,
    default: null
  },

  bomba_ativa: {
    type: Boolean,
    default: null
  },
  
  // Aqui começa o objeto aninhado
  esp32: {
    pino_sensor_vazao: { 
      type: String, 
      required: true 
    },
    pino_bomba: { 
      type: String, 
      required: true 
    },
    // Array de objetos para os sensores
    sensores_umidade: [{
      pino: {
        type: String,
        required: true 
      }
    }],
    chave_esp: {
      type: String, 
      required: true
    }
  }
},

{
  collection: 'zonas_irrigacao'
});

export default mongoose.model('Zone', zoneSchema);