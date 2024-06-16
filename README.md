## Baselime Observability K8S Integration Example

Capturing Container Logs from K8S with FluentD and sending to Baselime.IO via HTTP

In this example we have two services that will communicate via HTTP and AMQP. Marco and Polo, both exposed in the k8s ingress.

Install K3D: https://k3d.io/v5.6.3/#installation
Create Kubernetes Cluster:

```bash
k3d cluster create --api-port 6550 -p "7777:80@loadbalancer" sandbox --agents 1
```

Create FluentD Daemonset (to capture logs)
In `k8s/fluentd.yaml` change x-api-key to your baselime.io apikey

```bash
kubectl apply -f k8s/fluentd.yaml
```

Create RabbitMQ Dependency

```bash
kubectl apply -f k8s/rabbitmq.yaml
```

Create Apps (Marco and Polo)

```bash
kubectl apply -f k8s/apps-deploy.yaml
```

## OPEN TELEMETRY

ADD OTEL HELM CHARTS

```bash
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
```

In `k8s/otel-daemonset.values.yaml` and `k8s/otel-deployment.values.yaml` change x-api-key to your baselime.io apikey

Deploy the `Otel Daemonset` that will capture telemetry data from nodes and workloads

```bash
helm install otel-collector open-telemetry/opentelemetry-collector --values k8s/otel-daemonset.values.yaml
```

Deploy the `Otel Deployment` that will capture telemetry data from the cluster

```bash
helm install otel-collector-cluster open-telemetry/opentelemetry-collector --values k8s/otel-deployment.values.yaml
```


### INGRESS INFO
Create Ingress: https://k3d.io/v5.3.0/usage/exposing_services/