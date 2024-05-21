## Baselime Fluentd K8S Integration Example

Capturing Container Logs from K8S with FluentD and Injecting to Baselime.IO Via HTTP

In this example we have two services that will communicate via HTTP and AMQP. Marco and Polo, both exposed in the k8s ingress.

Install K3D: https://k3d.io/v5.6.3/#installation
Create Kubernetes Cluster:

```bash
k3d cluster create --api-port 6550 -p "7777:80@loadbalancer" sandbox --agents 1
```

Create Ingress: https://k3d.io/v5.3.0/usage/exposing_services/

```bash
kubectl create deployment nginx --image=nginx
kubectl create service clusterip nginx --tcp=80:80
kubectl apply -f k8s/ingress.yaml
```

Create FluentD Daemonset (to capture logs)
In k8s/fluentd.yaml change x-api-key to your baselime.io apikey

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
