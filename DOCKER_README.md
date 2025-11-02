# Docker Setup for NeelKadam

This directory contains Docker configuration for the NeelKadam microservices architecture.

## Architecture

```plaintext
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                  (neelkadam-network)                     │
│                                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐ │
│  │   Backend    │  │ Admin Service │  │  Blockchain  │ │
│  │  (Port 3000) │←→│  (Port 3002)  │←→│ (Port 3001)  │ │
│  │  API Gateway │  │               │  │              │ │
│  └──────────────┘  └───────────────┘  └──────────────┘ │
│         ↑                                                │
└─────────┼────────────────────────────────────────────────┘
          │
    ┌─────┴──────┐
    │  Frontend  │
    │ (Port 5173)│
    └────────────┘
```

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.docker.example .env.docker
```

Edit `.env.docker` with your actual values:

- Database connection string
- JWT secret
- Blockchain provider URL and contract address
- Admin private key

### 2. Build and Run (Production)

Start all services:

```bash
docker-compose --env-file .env.docker up --build
```

Or run in detached mode:

```bash
docker-compose --env-file .env.docker up -d --build
```

### 3. Development Mode

For development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml --env-file .env.docker up --build
```

## Service URLs

Once running, services are available at:

- **Main Backend**: <http://localhost:3000>
- **Admin Service**: <http://localhost:3002>
- **Blockchain Service**: <http://localhost:3001>

### Health Checks

- Main Backend: <http://localhost:3000/health>
- Admin Service: <http://localhost:3002/health>
- Blockchain Service: <http://localhost:3001/health>

## Docker Commands

### Start Services

```bash
# Production mode
docker-compose up -d

# Development mode
docker-compose -f docker-compose.dev.yml up -d
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f main-backend
docker-compose logs -f admin-service
docker-compose logs -f blockchain-service
```

### Rebuild Services

```bash
# Rebuild all
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache main-backend
```

### Execute Commands in Container

```bash
# Open shell in backend container
docker-compose exec main-backend sh

# Run npm command
docker-compose exec main-backend npm install newpackage
```

### View Running Containers

```bash
docker-compose ps
```

### Remove Everything (including volumes)

```bash
docker-compose down -v
```

## File Structure

```plaintext
.
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── .dockerignore               # Files to exclude from Docker build
├── .env.docker.example         # Example environment variables
├── backend/
│   └── Dockerfile             # Backend service Dockerfile
├── admin-service/
│   └── Dockerfile             # Admin service Dockerfile
└── blockchain/
    └── Dockerfile             # Blockchain service Dockerfile
```

## Production Deployment

### 1. Build Production Images

```bash
docker-compose build
```

### 2. Tag Images

```bash
docker tag neelkadam-backend:latest your-registry/neelkadam-backend:v1.0.0
docker tag neelkadam-admin:latest your-registry/neelkadam-admin:v1.0.0
docker tag neelkadam-blockchain:latest your-registry/neelkadam-blockchain:v1.0.0
```

### 3. Push to Registry

```bash
docker push your-registry/neelkadam-backend:v1.0.0
docker push your-registry/neelkadam-admin:v1.0.0
docker push your-registry/neelkadam-blockchain:v1.0.0
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Stop the Docker containers
docker-compose down
```

### Container Won't Start

Check logs:

```bash
docker-compose logs service-name
```

### Database Connection Issues

1. Ensure DATABASE_URL is correctly set in `.env.docker`
2. Check if database is accessible from Docker container
3. Verify firewall/network settings

### Service Communication Issues

All services communicate through the Docker network. Make sure:

- Services use container names (not localhost) in URLs
- All services are on the same network
- Health checks are passing

### Clean Start

Remove all containers, networks, and volumes:

```bash
docker-compose down -v
docker system prune -a --volumes
docker-compose up --build
```

## Performance Tips

1. **Use volumes for node_modules**: Prevents reinstalling on every build
2. **Multi-stage builds**: Can be added for smaller production images
3. **Layer caching**: Dockerfile is optimized to cache dependencies layer

## Security Notes

- Never commit `.env.docker` file
- Use secrets management in production (Docker Secrets, AWS Secrets Manager, etc.)
- Run containers as non-root user (already configured)
- Keep base images updated
- Scan images for vulnerabilities: `docker scan image-name`

## Monitoring

Add monitoring with:

- Docker stats: `docker stats`
- Container logs: `docker-compose logs`
- Health checks: Built into docker-compose.yml

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build images
        run: docker-compose build
      - name: Run tests
        run: docker-compose run main-backend npm test
      - name: Push to registry
        run: |
          docker tag neelkadam-backend registry/neelkadam-backend:${{ github.sha }}
          docker push registry/neelkadam-backend:${{ github.sha }}
```

## Support

For issues or questions, refer to:

- Main README.md
- Service-specific documentation
- Docker documentation: <https://docs.docker.com>
