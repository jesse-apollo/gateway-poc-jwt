build:
	docker build -f Dockerfile . -t gateway-poc

login:
	gcloud auth configure-docker

get-creds:
	gcloud container clusters get-credentials autopilot-cluster-1 --region us-east1

push:
	docker tag gateway-poc gcr.io/lovelace-demo/gateway-poc
	docker push gcr.io/lovelace-demo/gateway-poc

run: build
	docker-compose --env-file .env -f docker-compose.yaml up 

load-secrets:
	kubectl create secret generic prod-secrets --from-env-file=.env

deploy: 
	kubectl apply -f deployment.yaml

test:
	docker-compose --env-file .env -f docker-compose.yaml up -d 
	python3 client/test.py http://localhost:8000/
	docker-compose stop