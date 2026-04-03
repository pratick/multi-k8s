docker build -t pratickb/multi-client:latest -t pratickb/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t pratickb/multi-server:latest -t pratickb/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t pratickb/multi-worker:latest -t pratickb/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push pratickb/multi-client:latest
docker push pratickb/multi-server:latest
docker push pratickb/multi-worker:latest

docker push pratickb/multi-client:$SHA
docker push pratickb/multi-server:$SHA
docker push pratickb/multi-worker:$SHA

kubectl apply -f k8s

kubectl set image deployments/server-deployment server=pratickb/multi-server:$SHA
kubectl set image deployments/client-deployment client=pratickb/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=pratickb/multi-worker:$SHA