/**
 * Gerador de Métricas do Sistema
 * Simula métricas realistas de CPU, memória, requisições e tempo de resposta
 */

class MetricsGenerator {
  constructor() {
    // Estado base das métricas
    this.baseMetrics = {
      cpu: 45,
      memory: 60,
      requests: 100,
      responseTime: 150
    };

    // Limites de variação para simular flutuações realistas
    this.variationLimits = {
      cpu: { min: 10, max: 95 },
      memory: { min: 30, max: 90 },
      requests: { min: 50, max: 500 },
      responseTime: { min: 50, max: 800 }
    };
  }

  /**
   * Gera um valor aleatório dentro de um intervalo com tendência suave
   * @param {number} currentValue - Valor atual da métrica
   * @param {number} min - Valor mínimo permitido
   * @param {number} max - Valor máximo permitido
   * @param {number} maxChange - Variação máxima por iteração
   * @returns {number} Novo valor da métrica
   */
  generateSmoothValue(currentValue, min, max, maxChange = 5) {
    const change = (Math.random() - 0.5) * maxChange * 2;
    let newValue = currentValue + change;
    
    // Garante que o valor está dentro dos limites
    newValue = Math.max(min, Math.min(max, newValue));
    
    return Math.round(newValue * 100) / 100;
  }

  /**
   * Gera um conjunto completo de métricas
   * @returns {Object} Objeto com todas as métricas atualizadas
   */
  generateMetrics() {
    // Atualiza cada métrica de forma suave
    this.baseMetrics.cpu = this.generateSmoothValue(
      this.baseMetrics.cpu,
      this.variationLimits.cpu.min,
      this.variationLimits.cpu.max,
      8
    );

    this.baseMetrics.memory = this.generateSmoothValue(
      this.baseMetrics.memory,
      this.variationLimits.memory.min,
      this.variationLimits.memory.max,
      5
    );

    this.baseMetrics.requests = this.generateSmoothValue(
      this.baseMetrics.requests,
      this.variationLimits.requests.min,
      this.variationLimits.requests.max,
      30
    );

    this.baseMetrics.responseTime = this.generateSmoothValue(
      this.baseMetrics.responseTime,
      this.variationLimits.responseTime.min,
      this.variationLimits.responseTime.max,
      50
    );

    return {
      cpu: this.baseMetrics.cpu,
      memory: this.baseMetrics.memory,
      requests: Math.round(this.baseMetrics.requests),
      responseTime: Math.round(this.baseMetrics.responseTime),
      timestamp: Date.now()
    };
  }

  /**
   * Simula um pico de uso (spike)
   */
  simulateSpike() {
    this.baseMetrics.cpu = Math.min(95, this.baseMetrics.cpu + 30);
    this.baseMetrics.requests = Math.min(500, this.baseMetrics.requests + 150);
    this.baseMetrics.responseTime = Math.min(800, this.baseMetrics.responseTime + 200);
  }
}

module.exports = MetricsGenerator;
