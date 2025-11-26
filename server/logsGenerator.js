/**
 * Gerador de Logs do Sistema
 * Simula logs realistas de diferentes tipos (info, warning, error)
 */

class LogsGenerator {
  constructor() {
    // Templates de mensagens de log por tipo
    this.logTemplates = {
      info: [
        'Request processed successfully from {ip}',
        'User {user} authenticated',
        'Cache hit for key: {key}',
        'Database connection established',
        'API endpoint {endpoint} called',
        'File {file} uploaded successfully',
        'Background job {job} completed',
        'Session created for user {user}'
      ],
      warning: [
        'High memory usage detected: {value}%',
        'Slow query detected: {time}ms',
        'API rate limit approaching for {ip}',
        'Disk space running low: {value}% remaining',
        'Deprecated API endpoint called: {endpoint}',
        'Large payload detected: {size}MB',
        'Connection timeout retry attempt {attempt}'
      ],
      error: [
        'Database connection failed: {error}',
        'Authentication failed for user {user}',
        'File not found: {file}',
        'Invalid request payload from {ip}',
        'Service {service} unavailable',
        'Failed to process job {job}',
        'Permission denied for user {user}',
        'Unexpected error: {error}'
      ]
    };

    // Dados aleatórios para preencher templates
    this.randomData = {
      ips: ['192.168.1.100', '10.0.0.45', '172.16.0.23', '192.168.0.55'],
      users: ['john_doe', 'alice_smith', 'bob_jones', 'carol_white', 'dave_brown'],
      keys: ['user:1234', 'session:abcd', 'cache:xyz', 'token:5678'],
      endpoints: ['/api/users', '/api/products', '/api/orders', '/api/dashboard'],
      files: ['report.pdf', 'image.jpg', 'data.csv', 'config.json'],
      jobs: ['email-sender', 'data-sync', 'backup', 'cleanup'],
      services: ['database', 'cache', 'storage', 'auth-service'],
      errors: ['Connection timeout', 'Invalid credentials', 'Resource not found', 'Internal server error']
    };
  }

  /**
   * Seleciona um item aleatório de um array
   * @param {Array} array - Array de onde selecionar
   * @returns {*} Item aleatório
   */
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Preenche um template de log com dados aleatórios
   * @param {string} template - Template da mensagem
   * @returns {string} Mensagem preenchida
   */
  fillTemplate(template) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      if (this.randomData[key + 's']) {
        return this.getRandomItem(this.randomData[key + 's']);
      }
      if (key === 'value') {
        return Math.floor(Math.random() * 100);
      }
      if (key === 'time') {
        return Math.floor(Math.random() * 5000) + 100;
      }
      if (key === 'size') {
        return (Math.random() * 50).toFixed(2);
      }
      if (key === 'attempt') {
        return Math.floor(Math.random() * 5) + 1;
      }
      return match;
    });
  }

  /**
   * Gera um log aleatório
   * @returns {Object} Objeto de log com tipo, mensagem e timestamp
   */
  generateLog() {
    // Define probabilidades para cada tipo de log
    // 70% info, 20% warning, 10% error
    const rand = Math.random();
    let type;
    
    if (rand < 0.7) {
      type = 'info';
    } else if (rand < 0.9) {
      type = 'warning';
    } else {
      type = 'error';
    }

    const template = this.getRandomItem(this.logTemplates[type]);
    const message = this.fillTemplate(template);

    return {
      type,
      message,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = LogsGenerator;
