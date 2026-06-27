import Zone from "../models/zone.model.js";

//Funcão de criar zonas de irrigação
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


//Função de listar zonas de irigação
async function getZone(req, res){
    try{
        //além de mandar parametros no body, também podemos mandar paarâmetros query, onde, você manda parâmetros na url, no final da rota
        //Nesse caso, aqui mandaremos id_usuario como parametro na url
        //ex.: http://localhost:8080/zone?id_usuario=1
        const {id_usuario} = req.query;

        //se não foi mandado o id, bloqueia a requisição
        if(!id_usuario) {
            return res.status(400).json({
                erro: 'Acesso negado. O id do usuário é obrigatório para exibir as zonas.'
            });
        }

        //essa busca estrita vai no banco e traz apenas os documentos onde o id do usuario bate com o enviado.
        const zones = await Zone.find({id_usuario: id_usuario});

        return res.status(200).json(zones);
    }   catch(erro){
        console.error('Erro ao buscar zonas: ', erro);
        return res.status(500).json({erro: 'Falha ao buscar as zonas de irrigação.'});
    }
}


//Função de editar zonas
async function editZone(req, res){
    try{
        //pegando o id da zona que vem na url
        const {id} = req.params;

        //os dados novos vêm no corpo da requisição
        const dadosAtualizados = req.body;

        const zonaAtualizada = await Zone.findByIdAndUpdate(
            id,
            dadosAtualizados,
            {new: true} //Garante que o retorno seja o objeto já com os novos dados
        );

        if(!zonaAtualizada){
            return res.status(404).json({erro: 'Zona de irirgação não encontrada.'});
        }

        return res.status(200).json({
            mensagem: 'Zona atualizada com sucesso!',
            dados: zonaAtualizada
        });
    }   catch(erro){
        console.error('Erro ao editar zona: ', erro);
        return res.status(500).json({erro: 'Falha ao editar a zona de irrigação.'});
    }
}


//Função de excluir zonas específicas de irrigação
async function deleteZone(req, res){
  try {
    // Pegamos o ID da zona pela url
    const { id } = req.params;

    // Exclui usando o model Zone
    const zonaExcluida = await Zone.findByIdAndDelete(id);

    if (!zonaExcluida) {
      return res.status(404).json({ erro: 'Zona de irrigação não encontrada.' });
    }

    return res.status(200).json({ 
      mensagem: 'Zona de irrigação excluída com sucesso!' 
    });
  } catch (erro) {
    console.error('Erro ao excluir zona:', erro);
    return res.status(500).json({ erro: 'Falha ao excluir a zona de irrigação.' });
  }
}

export {createZone};
export {getZone};
export {editZone};
export {deleteZone};