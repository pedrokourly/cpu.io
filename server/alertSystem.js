/**
 * Sistema de Alertas
 * Monitora métricas e dispara alertas quando limites são ultrapassados
 */

class AlertSystem {
  constructor() {
    // Define os thresholds (limites) para cada métrica
    this.thresholds = {
      cpu: { warning: 70, critical: 85 },
      memory: { warning: 75, critical: 90 },
      requests: { warning: 300, critical: 450 },
      responseTime: { warning: 500, critical: 700 }
    };

    // Histórico de alertas recentes (últimos 20)
    this.alertHistory = [];
    this.maxHistorySize = 20;

    // Mapa de nomes amigáveis para métricas
    this.metricNames = {
      cpu: 'CPU Usage',
      memory: 'Memory Usage',
      requests: 'Requests/sec',
      responseTime: 'Response Time'
    };
  }

  /**
   * Verifica as métricas e gera alertas se necessário
   * @param {Object} metrics - Objeto com as métricas atuais
   * @returns {Array} Array de alertas gerados
   */
  checkMetrics(metrics) {
    const alerts = [];

    for (const [metric, value] of Object.entries(metrics)) {
      // Ignora timestamp
      if (metric === 'timestamp') continue;

      const threshold = this.thresholds[metric];
      if (!threshold) continue;

      let alert = null;

      // Verifica se ultrapassou limite crítico
      if (value >= threshold.critical) {
        alert = this.createAlert(metric, value, 'critical');
      }
      // Verifica se ultrapassou limite de warning
      else if (value >= threshold.warning) {
        alert = this.createAlert(metric, value, 'warning');
      }

      if (alert) {
        alerts.push(alert);
        this.addToHistory(alert);
      }
    }

    return alerts;
  }

  /**
   * Cria um objeto de alerta
   * @param {string} metric - Nome da métrica
   * @param {number} value - Valor atual da métrica
   * @param {string} severity - Severidade do alerta (warning ou critical)
   * @returns {Object} Objeto de alerta
   */
  createAlert(metric, value, severity) {
    const threshold = this.thresholds[metric][severity];
    
    return {
      id: Date.now() + Math.random(), // ID único
      metric,
      metricName: this.metricNames[metric],
      value: Math.round(value * 100) / 100,
      threshold,
      severity,
      message: this.generateMessage(metric, value, severity, threshold),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Gera mensagem descritiva para o alerta
   * @param {string} metric - Nome da métrica
   * @param {number} value - Valor atual
   * @param {string} severity - Severidade
   * @param {number} threshold - Limite configurado
   * @returns {string} Mensagem do alerta
   */
  generateMessage(metric, value, severity, threshold) {
    const metricName = this.metricNames[metric];
    const roundedValue = Math.round(value * 100) / 100;
    
    if (severity === 'critical') {
      return `CRITICAL: ${metricName} at ${roundedValue} (threshold: ${threshold})`;
    } else {
      return `WARNING: ${metricName} at ${roundedValue} (threshold: ${threshold})`;
    }
  }

  /**
   * Adiciona alerta ao histórico
   * @param {Object} alert - Objeto de alerta
   */
  addToHistory(alert) {
    this.alertHistory.unshift(alert);
    
    // Mantém apenas os últimos N alertas
    if (this.alertHistory.length > this.maxHistorySize) {
      this.alertHistory = this.alertHistory.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Retorna o histórico de alertas
   * @returns {Array} Array com histórico de alertas
   */
  getHistory() {
    return this.alertHistory;
  }

  /**
   * Retorna os thresholds configurados
   * @returns {Object} Objeto com os thresholds
   */
  getThresholds() {
    return this.thresholds;
  }
}

module.exports = AlertSystem;
