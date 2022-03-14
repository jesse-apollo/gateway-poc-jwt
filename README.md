# Apollo Gateway POC with JWT client Segmentation

## Prereqs

 1. Install NodeJS 16.x
 2. Install Docker
 3. Install `gcloud` for GKE deployment & login to auth `gcloud auth login` (or do equivalent for another cloud)
 4. Copy `dot_env` to `.env` and fill in required values
 5. Run `make install` in `client/` to install Python libraries for testing (assumes `python3` and `pip3`)

## Run Locally

 0. Make sure `.env` is updated with API key and Graph reference
 1. Run `make run` to build and run container locally (http://localhost:8000/)

## Local Testing

 0. Ensure 'Run Locally' steps work.
 1. Edit `client/test.py` to set the client names, versions, and queries that will work with your Graph
 2. Run `make test`

## Deploy to Kubernetes

 1. Run `make load-secrets` once (make sure `.env` is updated first)
 2. Change the container name in `deployment.yaml`
 3. Run `make push` to push container image (assumes GCR/GKE)
 4. Run `make deploy` to deploy k8s manifest

## Remote Testing

 1. Edit `client/test.py` to set the client names, versions, and queries that will work with your Graph
 2. Run `python3 client/test.py <your testing endpoint URL>`