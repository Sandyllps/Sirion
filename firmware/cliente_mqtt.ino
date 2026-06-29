#include <WiFi.h>
#include <PubSubClient.h>
#include <cstring> 


//configurações da rede wifi
const char* ssid = "";
const char* password = "";
int ligado = 0;


//Configurações do broker MQTT (o servidor node.js)
//aqui coloco o endereço IP IPv4 da máquina onde o servidor node está rodando.
const char* mqtt_server = "192.168.0.104"; 
const int mqtt_port = 1883; // A porta TCP que configuramos no backend

WiFiClient espClient;
PubSubClient client(espClient);


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
  Serial.print("Mensagem recebida no tópico [");
  Serial.print(topic);
  Serial.print("]: ");
  
  String mensagem = "";
  for (int i = 0; i < length; i++) {
    mensagem += (char)payload[i];
  }
  Serial.println(mensagem);

  //aqui colocarei depois a lógica para acender LED, ligar relé etc
  if(strcmp(topic, "sirion/jardim/switch") == 0){
    if(ligado == 0){
      digitalWrite(2, HIGH);
      ligado = 1;
    }else{
      digitalWrite(2,LOW);
      ligado = 0;
    }
  }
}


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

    } else {
      Serial.print("Falhou, rc=");
      Serial.print(client.state());
      Serial.println(" Tentando novamente em 5 segundos...");
      delay(5000);
    }
  }
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