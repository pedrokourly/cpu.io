# 📊 Dashboard de Monitoramento de Sistemas em Tempo Real

![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Sistema de observabilidade simulado para monitoramento de métricas de servidores em tempo real, desenvolvido como parte da **Atividade Prática 05** do curso.

## 🎬 Demonstração

![Dashboard em Ação](./demo.gif)

> **Nota:** Adicione seu GIF de demonstração na raiz do projeto com o nome `demo.gif` ou atualize o caminho acima.

## 📋 Descrição

Dashboard web que simula o monitoramento de servidores apresentando métricas de desempenho que se atualizam automaticamente sem necessidade de recarregar a página. O sistema suporta múltiplos usuários conectados visualizando os mesmos dados simultaneamente através de comunicação bidirecional com Socket.io.

## ✨ Funcionalidades

### 🎯 Geração de Métricas (Backend)
- **Métricas monitoradas:**
  - 💻 Utilização de CPU (%)
  - 🧠 Utilização de Memória RAM (%)
  - ⚡ Número de requisições por segundo
  - ⏱️ Tempo de resposta médio (ms)
- Geração contínua e automática em intervalos regulares (2 segundos)
- Valores que variam de forma realista simulando carga real de servidor

### 📊 Visualização em Tempo Real (Frontend)
- Gráficos dinâmicos com atualização automática usando **Chart.js**
- Exibição de valores atuais destacados em cards individuais
- Barras de progresso com indicadores visuais de status
- Interface responsiva e moderna com design dark mode
- 4 gráficos de linha mostrando histórico das métricas

### 🚨 Sistema de Alertas
- Limites (thresholds) configurados para cada métrica:
  - **CPU:** Warning 70%, Critical 85%
  - **Memória:** Warning 75%, Critical 90%
  - **Requisições:** Warning 300, Critical 450
  - **Tempo de Resposta:** Warning 500ms, Critical 700ms
- Alertas visuais diferenciados por severidade (Warning/Critical)
- Notificações instantâneas na interface
- Histórico dos últimos 20 alertas

### 📝 Streaming de Logs
- Geração simulada de logs do sistema
- Três tipos de logs diferenciados visualmente:
  - 🔵 **INFO** - Operações normais (70%)
  - 🟡 **WARNING** - Avisos (20%)
  - 🔴 **ERROR** - Erros (10%)
- Exibição em tempo real com scroll automático
- Limite de 100 logs mantidos em memória
- Botão para limpar logs

### 👥 Suporte a Múltiplos Usuários
- Todos os usuários visualizam os mesmos dados simultaneamente
- Contador de usuários online em tempo real
- Sincronização automática entre clientes

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web minimalista
- **Socket.io** - Comunicação bidirecional em tempo real

### Frontend
- **HTML5** - Estrutura da aplicação
- **CSS3** - Estilização moderna e responsiva
- **JavaScript (ES6+)** - Lógica da aplicação
- **Chart.js** - Biblioteca de gráficos
- **Socket.io Client** - Cliente WebSocket

## 📁 Estrutura do Projeto

```
cpu.io/
├── server/
│   ├── index.js              # Servidor principal Express + Socket.io
│   ├── metricsGenerator.js   # Gerador de métricas simuladas
│   ├── logsGenerator.js      # Gerador de logs do sistema
│   └── alertSystem.js        # Sistema de verificação e alertas
├── public/
│   ├── index.html            # Interface principal do dashboard
│   ├── css/
│   │   └── style.css         # Estilos da aplicação
│   └── js/
│       └── app.js            # Lógica do cliente (Socket.io + Chart.js)
├── package.json              # Dependências e scripts
├── .gitignore               # Arquivos ignorados pelo Git
└── README.md                # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** versão 14 ou superior
- **npm** (gerenciador de pacotes do Node.js)

### Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd cpu.io
```

2. **Instale as dependências:**
```bash
npm install
```

### Execução

**Modo de produção:**
```bash
npm start
```

**Modo de desenvolvimento (com auto-reload):**
```bash
npm run dev
```

O servidor iniciará na porta **3000** por padrão.

### Acessando a aplicação

Abra seu navegador e acesse:
```
http://localhost:3000
```

Para testar múltiplos usuários, abra várias abas ou janelas do navegador com a mesma URL.

## 🎨 Interface do Dashboard

### Seções Principais

1. **Header**
   - Título da aplicação
   - Status da conexão (conectado/desconectado)
   - Contador de usuários online

2. **Métricas Principais** (4 cards)
   - Valor atual da métrica
   - Barra de progresso visual
   - Status (Normal/Warning/Critical)
   - Ícone representativo

3. **Gráficos** (4 gráficos de linha)
   - CPU Usage Over Time
   - Memory Usage Over Time
   - Requests/sec Over Time
   - Response Time Over Time

4. **Painel de Alertas**
   - Alertas recentes com severidade
   - Timestamp de cada alerta
   - Contador total de alertas

5. **Painel de Logs**
   - Stream de logs em tempo real
   - Diferenciação por tipo (info/warning/error)
   - Botão para limpar logs

## 🔧 Configuração

### Modificar porta do servidor

Edite o arquivo `server/index.js`:
```javascript
const PORT = process.env.PORT || 3000; // Altere para porta desejada
```

Ou defina variável de ambiente:
```bash
PORT=8080 npm start
```

### Ajustar intervalos de atualização

No arquivo `server/index.js`:
```javascript
// Intervalo de métricas (padrão: 2000ms = 2 segundos)
setInterval(() => {
  // ...
}, 2000); // Altere este valor

// Intervalo de logs (padrão: 1-3 segundos aleatório)
const nextInterval = 1000 + Math.random() * 2000; // Ajuste aqui
```

### Modificar thresholds de alertas

Edite o arquivo `server/alertSystem.js`:
```javascript
this.thresholds = {
  cpu: { warning: 70, critical: 85 },
  memory: { warning: 75, critical: 90 },
  requests: { warning: 300, critical: 450 },
  responseTime: { warning: 500, critical: 700 }
};
```

## 📊 Eventos Socket.io

### Servidor → Cliente
- `metrics-update` - Emite novas métricas a cada 2 segundos
- `alert` - Emite alerta quando threshold é ultrapassado
- `alert-history` - Envia histórico de alertas ao conectar
- `thresholds` - Envia configurações de limites ao conectar
- `log` - Emite novo log do sistema
- `users-count` - Atualiza número de usuários conectados

### Cliente → Servidor
- `disconnect` - Notifica desconexão do cliente
- `simulate-spike` - Permite simulação manual de pico de uso

## 🎯 Detalhes de Implementação

### Geração de Métricas
- Algoritmo de variação suave para simular comportamento realista
- Valores não saltam bruscamente, mudando gradualmente
- Limites configurados para cada métrica
- Método `simulateSpike()` disponível para testes

### Sistema de Alertas
- Verificação automática em cada atualização de métricas
- Diferenciação entre níveis de severidade (Warning/Critical)
- Histórico mantido em memória (últimos 20 alertas)
- Mensagens descritivas e timestamped

### Logs
- Templates variados para cada tipo de log
- Dados aleatórios realistas (IPs, usuários, endpoints)
- Probabilidades: 70% info, 20% warning, 10% error
- Timestamp preciso para cada entrada

### Performance
- Gráficos limitados a 20 pontos de dados
- Animações otimizadas (mode: 'none' no Chart.js)
- Histórico limitado para evitar uso excessivo de memória
- Scroll automático inteligente nos logs

## 🧪 Testando a Aplicação

### Teste de múltiplos usuários
1. Abra o dashboard em múltiplas abas/janelas
2. Observe que todas veem os mesmos dados
3. Verifique o contador de usuários online

### Teste de alertas
1. Aguarde as métricas variarem naturalmente
2. Quando ultrapassarem os thresholds, alertas aparecerão
3. Observe a mudança de cor nas barras e status

### Teste de logs
1. Observe o stream contínuo de logs
2. Note os diferentes tipos (info, warning, error)
3. Teste o botão "Limpar" no painel de logs

## 📝 Boas Práticas Implementadas

- ✅ Código organizado em módulos separados
- ✅ Comentários descritivos em todas as funções
- ✅ Nomenclatura clara e consistente
- ✅ Separação de responsabilidades (MVC-like)
- ✅ Tratamento de eventos e erros
- ✅ .gitignore configurado (node_modules excluído)
- ✅ Design responsivo para diferentes dispositivos
- ✅ Performance otimizada para atualização em tempo real

## 🐛 Solução de Problemas

### Porta já em uso
Se a porta 3000 estiver ocupada:
```bash
PORT=8080 npm start
```

### Dependências não instaladas
```bash
rm -rf node_modules package-lock.json
npm install
```

### Conexão Socket.io falhando
Verifique:
- Firewall não está bloqueando a porta
- Nenhum proxy está interferindo
- Console do navegador para mensagens de erro

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como atividade prática do curso - **ATIVIDADE PRÁTICA 05**

---

**Data de Entrega:** 24/11/2025

**Tecnologias Principais:** Socket.io | Node.js | Express.js | Chart.js

---

💡 **Dica:** Para a melhor experiência, use navegadores modernos como Chrome, Firefox ou Edge.
