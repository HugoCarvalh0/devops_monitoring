const express = require('express');
const client = require('prom-client');

const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 }); // métricas padrão do node (cpu, memória, event loop, etc)

// Contador de requests por rota
const httpRequestCounter = new client.Counter({
  name: 'app_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'route', 'code']
});

// Histogram para latência
const httpRequestDuration = new client.Histogram({
  name: 'app_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

app.get('/', (req, res) => {
  const end = httpRequestDuration.startTimer();
  // simulate some work
  setTimeout(() => {
    httpRequestCounter.inc({ method: req.method, route: '/', code: 200 });
    end({ method: req.method, route: '/', code: 200 });
    res.send('Hello from Node monitored app!');
  }, Math.random() * 200); // latência aleatória até 200ms
});

app.get('/health', (req, res) => {
  httpRequestCounter.inc({ method: req.method, route: '/health', code: 200 });
  res.json({ status: 'ok' });
});

// Endpoint /metrics para o Prometheus scrappear
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`App escutando na porta ${PORT}`);
});
