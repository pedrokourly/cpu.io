/**
 * Servidor Principal - Dashboard de Monitoramento em Tempo Real
 * Utiliza Express.js para servidor HTTP e Socket.io para comunicação bidirecional
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Importa os geradores e sistema de alertas
const MetricsGenerator = require('./metricsGenerator');
const LogsGenerator = require('./logsGenerator');
const AlertSystem = require('./alertSystem');

// Configuração do servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Instancia os geradores
const metricsGen = new MetricsGenerator();
const logsGen = new LogsGenerator();
const alertSystem = new AlertSystem();

// Contador de usuários conectados
let connectedUsers = 0;

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * Gerenciamento de conexões Socket.io
 */
io.on('connection', (socket) => {
  connectedUsers++;
  console.log(`✓ Novo usuário conectado. Total de usuários: ${connectedUsers}`);

  // Envia número de usuários conectados para todos
  io.emit('users-count', connectedUsers);

  // Envia thresholds configurados para o novo cliente
  socket.emit('thresholds', alertSystem.getThresholds());

  // Envia histórico de alertas para o novo cliente
  socket.emit('alert-history', alertSystem.getHistory());

  // Evento de desconexão
  socket.on('disconnect', () => {
    connectedUsers--;
    console.log(`✗ Usuário desconectado. Total de usuários: ${connectedUsers}`);
    io.emit('users-count', connectedUsers);
  });

  // Permite simulação manual de pico de uso
  socket.on('simulate-spike', () => {
    console.log('⚡ Simulando pico de uso...');
    metricsGen.simulateSpike();
  });
});

/**
 * Intervalo para geração e transmissão de métricas
 * Emite métricas a cada 2 segundos
 */
setInterval(() => {
  const metrics = metricsGen.generateMetrics();
  
  // Verifica se há alertas a serem disparados
  const alerts = alertSystem.checkMetrics(metrics);
  
  // Emite métricas para todos os clientes conectados
  io.emit('metrics-update', metrics);
  
  // Se houver alertas, emite para todos os clientes
  if (alerts.length > 0) {
    alerts.forEach(alert => {
      io.emit('alert', alert);
    });
  }
}, 2000);

/**
 * Intervalo para geração e transmissão de logs
 * Emite logs em intervalos aleatórios entre 1 e 3 segundos
 */
function emitLog() {
  const log = logsGen.generateLog();
  io.emit('log', log);
  
  // Agenda próximo log em intervalo aleatório
  const nextInterval = 1000 + Math.random() * 2000;
  setTimeout(emitLog, nextInterval);
}

// Inicia emissão de logs
emitLog();

/**
 * Inicia o servidor
 */
server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 Dashboard de Monitoramento em Tempo Real');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📡 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`⏰ Atualização de métricas: a cada 2 segundos`);
  console.log(`📝 Logs: intervalo aleatório (1-3 segundos)`);
  console.log('═══════════════════════════════════════════════════════');
});
