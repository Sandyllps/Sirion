import Zone from "../models/zone.model.js";

async function createZone(req, res) {
  // Desestruturando os dados principais que vêm do frontend/insomnia
  const { id_usuario, nome, min_umidade, max_umidade, esp32 } = req.body;

  //validação
  // Garantindo que os dados principais e o objeto esp32 foram enviados
  if (!id_usuario || !nome || !esp32) {
    return res.status(400).json({ 
      erro: 'Por favor, preencha os dados básicos e as configurações do ESP32.' 
    });
  }

  try {
    //inserção no banco de dados
    //passandoi os dados diretamente, a biblioteca Mongoose fará a validação interna 
    //com base no Schema para garantir que o formato do array está correto.
    const newZone = await Zone.create({
      id_usuario,
      nome,
      min_umidade,
      max_umidade,
      esp32
    });

    //Retorno de sucesso
    return res.status(201).json({
      mensagem: 'Configuração do jardim salva com sucesso!',
      dados: newZone 
    });

  } catch (erro) {
    console.error('Erro ao salvar no MongoDB:', erro);
    return res.status(500).json({ 
      erro: 'Falha interna ao salvar a configuração no banco de dados.' 
    });
  }
}

export {createZone};