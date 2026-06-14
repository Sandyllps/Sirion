# Sirion - Sistema de Irrigação Inteligente

O **Sirion** é um ecossistema de automação e manejo hídrico residencial, projetado para atender às necessidades de hortas de acordo com o solo e clima da região onde for instalado. 

Este repositório utiliza a arquitetura de **Monorepo**, concentrando todas as camadas do software em um único ambiente de desenvolvimento.



## Estrutura do Repositório

* **`firmware`**: Código-fonte desenvolvido em C++ para o microcontrolador ESP32. Gerencia a leitura dos sensores de umidade, medidor de vazão d'água por interrupção, proteção contra trabalho a seco (Dry-Run) e serialização de dados em formato JSON.
* **`backend`**: API desenvolvida em Node.js responsável por receber as leituras seriais/rede do ESP32, processar as regras de negócio de alto nível e persistir o histórico de regas.
* **`frontend`**: Dashboard Web interativo desenvolvido em HTML, CSS e JavaScript para exibição dos dados de umidade em tempo real e gráficos de consumo histórico de água.
* **`banco-dados`**: Scripts de modelagem e arquivos de configuração para os bancos de dados MongoDB (histórico de eventos e dispositivos) e MySQL (dados cadastrais).



## Como Executar o Módulo de Firmware

1. O circuito lógico de simulação foi construído na plataforma **Wokwi**.
2. O código contido em `firmware/firmware.ino` implementa:
   * Controle por **Histerese Adaptativa** (Ativa em < 25% e Desativa em >= 45% de umidade) focado nas características do Neossolo Regolítico local da região do Agreste Meridional.
   * **Interrupção de hardware** para cálculo de vazão em litros.
   * **Proteção Dry-Run** que desliga a bomba automaticamente após 5 segundos sem fluxo de água.
   * Transmissão de dados estruturada via objetos JSON.

---
**Discentes:** Sandy Lopes Silva e Ana Francisca Mendes dos Santos  
**Instituição:** Instituto Federal de Pernambuco (IFPE) — 2026.

