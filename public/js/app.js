/**
 * Cliente Dashboard - Aplicação Frontend
 * Gerencia conexão Socket.io, atualização de métricas e visualizações
 */

// ============================================
// INICIALIZAÇÃO E VARIÁVEIS GLOBAIS
// ============================================

// Conecta ao servidor Socket.io
const socket = io();

// Configurações dos gráficos
const MAX_DATA_POINTS = 20; // Número máximo de pontos nos gráficos
let thresholds = {}; // Thresholds recebidos do servidor

// Dados históricos para os gráficos
const chartData = {
    cpu: [],
    memory: [],
    requests: [],
    responseTime: []
};

// Objetos dos gráficos Chart.js
let charts = {};

// ============================================
// FUNÇÕES DE INICIALIZAÇÃO
// ============================================

/**
 * Inicializa todos os gráficos usando Chart.js
 */
function initCharts() {
    const chartConfigs = [
        { id: 'cpu', label: 'CPU Usage (%)', color: '#8b5cf6', max: 100 },
        { id: 'memory', label: 'Memory Usage (%)', color: '#06b6d4', max: 100 },
        { id: 'requests', label: 'Requests/sec', color: '#10b981', max: 500 },
        { id: 'responseTime', label: 'Response Time (ms)', color: '#f59e0b', max: 1000 }
    ];

    chartConfigs.forEach(config => {
        const ctx = document.getElementById(`${config.id}-chart`).getContext('2d');
        
        charts[config.id] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: config.label,
                    data: [],
                    borderColor: config.color,
                    backgroundColor: config.color + '20',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: config.max,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            maxRotation: 0
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    });
}

// ============================================
// FUNÇÕES DE ATUALIZAÇÃO DE MÉTRICAS
// ============================================

/**
 * Atualiza os valores das métricas na interface
 * @param {Object} metrics - Objeto com as métricas atualizadas
 */
function updateMetrics(metrics) {
    // Atualiza cada métrica
    Object.keys(metrics).forEach(key => {
        if (key === 'timestamp') return;

        const value = metrics[key];
        
        // Atualiza o valor exibido
        const valueElement = document.getElementById(`${key}-value`);
        if (valueElement) {
            valueElement.textContent = Math.round(value);
        }

        // Atualiza a barra de progresso
        updateMetricBar(key, value);

        // Atualiza o status (normal, warning, critical)
        updateMetricStatus(key, value);

        // Adiciona ao histórico do gráfico
        addToChart(key, value);
    });
}

/**
 * Atualiza a barra de progresso de uma métrica
 * @param {string} metric - Nome da métrica
 * @param {number} value - Valor atual
 */
function updateMetricBar(metric, value) {
    const bar = document.getElementById(`${metric}-bar`);
    if (!bar) return;

    // Calcula a porcentagem baseada no máximo configurado
    let percentage;
    if (metric === 'cpu' || metric === 'memory') {
        percentage = value; // Já está em porcentagem
    } else if (metric === 'requests') {
        percentage = (value / 500) * 100; // Máximo de 500
    } else if (metric === 'responseTime') {
        percentage = (value / 1000) * 100; // Máximo de 1000ms
    }

    bar.style.width = `${Math.min(percentage, 100)}%`;

    // Muda a cor baseado no threshold
    if (!thresholds[metric]) return;
    
    if (value >= thresholds[metric].critical) {
        bar.style.background = '#ef4444'; // Vermelho
    } else if (value >= thresholds[metric].warning) {
        bar.style.background = '#f59e0b'; // Laranja
    } else {
        bar.style.background = '#10b981'; // Verde
    }
}

/**
 * Atualiza o status de uma métrica (Normal, Warning, Critical)
 * @param {string} metric - Nome da métrica
 * @param {number} value - Valor atual
 */
function updateMetricStatus(metric, value) {
    const statusElement = document.getElementById(`${metric}-status`);
    if (!statusElement || !thresholds[metric]) return;

    // Remove classes anteriores
    statusElement.classList.remove('normal', 'warning', 'critical');

    // Define novo status
    if (value >= thresholds[metric].critical) {
        statusElement.textContent = 'Critical';
        statusElement.classList.add('critical');
    } else if (value >= thresholds[metric].warning) {
        statusElement.textContent = 'Warning';
        statusElement.classList.add('warning');
    } else {
        statusElement.textContent = 'Normal';
        statusElement.classList.add('normal');
    }
}

/**
 * Adiciona um ponto de dados ao gráfico
 * @param {string} metric - Nome da métrica
 * @param {number} value - Valor a adicionar
 */
function addToChart(metric, value) {
    const chart = charts[metric];
    if (!chart) return;

    const now = new Date();
    const timeLabel = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });

    // Adiciona novo ponto
    chart.data.labels.push(timeLabel);
    chart.data.datasets[0].data.push(value);

    // Remove pontos antigos se exceder o limite
    if (chart.data.labels.length > MAX_DATA_POINTS) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    // Atualiza o gráfico
    chart.update('none'); // 'none' = sem animação para melhor performance
}

// ============================================
// FUNÇÕES DE ALERTAS
// ============================================

/**
 * Adiciona um alerta à interface
 * @param {Object} alert - Objeto do alerta
 */
function addAlert(alert) {
    const container = document.getElementById('alerts-container');
    
    // Remove estado vazio se existir
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    // Cria elemento do alerta
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item ${alert.severity}`;
    alertElement.innerHTML = `
        <div class="alert-severity">${alert.severity.toUpperCase()}</div>
        <div class="alert-message">${alert.message}</div>
        <div class="alert-time">${new Date(alert.timestamp).toLocaleString('pt-BR')}</div>
    `;

    // Adiciona no topo
    container.insertBefore(alertElement, container.firstChild);

    // Atualiza contador de alertas
    updateAlertsCount();

    // Remove alertas antigos se houver muitos
    const alerts = container.querySelectorAll('.alert-item');
    if (alerts.length > 20) {
        alerts[alerts.length - 1].remove();
    }
}

/**
 * Carrega histórico de alertas
 * @param {Array} history - Array com histórico de alertas
 */
function loadAlertHistory(history) {
    const container = document.getElementById('alerts-container');
    container.innerHTML = '';

    if (history.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum alerta no momento</div>';
        return;
    }

    history.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = `alert-item ${alert.severity}`;
        alertElement.innerHTML = `
            <div class="alert-severity">${alert.severity.toUpperCase()}</div>
            <div class="alert-message">${alert.message}</div>
            <div class="alert-time">${new Date(alert.timestamp).toLocaleString('pt-BR')}</div>
        `;
        container.appendChild(alertElement);
    });

    updateAlertsCount();
}

/**
 * Atualiza o contador de alertas
 */
function updateAlertsCount() {
    const count = document.querySelectorAll('.alert-item').length;
    document.getElementById('alerts-count').textContent = count;
}

// ============================================
// FUNÇÕES DE LOGS
// ============================================

/**
 * Adiciona um log à interface
 * @param {Object} log - Objeto do log
 */
function addLog(log) {
    const container = document.getElementById('logs-container');
    
    // Remove estado vazio se existir
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    // Cria elemento do log
    const logElement = document.createElement('div');
    logElement.className = `log-item ${log.type}`;
    
    const time = new Date(log.timestamp).toLocaleTimeString('pt-BR');
    logElement.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-type">[${log.type.toUpperCase()}]</span>
        <span class="log-message">${log.message}</span>
    `;

    // Adiciona no topo
    container.insertBefore(logElement, container.firstChild);

    // Mantém scroll automático se usuário estiver no topo
    if (container.scrollTop < 50) {
        container.scrollTop = 0;
    }

    // Remove logs antigos se houver muitos
    const logs = container.querySelectorAll('.log-item');
    if (logs.length > 100) {
        logs[logs.length - 1].remove();
    }
}

/**
 * Limpa todos os logs
 */
function clearLogs() {
    const container = document.getElementById('logs-container');
    container.innerHTML = '<div class="empty-state">Logs limpos</div>';
}

// ============================================
// EVENT LISTENERS - SOCKET.IO
// ============================================

// Conexão estabelecida
socket.on('connect', () => {
    console.log('✓ Conectado ao servidor');
    document.getElementById('connection-status').textContent = 'Conectado';
});

// Desconectado
socket.on('disconnect', () => {
    console.log('✗ Desconectado do servidor');
    document.getElementById('connection-status').textContent = 'Desconectado';
});

// Atualização de métricas
socket.on('metrics-update', (metrics) => {
    updateMetrics(metrics);
});

// Novo alerta
socket.on('alert', (alert) => {
    addAlert(alert);
});

// Histórico de alertas (recebido ao conectar)
socket.on('alert-history', (history) => {
    loadAlertHistory(history);
});

// Thresholds (recebido ao conectar)
socket.on('thresholds', (receivedThresholds) => {
    thresholds = receivedThresholds;
    console.log('✓ Thresholds recebidos:', thresholds);
});

// Novo log
socket.on('log', (log) => {
    addLog(log);
});

// Atualização de usuários online
socket.on('users-count', (count) => {
    document.getElementById('users-online').textContent = count;
});

// ============================================
// EVENT LISTENERS - UI
// ============================================

// Botão de limpar logs
document.getElementById('clear-logs').addEventListener('click', clearLogs);

// ============================================
// INICIALIZAÇÃO
// ============================================

// Inicializa os gráficos quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard inicializado');
    initCharts();
});
