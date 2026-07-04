#include <WiFi.h>;
#include <PubSubClient.h>;
#include <cstring>;
#include <HTTPClient.h>;
#include <ArduinoJson.h>;
#include "credentials.h";


const int mqtt_port = 1883; // A porta TCP que configuramos no backend


int ligado = 0;


WiFiClient espClient;
PubSubClient client(espClient);

//variáveis globais para guardar os pinos já convertidos
int pinoSensorVazaoInt = -1;
int pinoBombaInt = -1;

const int MAX_SENSORES_UMIDADE = 10; // ajuste se quiser suportar mais sensores
int pinosSensoresUmidade[MAX_SENSORES_UMIDADE];
int quantidadeSensoresUmidade = 0;


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
    if (!pinoPodeSerOutput(pinoBombaInt)) {
      Serial.println("Erro: pino da bomba ainda não foi configurado corretamente.");
      return;
    }

    if(ligado == 0){
      digitalWrite(pinoBombaInt, HIGH);
      ligado = 1;
      Serial.print("Bomba/Led ligada no pino ");
      Serial.println(pinoBombaInt);
    }else{
      digitalWrite(pinoBombaInt,LOW);
      ligado = 0;
      Serial.print("Bomba/Led desligada no pino ");
      Serial.println(pinoBombaInt);
    }
  }
}


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
  pinMode(2, OUTPUT);
  
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

  //ex.: publicar uma mensagem a cada 5 segundos
  static unsigned long lastMsg = 0;
  unsigned long now = millis();
  
  if (now - lastMsg > 5000) {
    lastMsg = now;
    
    //a lógica pra ler um sensor iria aqui. Exemplo de mentira:
    int valorSensor = random(10, 50); 
    String payload = String(valorSensor);
    
    Serial.print("Publicando leitura do sensor: ");
    Serial.println(payload);
    
    client.publish("sirion/jardim/umidade", payload.c_str());
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
      int min_umidade = doc[0]["min_umidade"];
      int max_umidade = doc[0]["max_umidade"];
      const char* pino_sensor_vazao = doc[0]["esp32"]["pino_sensor_vazao"];
      const char* pino_bomba = doc[0]["esp32"]["pino_bomba"];
      JsonArray sensores_umidade = doc[0]["esp32"]["sensores_umidade"];

      //printando os atributos extraídos
      Serial.println("Dados Extraídos do Objeto");
      Serial.print("ID do usuário: "); Serial.println(id_usuario);
      Serial.print("nome: "); Serial.println(nome);
      Serial.print("Umidade mínima: "); Serial.println(min_umidade);
      Serial.print("Umidade máxima: "); Serial.println(max_umidade);
      Serial.print("Pino do sensor de vazão: "); Serial.println(pino_sensor_vazao);
      Serial.print("Pino da bomba: "); Serial.println(pino_bomba);
      Serial.println("Pinos dos sensores de umidade: ");
      for(int i=0; i<sensores_umidade.size(); i++){
        const char* pino = sensores_umidade[i]["pino"];
        Serial.println(pino);
      }


      pinoSensorVazaoInt = converterPinoParaInt(String(pino_sensor_vazao));

      if (pinoSensorVazaoInt < 0) {
        Serial.println("Erro: pino do sensor de vazão inválido ou não utilizável.");
      } else {
        Serial.print("Pino do sensor de vazão convertido para inteiro: ");
        Serial.println(pinoSensorVazaoInt);
      }

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
      if (pinoSensorVazaoInt >= 0) {
        pinMode(pinoSensorVazaoInt, INPUT);
        Serial.println("Pino do sensor de vazão inicializado como INPUT.");
      }

      if (pinoPodeSerOutput(pinoBombaInt)) {
        pinMode(pinoBombaInt, OUTPUT);
        digitalWrite(pinoBombaInt, LOW);
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