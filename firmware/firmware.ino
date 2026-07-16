#include <WiFi.h>
#include <PubSubClient.h>
#include <cstring>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "credentials.h"

const int mqtt_port = 1883; // A porta TCP que configuramos no backend

int bombaLigada = 0;
bool modoAutomatico = true;

WiFiClient espClient;
PubSubClient client(espClient);

//variáveis globais para guardar os pinos já convertidos
// int pinoSensorVazaoInt = -1;
int pinoBombaInt = -1;

const int MAX_SENSORES_UMIDADE = 10; // ajuste se quiser suportar mais sensores
int pinosSensoresUmidade[MAX_SENSORES_UMIDADE];
int quantidadeSensoresUmidade = 0;

//o valor maximo e minimo da leitura vai depender do sensor utilizaodo
//pode ser que para uns sensores, mais umidade seja um valor mais baixo, e em outros casos, o cotrário
int leituraMinimaSensorUmidade = 4095;
int leituraMaximaSensorUmidade = 1200;

//valores de umidade configurados na API pra controlar a bomba
int umidadeMinimaConfigurada = 0;
int umidadeMaximaConfigurada = 100;

void fazerRequisicaoGET();
int converterLeituraUmidadeParaPorcentagem(int leituraBruta);
bool pinoPodeSerOutput(int pino);
int converterPinoParaInt(String pinoTexto);
// bool atualizarConsumo(uint32_t &pulsosLidos, float &mlCalculado);

// volatile uint32_t pulseCount = 0;
// float consumoML = 0.0;
//aproximadamente 5880 pulsos por litro
// const float ML_POR_PULSO = 1000.0 / 5880.0;

//quantidade mínima de pulsos em 5s para considerar que houve fluxo real
// const uint32_t LIMIAR_PULSOS_FLUXO = 8;

// void IRAM_ATTR flowISR()
// {
//     pulseCount++;
// }

//função para conectar ao wifi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando-se à rede Wi-Fi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    Serial.print(" Status: ");
    Serial.println(WiFi.status());
  }

  Serial.println("");
  Serial.println("WiFi conectado!");
  Serial.print("Endereço IP do ESP32: ");
  Serial.println(WiFi.localIP());
}

//função de callback (quando recebe mensagem)
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensagem recebida no tópico ");
  Serial.print(topic);
  Serial.print(": ");
  
  String mensagem = "";
  for (int i = 0; i < length; i++) {
    mensagem += (char)payload[i];
  }
  Serial.println(mensagem);

  //aqui colocarei depois a lógica para acender LED, ligar relé etc
  if(strcmp(topic, "sirion/jardim/switch") == 0){
    if (modoAutomatico) {
      Serial.println(
        "Comando manual ignorado: o sistema está no modo automático."
      );
      return;
    }

    if (!pinoPodeSerOutput(pinoBombaInt)) {
      Serial.println(
        "Erro: pino da bomba ainda não foi configurado corretamente."
      );
      return;
    }

    JsonDocument comandoBomba;

    DeserializationError erroComando =
      deserializeJson(comandoBomba, mensagem);

    if (erroComando) {
      Serial.print(
        "Erro ao interpretar o comando manual da bomba: "
      );
      Serial.println(erroComando.c_str());
      return;
    }

    const char* chaveComando =
      comandoBomba["chave_esp"] | "";

    const char* acaoComando =
      comandoBomba["acao"] | "";

    if (
      String(chaveComando) !=
      String(chave_esp)
    ) {
      Serial.println(
        "Comando ignorado: pertence a outro ESP32."
      );
      return;
    }

    if (strcmp(acaoComando, "ligar") == 0) {
      if (bombaLigada == 0) {
        digitalWrite(pinoBombaInt, HIGH);
        bombaLigada = 1;

        Serial.print(
          "Bomba ligada manualmente no pino "
        );
        Serial.println(pinoBombaInt);
      } else {
        Serial.println(
          "A bomba já estava ligada."
        );
      }

      return;
    }

    if (strcmp(acaoComando, "desligar") == 0) {
      if (bombaLigada == 1) {
        digitalWrite(pinoBombaInt, LOW);
        bombaLigada = 0;

        Serial.print(
          "Bomba desligada manualmente no pino "
        );
        Serial.println(pinoBombaInt);
      } else {
        Serial.println(
          "A bomba já estava desligada."
        );
      }

      return;
    }

    Serial.println(
      "Comando manual inválido. Use ligar ou desligar."
    );
  }

  if(strcmp(topic, "sirion/jardim/recarregar") == 0){
    Serial.println("Recebido comando para recarregar configuracoes do ESP32...");
    fazerRequisicaoGET();
  }
}

//TODO: deixar de enviar pro servidor valores de umidade aleatórios. No lugar disso, enviar o valor do pino de umidade (o valor que vem da API)
//TODO: em outra função, fazer o cálculo de média da umidade e mandar a instrução de ligar e desligar a bomba baseado nessa média e os valores limite min e max de umidade

//função pra reconectar ao Broker MQTT
void reconnect() {
  //aqio entra em loop até estar conectado
  while (!client.connected()) {
    Serial.print("Tentando conexão MQTT...");
    
    //cria um ID de cliente aleatório
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    //tenta conectar
    if (client.connect(clientId.c_str())) {
      Serial.println("Conectado ao Broker!");
      
      //assim que conecta, publica um aviso
      client.publish("sirion/status", "ESP32 conectado e online!");
      
      //assina/se inscreve em um tópico para ouvir comandos
      client.subscribe("sirion/comandos");
      client.subscribe("sirion/jardim/switch");
      client.subscribe("sirion/jardim/recarregar");

      //aqui vou chamara a função para pedir os dados do esp
      fazerRequisicaoGET();

    } else {
      Serial.print("Falhou, rc=");
      Serial.print(client.state());
      Serial.println(" Tentando novamente em 5 segundos...");
      delay(5000);
    }
  }
}

//função de conversão para os nomes exatos da placa esp
int converterPinoParaInt(String pinoTexto) {
  pinoTexto.trim();
  pinoTexto.toUpperCase();

  //lado esquerdo da placa
  if (pinoTexto == "SP")  return 36; // GPIO36
  if (pinoTexto == "SN")  return 39; // GPIO39
  if (pinoTexto == "G34") return 34;
  if (pinoTexto == "G35") return 35;
  if (pinoTexto == "G32") return 32;
  if (pinoTexto == "G33") return 33;
  if (pinoTexto == "G25") return 25;
  if (pinoTexto == "G26") return 26;
  if (pinoTexto == "G27") return 27;
  if (pinoTexto == "G14") return 14;
  if (pinoTexto == "G12") return 12;
  if (pinoTexto == "G13") return 13;
  if (pinoTexto == "SD2") return 9;
  if (pinoTexto == "SD3") return 10;
  if (pinoTexto == "CMD") return 11;

  //lado direito da placa
  if (pinoTexto == "G23") return 23;
  if (pinoTexto == "G22") return 22;
  if (pinoTexto == "TXD") return 1;
  if (pinoTexto == "RXD") return 3;
  if (pinoTexto == "G21") return 21;
  if (pinoTexto == "G19") return 19;
  if (pinoTexto == "G18") return 18;
  if (pinoTexto == "G5")  return 5;
  if (pinoTexto == "G17") return 17;
  if (pinoTexto == "G16") return 16;
  if (pinoTexto == "G4")  return 4;
  if (pinoTexto == "G0")  return 0;
  if (pinoTexto == "G2")  return 2;
  if (pinoTexto == "G15") return 15;
  if (pinoTexto == "SD1") return 8;
  if (pinoTexto == "SD0") return 7;
  if (pinoTexto == "CLK") return 6;

  //esses pinos não são utilizáveis
  if (pinoTexto == "3V3") return -10;
  if (pinoTexto == "EN")  return -11;
  if (pinoTexto == "GND") return -12;
  if (pinoTexto == "5V")  return -13;

  Serial.println("⚠️ AVISO: Pino não reconhecido na tradução -> " + pinoTexto);
  return -1;
}

//função auxiliar pra dizer se o pino pode ser usado como saída
bool pinoPodeSerOutput(int pino) {
  // pinos somente de entrada
  if (pino == 34 || pino == 35 || pino == 36 || pino == 39) return false;

  // pinos da flash/SD - melhor não usar
  if (pino == 6 || pino == 7 || pino == 8 || pino == 9 || pino == 10 || pino == 11) return false;

  // pinos inválidos retornados pela função
  if (pino < 0) return false;

  return true;
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  
  //informa o endereço do broker e a porta TCP
  client.setServer(mqtt_server, mqtt_port);
  
  //informa qual função será chamada quando chegar uma mensagem
  client.setCallback(callback);
}

//loop principal
void loop() {
  //aqui garantimos que a conexão com o broker está ativa
  if (!client.connected()) {
    reconnect();
  }

  //mantém a comunicação rodando em segundo plano
  client.loop();

  unsigned long now = millis();

  //ex.: publicar uma mensagem a cada 5 segundos
  static unsigned long lastMsg = 0;

  if (now - lastMsg > 5000) {
    lastMsg = now;

    if (quantidadeSensoresUmidade > 0) {
      long somaUmidade = 0;

      for (int i = 0; i < quantidadeSensoresUmidade; i++) {
        int leitura = analogRead(pinosSensoresUmidade[i]);

        int porcentagemUmidade =
          converterLeituraUmidadeParaPorcentagem(leitura);

        somaUmidade += porcentagemUmidade;

        Serial.print("Leitura do sensor de umidade no pino ");
        Serial.print(pinosSensoresUmidade[i]);
        Serial.print(": ");
        Serial.println(leitura);

        Serial.print("Leitura percentual: ");
        Serial.print(porcentagemUmidade);
        Serial.println("%");
      }

      int mediaUmidade =
        somaUmidade / quantidadeSensoresUmidade;

      //atualizarConsumo() apenas contabiliza os pulsos do sensor de vazão e soma no consumo total
      // uint32_t pulsosLidos = 0;
      // float mlNestaJanela = 0.0;
      // bool houveFluxo = atualizarConsumo(pulsosLidos, mlNestaJanela);

      // Serial.print("Pulsos do sensor de vazão nos últimos 5 segundos: ");
      // Serial.println(pulsosLidos);

      // Serial.print("Consumo nesta janela (mL): ");
      // Serial.println(mlNestaJanela);

      // Serial.print("Consumo acumulado (mL): ");
      // Serial.println(consumoML);

      // if (bombaLigada == 0) {
      //   Serial.println("Bomba desligada: pulsos de vazão foram ignorados.");
      // } else if (houveFluxo) {
      //   Serial.println("Fluxo de água detectado pelo sensor de vazão.");
      // } else {
      //   Serial.println("Pulsos insuficientes para considerar fluxo real de água.");
      // }

      if (modoAutomatico) {
        //aqui estamos usando a média de umidade para saber se precisamos ligar/desligar a bomba
        if (pinoPodeSerOutput(pinoBombaInt)) {

          if(mediaUmidade < umidadeMinimaConfigurada){

            if (bombaLigada == 0) {

              digitalWrite(pinoBombaInt, HIGH);
              bombaLigada = 1;

              Serial.println(
                "Bomba ligada automaticamente por baixa umidade."
              );
            }

          } else if(
            mediaUmidade >= umidadeMaximaConfigurada
          ){

            if (bombaLigada == 1) {

              digitalWrite(pinoBombaInt, LOW);
              bombaLigada = 0;

              Serial.println(
                "Bomba desligada automaticamente por umidade suficiente."
              );
            }
          }

        } else {

          Serial.println(
            "Erro: pino da bomba inválido para controle automático."
          );
        }
      }

      /*
       * Esta publicação precisa ficar dentro deste bloco,
       * porque utiliza mediaUmidade e o estado atual da bomba.
       */
      String payload = "{\"chave_esp\":\"";

      payload += chave_esp;
      payload += "\",\"umidade\":";
      payload += String(mediaUmidade);
      payload += ",\"bomba_ativa\":";
      payload += (
        bombaLigada == 1
          ? "true"
          : "false"
      );
      payload += "}";

      Serial.print("Média da umidade: ");
      Serial.println(mediaUmidade);

      Serial.print("Estado da bomba: ");
      Serial.println(
        bombaLigada == 1
          ? "Ligada"
          : "Desligada"
      );

      Serial.print("Publicando leitura do sensor: ");
      Serial.println(payload);

      bool publicacaoRealizada = client.publish(
        "sirion/jardim/umidade",
        payload.c_str()
      );

      if (!publicacaoRealizada) {
        Serial.println(
          "Erro: não foi possível publicar os dados no MQTT."
        );
      }

    } else {
      Serial.println(
        "Nenhum sensor de umidade configurado para leitura."
      );
    }
  }
}

void fazerRequisicaoGET() {
  //verifica se o Wi-Fi está conectado antes de tentar
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    //montando a url com as variáveis do credentials.h
    String serverPath = "http://";
    serverPath += mqtt_server;
    serverPath += ":8080/zone?chave_esp=";
    serverPath += chave_esp;
    
    //inicaindo a conexão
    http.begin(serverPath);
    
    //faz a requisição GET e salva o código HTTP de retorno (ex: 200 = OK)
    int httpResponseCode = http.GET(); 

    if (httpResponseCode > 0) {
      Serial.print("Reposta recebida. Código HTTP: ");
      Serial.println(httpResponseCode);
      
      //pega o corpo da resposta da API/o texto do JSON
      String payload = http.getString();

      Serial.println("Payload recebido da API: " + payload);
      
      //aqui prepara-se a memória pra processar o JSON 
      //O valor 1024 bytes geralmente é suficiente para respostas normais
      JsonDocument doc;
      
      //converte o texto cru para o objeto JsonDocument
      DeserializationError error = deserializeJson(doc, payload);

      if (error) {
        Serial.print("Falha ao analisar o JSON: ");
        Serial.println(error.c_str());
        http.end();
        return;
      }

      //aqui verifica se a lista veio vazia
      if (doc.size() == 0) {
        Serial.println("Aviso: O servidor não retornou nenhum dado (Chave incorreta ou banco vazio).");
        http.end();
        return;
      }

      //acessando os dados
      //a resposta é uma array contendo objetos 
      //pegando o objeto no índice 0 da array
      int id_usuario = doc[0]["id_usuario"]; 
      const char* nome = doc[0]["nome"];
      umidadeMinimaConfigurada = doc[0]["min_umidade"];
      umidadeMaximaConfigurada = doc[0]["max_umidade"];
      const char* modo_irrigacao =
        doc[0]["modo_irrigacao"] | "automatico";

      modoAutomatico =
        String(modo_irrigacao) != "manual";

      const char* pino_sensor_vazao = doc[0]["esp32"]["pino_sensor_vazao"];
      const char* pino_bomba = doc[0]["esp32"]["pino_bomba"];
      JsonArray sensores_umidade = doc[0]["esp32"]["sensores_umidade"];

      //printando os atributos extraídos
      Serial.println("Dados Extraídos do Objeto");
      Serial.print("ID do usuário: "); Serial.println(id_usuario);
      Serial.print("nome: "); Serial.println(nome);
      Serial.print("Umidade mínima: "); Serial.println(umidadeMinimaConfigurada);
      Serial.print("Umidade máxima: "); Serial.println(umidadeMaximaConfigurada);
      Serial.print("Modo de irrigação: ");
      Serial.println(
        modoAutomatico
          ? "Automatico"
          : "Manual"
      );
      Serial.print("Pino do sensor de vazão: "); Serial.println(pino_sensor_vazao);
      Serial.print("Pino da bomba: "); Serial.println(pino_bomba);
      Serial.println("Pinos dos sensores de umidade: ");
      for(int i=0; i<sensores_umidade.size(); i++){
        const char* pino = sensores_umidade[i]["pino"];
        Serial.println(pino);
      }

      // pinoSensorVazaoInt = converterPinoParaInt(String(pino_sensor_vazao));

      // if (pinoSensorVazaoInt < 0) {
      //   Serial.println("Erro: pino do sensor de vazão inválido ou não utilizável.");
      // } else {
      //   Serial.print("Pino do sensor de vazão convertido para inteiro: ");
      //   Serial.println(pinoSensorVazaoInt);

      //   pinMode(pinoSensorVazaoInt, INPUT_PULLUP);

      //   detachInterrupt(digitalPinToInterrupt(pinoSensorVazaoInt));
      //   attachInterrupt(
      //       digitalPinToInterrupt(pinoSensorVazaoInt),
      //       flowISR,
      //       FALLING
      //   );
      // }

      pinoBombaInt = converterPinoParaInt(String(pino_bomba));

      if (pinoBombaInt < 0) {
        Serial.println("Erro: pino da bomba inválido ou não utilizável.");
      } else {
        Serial.print("Pino da bomba convertido para inteiro: ");
        Serial.println(pinoBombaInt);
      }

      quantidadeSensoresUmidade = 0;

      for (int i = 0; i < sensores_umidade.size() && i < MAX_SENSORES_UMIDADE; i++) {
        const char* pinoTexto = sensores_umidade[i]["pino"];
        int pinoConvertido = converterPinoParaInt(String(pinoTexto));

        if (pinoConvertido < 0) {
          Serial.print("Erro: pino de sensor de umidade inválido -> ");
          Serial.println(pinoTexto);
        } else {
          pinosSensoresUmidade[quantidadeSensoresUmidade] = pinoConvertido;
          quantidadeSensoresUmidade++;

          Serial.print("Pino de sensor de umidade convertido: ");
          Serial.print(pinoTexto);
          Serial.print(" -> ");
          Serial.println(pinoConvertido);
        }
      }

      //nicializado:
      //o pino de vazão como entrada (input)
      //o pino da bomba como saída (output)
      //os pinos de umidade como entrada (input)
      // if (pinoSensorVazaoInt >= 0) {
      //   Serial.println("Pino do sensor de vazão inicializado como INPUT_PULLUP.");
      // }

      if (pinoPodeSerOutput(pinoBombaInt)) {
        pinMode(pinoBombaInt, OUTPUT);
        digitalWrite(pinoBombaInt, LOW);
        bombaLigada = 0;
        Serial.println("Pino da bomba inicializado como OUTPUT.");
      } else {
        Serial.println("Erro: o pino da bomba não pode ser usado como OUTPUT.");
      }

      for (int i = 0; i < quantidadeSensoresUmidade; i++) {
        pinMode(pinosSensoresUmidade[i], INPUT);
      }
      Serial.println("Pinos dos sensores de umidade inicializados como INPUT.");

      //faznedo o cálculo de média da umidade e mandando a instrução de ligar e desligar a bomba baseado nessa média e os valores limite min e max de umidade 
    } else {
      Serial.print("Erro na requisição GET. Código do erro: ");
      Serial.println(httpResponseCode);
    }
    
    //Encerra a conexão pra liberar os recursos do ESP32
    http.end();
    
  } else {
    Serial.println("Wi-Fi desconectado. Impossível fazer o GET.");
  }
}

int converterLeituraUmidadeParaPorcentagem(int leituraBruta) {
  //evita divisão por zero caso os dois valores globais sejam iguais
  if (leituraMinimaSensorUmidade == leituraMaximaSensorUmidade) {
    Serial.println("Erro: leituraMinimaSensorUmidade e leituraMaximaSensorUmidade não podem ser iguais.");
    return 0;
  }

  int porcentagem = 0;

  //caso normal: o valor mínimo é menor que o valor máximo
  if (leituraMinimaSensorUmidade < leituraMaximaSensorUmidade) {
    porcentagem = map(
      leituraBruta,
      leituraMinimaSensorUmidade,
      leituraMaximaSensorUmidade,
      0,
      100
    );
  } 
  //caso invertido: o valor mínimo configurado é maior que o máximo configurado
  else {
    porcentagem = map(
      leituraBruta,
      leituraMinimaSensorUmidade,
      leituraMaximaSensorUmidade,
      0,
      100
    );
  }

  //garante que o valor fique entre 0 e 100
  if (porcentagem < 0) porcentagem = 0;
  if (porcentagem > 100) porcentagem = 100;

  return porcentagem;
}

// bool atualizarConsumo(uint32_t &pulsosLidos, float &mlCalculado){
//     noInterrupts();
//     uint32_t pulsos = pulseCount;
//     pulseCount = 0;
//     interrupts();

//     pulsosLidos = pulsos;
//     mlCalculado = 0.0;

//     //se a bomba estiver desligada, ignoramos qualquer pulso espúrio
//     if (bombaLigada == 0) {
//         return false;
//     }

//     //se a quantidade de pulsos for muito pequena, tratamos como ruído
//     if (pulsos < LIMIAR_PULSOS_FLUXO) {
//         return false;
//     }

//     float ml = pulsos * ML_POR_PULSO;
//     consumoML += ml;
//     mlCalculado = ml;

//     return true;
// }