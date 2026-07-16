import Zone from "../models/zone.model.js";
import {
    solicitarRecarregamentoConfiguracoes,
    enviarComandoBombaManual
} from "../broker_mqtt.js";

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


//Função de listar zonas de irrigação
async function getZone(req, res){ //esse getZone vai retornar tanto todas as zonas do usuario quanto uma zona específica dependendo do parâmetro query enviado na requisição. 
    try{
        //além de mandar parametros no body, também podemos mandar paarâmetros query, onde, você manda parâmetros na url, no final da rota
        //Nesse caso, aqui mandaremos id_usuario como parametro na url
        //ex.: http://localhost:8080/zone?id_usuario=1
        const {id_usuario, chave_esp} = req.query; //Se eu quiser retornar todaas as zonas do usuário, mando o id_usuario na url, se eu quiser listar uma zona específica, mando a chave_esp na url

        if(chave_esp && chave_esp != ""){ //s eesse if for verdadeiro, vamos buscar pela chave esp
          console.log("Usando chave esp: ", chave_esp);
          const zones = await Zone.find({"esp32.chave_esp": chave_esp});
          return res.status(200).json(zones);
        }

        if(id_usuario && id_usuario != "") {//se esse if for verdadeiro, vamos buscar pelo id_usuario
          console.log("Usando id_usuario: ", id_usuario);
          const zones = await Zone.find({id_usuario: id_usuario});
          return res.status(200).json(zones);
        }

        //se não foi mandado o id, bloqueia a requisição
        return res.status(400).json({
          erro: 'Acesso negado. O id_usuario ou chave_esp é obrigatório para exibir as zonas.'
        });

    }   catch(erro){
        console.error('Erro ao buscar zonas: ', erro);
        return res.status(500).json({erro: 'Falha ao buscar as zonas de irrigação.'});
    }
}


//Função de editar zonas
async function editZone(req, res) {
    try {
        const { id } = req.params;

        const dadosAtualizados = {
            ...req.body
        };

        /*
         * Não atualizamos o objeto esp32 inteiro.
         * Transformamos cada propriedade em um campo separado:
         *
         * esp32.pino_bomba
         * esp32.chave_esp
         * esp32.sensores_umidade
         *
         * Assim, um campo que não veio na requisição
         * não será apagado do banco.
         */
        if (dadosAtualizados.esp32) {
            const dadosEsp32 =
                dadosAtualizados.esp32;

            delete dadosAtualizados.esp32;

            Object.entries(dadosEsp32).forEach(
                ([campo, valor]) => {
                    if (valor !== undefined) {
                        dadosAtualizados[
                            `esp32.${campo}`
                        ] = valor;
                    }
                }
            );
        }

        const zonaAtualizada =
            await Zone.findByIdAndUpdate(
                id,
                {
                    $set: dadosAtualizados
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!zonaAtualizada) {
            return res.status(404).json({
                erro:
                    "Zona de irrigação não encontrada."
            });
        }

        if (
            Object.prototype.hasOwnProperty.call(
                req.body,
                "modo_irrigacao"
            )
        ) {
            solicitarRecarregamentoConfiguracoes();
        }

        return res.status(200).json({
            mensagem:
                "Zona atualizada com sucesso!",

            dados: zonaAtualizada
        });

    } catch (erro) {
        console.error(
            "Erro ao editar zona:",
            erro
        );

        return res.status(500).json({
            erro:
                "Falha ao editar a zona de irrigação."
        });
    }
}


async function controlarBombaManual(req, res) {
    try {
        const { id } = req.params;
        const { id_usuario } = req.query;
        const { acao } = req.body;

        if (
            acao !== "ligar" &&
            acao !== "desligar"
        ) {
            return res.status(400).json({
                erro:
                    'A ação deve ser "ligar" ou "desligar".'
            });
        }

        const zona = await Zone.findById(id);

        if (!zona) {
            return res.status(404).json({
                erro:
                    "Zona de irrigação não encontrada."
            });
        }

        if (
            id_usuario &&
            String(zona.id_usuario) !==
            String(id_usuario)
        ) {
            return res.status(403).json({
                erro:
                    "Esta zona não pertence ao usuário informado."
            });
        }

        if (
            zona.modo_irrigacao !== "manual"
        ) {
            return res.status(409).json({
                erro:
                    "A bomba só pode ser controlada diretamente no modo manual."
            });
        }

        const chaveESP =
            zona.esp32?.chave_esp;

        if (!chaveESP) {
            return res.status(400).json({
                erro:
                    "A zona não possui uma chave ESP32 válida."
            });
        }

        await enviarComandoBombaManual(
            chaveESP,
            acao
        );

        return res.status(200).json({
            mensagem:
                `Comando para ${acao} a bomba enviado com sucesso.`,
            acao
        });

    } catch (erro) {
        console.error(
            "Erro ao controlar a bomba manualmente:",
            erro
        );

        return res.status(500).json({
            erro:
                "Não foi possível enviar o comando manual para a bomba."
        });
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