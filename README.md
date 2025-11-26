# Monitoramento de Aplicação Node.js com Prometheus e Grafana

Este projeto demonstra como instrumentar uma aplicação **Node.js**
usando `prom-client`, coletar métricas com o **Prometheus** e
visualizá-las no **Grafana**, utilizando Docker e Docker Compose.

------------------------------------------------------------------------

## 📦 Estrutura do Projeto

    monitoring-node/
    ├─ app/
    │  ├─ Dockerfile
    │  ├─ package.json
    │  └─ index.js
    ├─ prometheus/
    │  └─ prometheus.yml
    └─ docker-compose.yml

------------------------------------------------------------------------

## 🚀 Tecnologias Utilizadas

-   **Node.js + Express**
-   **prom-client**
-   **Prometheus**
-   **Grafana**
-   **Docker & Docker Compose**
-   **WSL2**

------------------------------------------------------------------------

## 📘 1. Aplicação Node.js com Métricas

A aplicação expõe um endpoint `/metrics` no formato esperado pelo
Prometheus e inclui:

-   métricas padrão do Node.js (CPU, heap, event loop),
-   contador de requisições HTTP,
-   histogram de latência.

------------------------------------------------------------------------

## 🐳 2. Dockerfile do App

Build simples baseado em `node:18-alpine`, instalando dependências e
subindo o serviço na porta `5000`.

------------------------------------------------------------------------

## 📡 3. Configuração do Prometheus

Arquivo `prometheus.yml` define o scrape do app a cada 5s:

    job_name: 'app'
    metrics_path: /metrics
    targets: ['app:5000']

------------------------------------------------------------------------

## 📊 4. Grafana

Exposto na porta `3000`, com login padrão:

-   **user:** admin
-   **pass:** admin

Após subir, adicione o Prometheus como *Data Source*.

------------------------------------------------------------------------

## ▶️ 5. Subindo o Ambiente

Execute na raiz do projeto:

``` bash
docker compose up -d --build
```

Verifique:

-   App → http://localhost:5000\
-   Métricas → http://localhost:5000/metrics\
-   Prometheus → http://localhost:9090\
-   Grafana → http://localhost:3000

------------------------------------------------------------------------

## ⚙️ 6. Criando Dashboard no Grafana

Exemplos de queries:

### 📈 Requisições por segundo (RPS)

    sum(rate(app_requests_total[1m]))

### ⏱️ Latência média

    histogram_quantile(0.95, sum(rate(app_request_duration_seconds_bucket[5m])) by (le))

------------------------------------------------------------------------

## 🧪 7. Gerar Tráfego para Testes

``` bash
for i in {1..100}; do curl -s http://localhost:5000/ >/dev/null; sleep 0.1; done
```

------------------------------------------------------------------------

## 💻 Compatibilidade com WSL2

Este projeto funciona 100% no **WSL2 com Docker Desktop integrado**.\
Recomendação: manter o projeto dentro de `/home/usuario/...` para evitar
problemas com volumes.

------------------------------------------------------------------------

## 📝 Licença

Este repositório é apenas para fins educacionais dentro do plano de
estudos DevOps.
