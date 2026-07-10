import mongoose from "mongoose";

const historicoUmidadeSchema = new mongoose.Schema({
  umidade: {
    type: Number,
    required: true
  },
  data_hora: {
    type: Date,
    default: Date.now
  },
  id_zona: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true
  },
},
{
  collection: "historico_umidade"
});

export default mongoose.model("HistoricoUmidade", historicoUmidadeSchema);