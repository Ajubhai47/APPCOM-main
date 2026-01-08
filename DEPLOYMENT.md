# Deployment Guide

This guide explains how to deploy the EthicProctor application to a cloud server.

## Prerequisites

1. A cloud server (AWS, Google Cloud, Azure, DigitalOcean, etc.)
2. Docker and Docker Compose installed on the server

## Environment Configuration

The application no longer requires any external database or authentication services.

## Deployment Options

### Option 1: Using Docker (Recommended)

1. Build and run the application using Docker Compose:

```bash
docker-compose up -d
```

2. The application will be available at `http://your-server-ip`

### Option 2: Manual Deployment

1. Install Node.js (v18 or higher) on your server
2. Install dependencies:

```bash
npm ci
```

3. Build the application:

```bash
npm run build
```

4. Serve the built files using a web server like Nginx or Apache

## Cloud Provider Specific Instructions

### AWS EC2

1. Launch an EC2 instance with Ubuntu Server
2. SSH into the instance and install Docker:

```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
```

3. Copy the application files to the server
4. Run the application:

```bash
docker-compose up -d
```

### Google Cloud Run

1. Build and push the Docker image to Google Container Registry:

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ethicproctor
```

2. Deploy to Cloud Run:

```bash
gcloud run deploy --image gcr.io/YOUR_PROJECT_ID/ethicproctor --platform managed
```

### DigitalOcean App Platform

1. Fork the repository to GitHub
2. Create a new app in DigitalOcean App Platform
3. Connect your GitHub repository
4. Set the build command to `npm run build`
5. Set the output directory to `dist`
6. Deploy the app

## Monitoring and Maintenance

1. Monitor the application logs:

```bash
docker-compose logs -f
```

2. Update the application:

```bash
git pull
docker-compose down
docker-compose up -d --build
```

## Security Considerations

1. Use HTTPS in production (configure SSL certificate)
2. Regularly update dependencies
3. Implement proper authentication and authorization