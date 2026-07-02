//Definições dos pinos conforme o circuito montado
#define SENSOR_VAZAO_PINO      32  // Potenciômetro redondo azul  (S_VZ_01)
#define SENSOR_UMIDADE_1_PINO  34  // Primeiro Sensor de cima (S_UM_01)
#define SENSOR_UMIDADE_2_PINO  35  // Segundo Sensor de baixo (S_UM_02)
#define BOMBA_PINO             23  // LED Vermelho (Atuador)

// Variáveis globais para a interrupção da bomba caso não haja fluxo passando pelo sensor de vazão
volatile int contador_pulsos = 0;
unsigned long tempo_bomba_ligou = 0;
bool bomba_ligada = false;
bool sistema_bloqueado_por_falha = false;

// Variáveis para medição de litros (Requisito funcional 3: medição de consumo em cada irrigação)
float volume_total_rega = 0.0; // Guarda o total de litros acumulados na irirgação atual

//Variável para o cronometros de umidade e vazão
unsigned long ultimo_tempo_ciclo = 0;


//Função de interrupção (roda a cada pulso do sensor de vazão)
//O nome dessa variável significa Internal RAM Attribute.
//O ESP guarda o codigo do programa em uma memória mais lenta chamada flash,
//Mas interrupções precisam ser executadas na velocidade da luz,
//então, estou exigindo que o ESP guarde essa função específica dentro da memória RAM
//interna, que é a mais rápida.
void IRAM_ATTR contarPulso(){ 
  contador_pulsos++;
}


void setup() {
  //Inicializa a tela de texto (Monitor Serial)
  Serial.begin(115200);
  Serial.println("--- SIRION: Sistema de Irrigação Inicializado ---");

  // Configura os pinos dos sensores para enviar dados para o ESP32
  pinMode(SENSOR_UMIDADE_1_PINO, INPUT);
  pinMode(SENSOR_UMIDADE_2_PINO, INPUT);

  // Configura o pino do LED da bomba para receber ordens do ESP32
  pinMode(BOMBA_PINO, OUTPUT);

  // Garante que a bomba comece DESLIGADA (LED apagado)
  digitalWrite(BOMBA_PINO, LOW);

  pinMode(SENSOR_VAZAO_PINO, INPUT_PULLUP); //PULLUP ativa o sensor interno de proteção para ruídos elétricos do ar.
  attachInterrupt(digitalPinToInterrupt(SENSOR_VAZAO_PINO), contarPulso, RISING);
}


void loop() {
  if(sistema_bloqueado_por_falha){
    Serial.println("ALERTA!: SISTEMA BLOQUEADO. Bomba protegida contra funcionamento a seco.");
    digitalWrite(BOMBA_PINO, LOW);
    delay(5000);
    return;
  }

  unsigned long tempo_atual = millis();

  //CRONÔMETRO 1: LEITURA E CONTROLE DE UMIDADE  E VAZÃO DE ÁGUA
  if(tempo_atual - ultimo_tempo_ciclo >= 1000 || ultimo_tempo_ciclo == 0){
    ultimo_tempo_ciclo = tempo_atual; //Reseta o cronômetro da umidade

    // Aqui lê-se o sinal elétrico bruto dos dois sensores de umidade (retorna um número de 0 a 4095)
    int leitura_sensor_1 = analogRead(SENSOR_UMIDADE_1_PINO);
    int leitura_sensor_2 = analogRead(SENSOR_UMIDADE_2_PINO);

    //Envia os valores capturados para o monitor serial
    int umidade_porcentagem_1 = map(leitura_sensor_1, 0, 4095, 0, 100);
    int umidade_porcentagem_2 = map(leitura_sensor_2, 0, 4095, 0, 100);

    //
    int umidade_media = (umidade_porcentagem_1 + umidade_porcentagem_2) / 2;

    //
    Serial.print("Sensor 1: ");
    Serial.print(umidade_porcentagem_1);
    Serial.print("%  |  Sensor 2: ");
    Serial.print((umidade_porcentagem_2));
    Serial.print("%  |  UMIDADE MÉDIA: ");
    Serial.print(umidade_media);
    Serial.println("%");

    //REGRA DE NEGÓCIO: Se a média de umidade for menor que 25%, liga a irrigação
    if (umidade_media < 25){
      if(!bomba_ligada){
        Serial.println("STATUS: Solo seco! Ligando a bomba d'água...");
        digitalWrite(BOMBA_PINO, HIGH); // Manda 3.3V para o pino 23 (Acende o LED)
        bomba_ligada = true;
        tempo_bomba_ligou = millis();
        contador_pulsos = 0;
        volume_total_rega = 0.0; // Zera o sensor de fluxo para inociar uma nova contagem nessa rega.
      }
    }
    //Se a média for 45% ou mais, desliga a irrigação
    else if (umidade_media >= 45){
      if(bomba_ligada){
        Serial.println(("STATUS: Solo com umidade adequeda, desligando a bomba..."));
        digitalWrite(BOMBA_PINO, LOW); //Corta a energia do pino 23 (Apaga o LED)
        bomba_ligada = false;

        // Exibe o resumo do consumo final quado a bomba desliga
        Serial.println("===============================================================");
        Serial.print("IRRIGAÇÃO CONCLUÍDA: Total de água consumida: ");
        Serial.print(volume_total_rega, 2); //Exibe com duas casas decimais
        Serial.println(" Litros.");
        Serial.println("===============================================================");

        //CHAMADA DA FUNÇÃO: Envia o relatório final assim que a rega acaba
        transmitirDadosSoftware(umidade_media, bomba_ligada, volume_total_rega);

      }
    }

    Serial.println("\n------------------------------------------------------------------");
    
  //MEDIÇÃO DE LITROS E PROTEÇÃO DRY-RUN (roda a cada 1 segundo SE a bomba estiver ligada) E CÁLCULOS DE LITROS
  if (bomba_ligada){

    // [MUNDO REAL]: Código original para o sensor de vazão físico YF-S201
    // (Deixado comentado apenas para não travar o simulador Wokwi)
    //Converte os pulsos acumulados no último segundo para litros (Fórmula do YF-S201)
    // 450 pulsos equivalem a 1 litro
    //float litros_neste_segundo = (float)contador_pulsos / 450.0;
    //volume_total_rega += litros_neste_segundo;//Soma ao volume total acumulado desta rega


    // [SIMULADOR WOKWI]: Emulação analógica para teste no potenciômetro azul (sensor de vazão)
    // (Quando for para o mundo real, desativaremos essas linhas e ativaremos as de cima)
    int leitura_vazao_simulada = analogRead(SENSOR_VAZAO_PINO);
    if(leitura_vazao_simulada > 500) {
      contador_pulsos = map(leitura_vazao_simulada, 500, 4095, 50, 450); 
    }

    float litros_neste_segundo = (float)contador_pulsos / 450.0;
    volume_total_rega += litros_neste_segundo;


    //Proteção Dry-Run (checa se após 5 segundos de bomba ligada o volume de água acumulado é zero)
    if (tempo_atual - tempo_bomba_ligou >= 5000){
      if(volume_total_rega == 0.0){
        sistema_bloqueado_por_falha = true;
        digitalWrite(BOMBA_PINO, LOW);
        bomba_ligada = false;
        Serial.println("\n----------------------------------------------------------");
        Serial.println("ERRO CRÍTICO DETECTADO: Sem fluxo de água por 5 segundos!");
        Serial.println("----------------------------------------------------------");
        return;
      }
    }

    //Exibe na tela o consumo parcial acumulado a cada ciclo
    //Comentei essas linhas pois estava printando os litros a cada segundo e não era essa a ideia
    //Serial.print("Consumo de água desta rega: ");
    //Serial.print(volume_total_rega, 2);
    //Serial.println(" Litros.");

    contador_pulsos = 0; //Zera o contador de pulsos para medir o próximo segundo isoladamente
  }

  // Envia a atualização periódica a cada segundo
    transmitirDadosSoftware(umidade_media, bomba_ligada, volume_total_rega);

    Serial.println("\n------------------------------------------------------------------");
  }
}

// FUNÇAÕ DE INTEGRAÇÃO DE SOFTWARE
// Esta função empacota os dados do hardware em formato String estruturada 
//simulando o envio para o backend em Node.js via Portal Serial
void transmitirDadosSoftware(int umidade, bool statusBomba, float consumoLitros){
  Serial.println("\n [INTEGRAÇÃO] TRANSMITINDO DADOS PARA A API NODE.JS...");

  //Montando uma string simulando um objeto JSON
  Serial.print("{");
  Serial.print("\"umidade_media\": "); Serial.print((umidade)); Serial.print(", ");
  Serial.print("\"bomba_ativa\": "); Serial.print(statusBomba ? "true" : "false"); Serial.print(", ");
  Serial.print("\"volume_litros\": "); Serial.print(consumoLitros, 2);
  Serial.println("}");

  Serial.println(" [INTEGRAÇÃO] DADOS ENVIADOS COM SUCESSO! \n");
}