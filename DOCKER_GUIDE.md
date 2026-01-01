# Docker Guide: From Scratch

## Table of Contents

1. [Introduction](#introduction)
2. [What is Docker?](#what-is-docker)
3. [Docker Architecture](#docker-architecture)
4. [Installation](#installation)
5. [Docker Images](#docker-images)
6. [Docker Containers](#docker-containers)
7. [Docker Volumes](#docker-volumes)
8. [Docker Networks](#docker-networks)
9. [Docker Context](#docker-context)
10. [Docker Compose](#docker-compose)
11. [Best Practices](#best-practices)

---

## Introduction

Docker is a platform that enables developers to package applications and their dependencies into lightweight, portable containers. This guide will walk you through Docker concepts from the ground up, helping you understand how to build, run, and manage containerized applications.

### 🍽️ Complete Restaurant Analogy Overview

Think of Docker like a **complete restaurant operation**. Here's how everything maps:

| Docker Concept            | Restaurant Equivalent     | Explanation                                                    |
| ------------------------- | ------------------------- | -------------------------------------------------------------- |
| **Docker Image**          | **Recipe Card**           | Instructions on how to make a dish (read-only template)        |
| **Docker Container**      | **Prepared Dish**         | The actual meal served to a customer (running instance)        |
| **Dockerfile**            | **Written Recipe**        | Step-by-step instructions for creating the recipe card         |
| **Docker Hub**            | **Recipe Library**        | Public library where chefs share recipes (image registry)      |
| **Docker build**          | **Cooking Process**       | Following the recipe to create the dish (building image)       |
| **Docker run**            | **Serving Dish**          | Bringing the prepared dish to the customer (running container) |
| **Docker Client**         | **Customer/Order Taker**  | You placing orders and requesting dishes                       |
| **Docker Host**           | **Kitchen**               | Where all the cooking happens (daemon, engine, runtime)        |
| **Docker Registry**       | **Recipe Library**        | Where recipes are stored and shared                            |
| **Volumes**               | **Storage Pantry**        | Persistent storage for ingredients and leftovers               |
| **Networks**              | **Delivery Routes**       | How dishes communicate and move between places                 |
| **Ports**                 | **Table Numbers**         | How customers access their dishes                              |
| **Environment Variables** | **Customization Options** | "Make it spicy", "No onions", etc.                             |
| **Layers**                | **Recipe Steps**          | Each step in the recipe (base, ingredients, cooking, garnish)  |
| **Tags**                  | **Dish Versions**         | "Spaghetti v1.0", "Spaghetti - spicy version"                  |

**Key Insight**: Just like a restaurant can use **one recipe** (image) to prepare **many dishes** (containers) for different customers, Docker can create **multiple containers** from the **same image**!

**The Complete Flow:**

1. **Write Recipe** (Dockerfile) → Instructions on how to make the dish
2. **Create Recipe Card** (docker build) → Follow instructions to create reusable recipe
3. **Store Recipe** (docker push) → Put recipe in library (registry)
4. **Get Recipe** (docker pull) → Borrow recipe from library
5. **Prepare Dish** (docker run) → Use recipe to make actual dish (container)
6. **Serve Dish** → Customer (user) enjoys the dish (application runs)
7. **Manage Dishes** → Start, stop, pause, remove dishes as needed

---

## What is Docker?

Docker is an open-source containerization platform that allows you to:

- **Package applications** with all their dependencies into containers
- **Ensure consistency** across different environments (development, staging, production)
- **Isolate applications** from each other while sharing the same OS kernel
- **Deploy applications** quickly and reliably

### Key Concepts

Before diving deeper, it's important to understand these fundamental terms:

- **Container**: A lightweight, standalone, executable package that includes everything needed to run an application
  - 🍽️ **Restaurant Analogy**: A **prepared dish** served to a customer - it's the actual meal, ready to eat, created from a recipe
- **Image**: A read-only template used to create containers
  - 🍽️ **Restaurant Analogy**: A **recipe card** - it's the instructions and ingredients list, but not the actual dish. You can use the same recipe to make many dishes!
- **Dockerfile**: A text file containing instructions to build a Docker image
  - 🍽️ **Restaurant Analogy**: The **written recipe instructions** - step-by-step directions on how to prepare the dish
- **Docker Engine**: The runtime that builds and runs containers
  - 🍽️ **Restaurant Analogy**: The **kitchen and chef** - the place and person who actually cook the dishes following the recipes
- **Docker Hub**: A cloud-based registry where Docker images are stored and shared
  - 🍽️ **Restaurant Analogy**: A **recipe book library** - where chefs (developers) share and find recipes (images) that others have created

---

## Docker Architecture

Docker follows a client-server architecture with three main components: **Docker Client**, **Docker Host**, and **Docker Registry**. Understanding these components is crucial for working effectively with Docker.

### 🍽️ Restaurant Analogy

Think of the Docker architecture like a restaurant operation:

- **Docker Client** = **You (the customer)** placing an order
- **Docker Host** = **The kitchen** where the cooking happens
- **Docker Registry** = **The recipe library** where recipes are stored and shared

When you order food (run a container), you (client) tell the kitchen (host) what dish you want. The kitchen checks the recipe library (registry) if needed, then prepares and serves your dish (container)!

### Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Docker Client  │────────▶│  Docker Host    │────────▶│ Docker Registry │
│   (CLI/API)     │         │   (Daemon)      │         │  (Docker Hub)   │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  Containers     │
                            │  Images         │
                            │  Volumes        │
                            │  Networks       │
                            └─────────────────┘
```

---

## Docker Client

The **Docker Client** is the primary interface you use to interact with Docker. It's the command-line tool (`docker`) that sends commands to the Docker daemon.

### 🍽️ Restaurant Analogy

The Docker Client is like **you placing an order at a restaurant**:

- You tell the waiter (CLI) what you want
- The waiter communicates your order to the kitchen (Docker daemon)
- You can order different dishes (containers), ask for recipes (images), or request modifications

### What is Docker Client?

The Docker Client is a command-line interface (CLI) that allows users to:

- Build, run, and manage containers
- Pull and push images
- Interact with the Docker daemon
- Execute Docker commands

### Client Components

**1. Docker CLI (Command Line Interface)**

```bash
# The docker command you use in terminal
docker run nginx
docker build -t my-app .
docker ps
```

**2. Docker API**

- RESTful API for programmatic access
- Used by Docker CLI and other tools
- Can be accessed via HTTP/HTTPS
- Default socket: `/var/run/docker.sock` (Unix) or `npipe:////./pipe/docker_engine` (Windows)

### Client-Daemon Communication

The client communicates with the daemon through:

- **Unix socket** (Linux/macOS): `/var/run/docker.sock`
- **Named pipe** (Windows): `\\.\pipe\docker_engine`
- **TCP/HTTP** (remote): `tcp://host:port` or `https://host:port`

### Common Client Commands

```bash
# Container management
docker run, docker start, docker stop, docker rm

# Image management
docker build, docker pull, docker push, docker images

# System information
docker info, docker version, docker system df

# Network and volume management
docker network, docker volume
```

### Client Configuration

**Docker configuration file** (`~/.docker/config.json`):

```json
{
  "auths": {
    "https://index.docker.io/v1/": {
      "auth": "base64-encoded-credentials"
    }
  },
  "HttpHeaders": {
    "User-Agent": "Docker-Client"
  }
}
```

**Environment variables:**

```bash
# Set Docker host
export DOCKER_HOST=tcp://192.168.1.100:2376

# Set TLS verification
export DOCKER_TLS_VERIFY=1

# Set certificate paths
export DOCKER_CERT_PATH=/path/to/certs
```

---

## Docker Host

The **Docker Host** is the machine where Docker is installed and running. It contains the Docker daemon and manages all Docker objects.

### 🍽️ Restaurant Analogy

The Docker Host is like **the entire restaurant kitchen**:

- The **Docker Daemon** = The **head chef** who coordinates everything
- The **Docker Engine** = The **kitchen equipment and workspace**
- The **Container Runtime** = The **cooking stations** where dishes are actually prepared
- **Containers** = The **prepared dishes** ready to serve
- **Images** = The **recipe cards** stored in the kitchen

The kitchen (host) receives orders (from client), follows recipes (images), and prepares dishes (containers)!

### Components of Docker Host

**1. Docker Daemon (dockerd)**

- Background service that manages Docker objects
- Listens for Docker API requests
- Manages containers, images, networks, and volumes
- Handles container lifecycle

**2. Docker Engine**

- Combines the daemon and runtime
- Orchestrates container execution
- Manages storage, networking, and security

**3. Container Runtime**

- **containerd**: Industry-standard container runtime
- **runc**: Low-level runtime for running containers
- Handles container execution, isolation, and resource management

### Docker Host Architecture

```
┌─────────────────────────────────────────┐
│         Docker Host                      │
│  ┌───────────────────────────────────┐  │
│  │      Docker Daemon (dockerd)      │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Container Runtime         │  │  │
│  │  │   (containerd + runc)       │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Image Management          │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Network Management        │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Volume Management         │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Containers (Running Instances)  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Images (Stored Templates)       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Docker Daemon Management

**Start/Stop Daemon:**

```bash
# Linux (systemd)
sudo systemctl start docker
sudo systemctl stop docker
sudo systemctl restart docker
sudo systemctl status docker

# Enable on boot
sudo systemctl enable docker
```

**Daemon Configuration:**

```bash
# View daemon configuration
docker info

# Configure daemon (daemon.json)
# Location: /etc/docker/daemon.json (Linux)
#          ~/.docker/daemon.json (macOS/Windows)
```

**Example daemon.json:**

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-address-pools": [
    {
      "base": "172.17.0.0/16",
      "size": 24
    }
  ]
}
```

### Host Resources

**View host information:**

```bash
# System-wide information
docker info

# Disk usage
docker system df

# Detailed disk usage
docker system df -v

# Prune unused resources
docker system prune
```

**Resource Management:**

- **CPU**: Shared among containers, can be limited per container
- **Memory**: Allocated to containers, can be limited
- **Storage**: Images, containers, volumes stored on host filesystem
- **Network**: Virtual networks created on host

### Remote Docker Host

**Connect to remote Docker host:**

```bash
# Set DOCKER_HOST environment variable
export DOCKER_HOST=tcp://remote-host:2376

# Use TLS
export DOCKER_HOST=tcp://remote-host:2376
export DOCKER_TLS_VERIFY=1
export DOCKER_CERT_PATH=/path/to/certs

# Or use in command
docker -H tcp://remote-host:2376 ps
```

**Security considerations:**

- Use TLS/SSL for remote connections
- Configure firewall rules
- Use authentication and authorization
- Consider Docker Context for managing multiple hosts

---

## Docker Registry

A **Docker Registry** is a storage and distribution system for Docker images. It's where images are stored, versioned, and distributed.

### 🍽️ Restaurant Analogy

A Docker Registry is like a **recipe library or cookbook collection**:

- **Public Registry (Docker Hub)** = A **public library** where anyone can browse and borrow recipe books
- **Private Registry** = A **private recipe collection** (like a family cookbook) - only authorized people can access it
- **Image Tags** = Different **versions of the same recipe** (e.g., "Spaghetti v1.0", "Spaghetti v2.0", "Spaghetti - spicy version")
- **Pulling an image** = **Borrowing a recipe** from the library
- **Pushing an image** = **Donating your recipe** to the library

Just like chefs share recipes, developers share Docker images through registries!

### What is a Registry?

A registry is a repository of Docker images that:

- Stores image layers and metadata
- Provides image versioning (tags)
- Enables image distribution
- Supports public and private repositories

### Registry Types

**1. Public Registries**

**Docker Hub** (hub.docker.com):

- Default public registry
- Free for public repositories
- Paid plans for private repositories
- Millions of official and community images

**Other Public Registries:**

- **GitHub Container Registry** (ghcr.io)
- **Google Container Registry** (gcr.io)
- **Amazon ECR Public** (public.ecr.aws)
- **Quay.io** (quay.io)

**2. Private Registries**

**Self-hosted:**

- Docker Registry (open-source)
- Harbor
- GitLab Container Registry
- Nexus Repository

**Cloud-hosted:**

- **AWS ECR** (Amazon Elastic Container Registry)
- **Azure ACR** (Azure Container Registry)
- **GCP GCR** (Google Container Registry)
- **DigitalOcean Container Registry**

### Docker Hub

**Docker Hub Features:**

- Public and private repositories
- Automated builds from GitHub/Bitbucket
- Webhooks for CI/CD integration
- Image scanning for vulnerabilities
- Team collaboration features

**Working with Docker Hub:**

```bash
# Login to Docker Hub
docker login

# Login with username
docker login -u username

# Logout
docker logout

# Search for images
docker search nginx

# Pull public image
docker pull nginx

# Push image to Docker Hub
docker tag my-app:latest username/my-app:latest
docker push username/my-app:latest
```

### Private Registry Setup

**Run local registry:**

```bash
# Start a local registry
docker run -d -p 5000:5000 --name registry registry:2

# Tag image for local registry
docker tag my-app:latest localhost:5000/my-app:latest

# Push to local registry
docker push localhost:5000/my-app:latest

# Pull from local registry
docker pull localhost:5000/my-app:latest
```

**Secure registry with authentication:**

```bash
# Create htpasswd file
docker run --rm --entrypoint htpasswd httpd:2 \
  -Bbn username password > auth/htpasswd

# Run registry with authentication
docker run -d -p 5000:5000 \
  -v $(pwd)/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  --name registry registry:2

# Login to secure registry
docker login localhost:5000
```

### Registry Operations

**Pull images:**

```bash
# Pull from Docker Hub
docker pull nginx:latest

# Pull from specific registry
docker pull registry.example.com/my-app:1.0

# Pull with authentication
docker pull private-registry.com/image:tag
```

**Push images:**

```bash
# Tag image for registry
docker tag local-image:tag registry.com/repository:tag

# Push to registry
docker push registry.com/repository:tag

# Push with authentication
docker login registry.com
docker push registry.com/repository:tag
```

**List registry contents:**

```bash
# Using registry API (if supported)
curl https://registry.hub.docker.com/v2/repositories/library/nginx/tags/

# Using Docker Hub API
curl https://hub.docker.com/v2/repositories/library/nginx/tags/
```

### Registry Best Practices

1. **Use specific tags** instead of `latest` in production
2. **Sign images** for security and authenticity
3. **Scan images** for vulnerabilities before use
4. **Use private registries** for proprietary applications
5. **Implement access control** and authentication
6. **Set up image retention policies** to manage storage
7. **Use registry mirrors** for faster pulls in specific regions
8. **Monitor registry usage** and storage consumption
9. **Backup registry data** regularly
10. **Use content trust** for image verification

### Registry Configuration

**Configure registry mirror:**

```json
// /etc/docker/daemon.json
{
  "registry-mirrors": ["https://mirror.example.com"]
}
```

**Insecure registries:**

```json
// /etc/docker/daemon.json
{
  "insecure-registries": ["registry.example.com:5000"]
}
```

### Registry vs Repository

- **Registry**: The entire storage and distribution system (e.g., Docker Hub)
- **Repository**: A collection of related images with the same name but different tags (e.g., `nginx` repository with tags `latest`, `1.21`, `alpine`)

```
Registry (Docker Hub)
  └── Repository (nginx)
        ├── Tag: latest
        ├── Tag: 1.21
        └── Tag: alpine
```

---

### Interaction Flow

**Complete workflow example:**

```
1. Developer (Client)
   └─▶ docker build -t my-app:1.0 .
       └─▶ Docker Host (Daemon)
           └─▶ Builds image from Dockerfile
               └─▶ Stores image locally

2. Developer (Client)
   └─▶ docker push my-app:1.0
       └─▶ Docker Host (Daemon)
           └─▶ Pushes image layers
               └─▶ Docker Registry
                   └─▶ Stores image

3. Production Server (Client)
   └─▶ docker pull my-app:1.0
       └─▶ Docker Registry
           └─▶ Sends image layers
               └─▶ Docker Host (Daemon)
                   └─▶ Downloads and stores image

4. Production Server (Client)
   └─▶ docker run my-app:1.0
       └─▶ Docker Host (Daemon)
           └─▶ Creates container from image
               └─▶ Runs container
```

---

## Installation

### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
```

### macOS / Windows

Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

### Verify Installation

```bash
# Check Docker version
docker --version

# Run a test container
docker run hello-world
```

---

## Docker Images

A Docker image is a **read-only template** used to create containers. Think of it as a snapshot of a filesystem with your application and all its dependencies. Images are built from a series of layers, making them efficient and reusable.

### 🍽️ Restaurant Analogy

A Docker Image is like a **recipe card**:

- It's a **template** (recipe) that tells you how to make a dish
- It's **read-only** - you can't change the recipe card itself, but you can use it to make many dishes
- Multiple **layers** = Different **steps in the recipe** (prepare base, add ingredients, cook, garnish)
- **Reusable** - Use the same recipe to make the same dish many times
- **Efficient** - If two recipes share the same base (like "prepare pasta"), that step is done once and reused

Just like you can use one recipe card to prepare the same dish for 100 customers, you can use one Docker image to create 100 containers!

### Understanding Image Layers

Docker images are composed of multiple **layers**, each representing a change or instruction. This layered approach provides several benefits:

- **Efficiency**: Layers are cached and shared between images
  - 🍽️ Like having **pre-prepared ingredients** - if two recipes need "chopped onions," you chop them once and use for both!
- **Speed**: Only changed layers need to be rebuilt
  - 🍽️ If you change only the "garnish" step in a recipe, you don't need to redo the "prepare base" step
- **Storage**: Common layers are stored once and reused
  - 🍽️ Like having a **shared ingredient pantry** - all recipes use the same salt, pepper, and oil

```
┌─────────────────────────┐
│   Application Layer     │ (Your app code)
├─────────────────────────┤
│   Dependencies Layer    │ (npm packages, pip packages, etc.)
├─────────────────────────┤
│   Runtime Layer         │ (Node.js, Python, Java, etc.)
├─────────────────────────┤
│   Base OS Layer         │ (Alpine, Ubuntu, etc.)
└─────────────────────────┘
```

### Pulling Images from Docker Hub

🍽️ **Restaurant Analogy**: Pulling an image is like **borrowing a recipe from a cookbook library**. You get the recipe (image) so you can use it to prepare dishes (containers) in your own kitchen!

Docker Hub is the default public registry where millions of images are available. You can pull (download) images using the `docker pull` command:

```bash
# Pull the latest version of an image
docker pull nginx

# Pull a specific version/tag
docker pull nginx:1.21

# Pull from a different registry
docker pull registry.example.com/my-image:tag
```

**Common base images:**

- `ubuntu:latest` - Ubuntu Linux
- `alpine:latest` - Minimal Alpine Linux (very small)
- `node:18` - Node.js runtime
- `python:3.11` - Python runtime
- `nginx:latest` - Nginx web server
- `postgres:15` - PostgreSQL database

### Building Images with Dockerfile

🍽️ **Restaurant Analogy**: A Dockerfile is like **writing down your recipe instructions**. You list all the steps: "First, get a bowl (FROM base image), then add ingredients (COPY files), then mix (RUN commands), and finally serve (CMD)!"

A **Dockerfile** is a text file containing instructions to build a Docker image. Here's a simple example:

```dockerfile
# Use an official base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose a port
EXPOSE 3000

# Define the command to run the application
CMD ["node", "index.js"]
```

**Common Dockerfile Instructions:**

| Instruction  | Description                               | Example                               |
| ------------ | ----------------------------------------- | ------------------------------------- |
| `FROM`       | Base image to start from                  | `FROM ubuntu:20.04`                   |
| `WORKDIR`    | Set working directory                     | `WORKDIR /app`                        |
| `COPY`       | Copy files from host to image             | `COPY . /app`                         |
| `ADD`        | Similar to COPY, but can extract archives | `ADD app.tar.gz /app`                 |
| `RUN`        | Execute commands during build             | `RUN apt-get update`                  |
| `ENV`        | Set environment variables                 | `ENV NODE_ENV=production`             |
| `ARG`        | Build-time variables                      | `ARG VERSION=1.0`                     |
| `EXPOSE`     | Document which port the app uses          | `EXPOSE 8080`                         |
| `CMD`        | Default command to run                    | `CMD ["python", "app.py"]`            |
| `ENTRYPOINT` | Command that always runs                  | `ENTRYPOINT ["docker-entrypoint.sh"]` |
| `LABEL`      | Add metadata to image                     | `LABEL version="1.0"`                 |

### Building an Image

The `docker build` command is used to create a Docker image from a Dockerfile and a build context. Let's break down the command in detail.

#### Command Breakdown: `docker build -t react-docker .`

🍽️ **Restaurant Analogy**: This command is like saying: _"Hey kitchen, follow the recipe in this folder (.), cook it, and label the finished dish as 'react-docker'!"_

Let's analyze each component of this command:

```bash
docker build -t react-docker .
│      │     │   │          │
│      │     │   │          └─ Build context (current directory)
│      │     │   └─ Image name/tag
│      │     └─ Tag flag (--tag)
│      └─ Build command
└─ Docker CLI
```

**Real-world translation:**

- `docker` = "Hey, Docker kitchen!"
- `build` = "Cook/prepare a dish"
- `-t react-docker` = "Label it as 'react-docker'"
- `.` = "Use the recipe in this folder"

**1. `docker`** - The Docker CLI command

- 🍽️ Like saying **"Hey, restaurant kitchen!"** - you're addressing the Docker system
- This is the Docker client that communicates with the Docker daemon

**2. `build`** - The build subcommand

- 🍽️ Like saying **"Cook this dish!"** - you're telling Docker to prepare something
- Instructs Docker to build an image from a Dockerfile
- This is the action you want to perform

**3. `-t` or `--tag`** - Tag flag

- 🍽️ Like **labeling your dish** - "This is the 'React-Docker' dish" or "This is version 1.0"
- Assigns a name and optionally a tag to the built image
- Format: `-t name:tag` or `-t name` (defaults to `:latest`)
- Can be used multiple times to create multiple tags
- Example: `-t react-docker` creates an image named `react-docker:latest`
- Example: `-t react-docker:v1.0` creates an image named `react-docker` with tag `v1.0`

**4. `react-docker`** - Image name

- 🍽️ The **name of your dish** - how you'll refer to it later
- The name you're giving to your image
- Can include registry: `registry.com/react-docker` (like "Chef John's Restaurant - React-Docker")
- Can include username: `username/react-docker` (like "John's React-Docker recipe")
- If no tag specified, defaults to `:latest` (like "the current version")

**5. `.` (dot)** - Build context

- 🍽️ Like saying **"Use the ingredients in THIS pantry/folder"** - where to find everything needed
- The path to the build context (directory containing files to build)
- `.` means current directory
- Docker sends ALL files in this directory to the daemon
- This is where Docker looks for the Dockerfile (unless `-f` is used)

#### Complete Command Examples

```bash
# Basic build (no tag, uses default)
docker build .
# Result: Creates an image with a random ID, no name

# Build with name (defaults to :latest tag)
docker build -t react-docker .
# Result: Image named 'react-docker:latest'

# Build with name and specific tag
docker build -t react-docker:v1.0 .
# Result: Image named 'react-docker' with tag 'v1.0'

# Build with registry and username
docker build -t myregistry.com/username/react-docker:latest .
# Result: Image ready to push to 'myregistry.com'

# Build with multiple tags
docker build -t react-docker:latest -t react-docker:v1.0 .
# Result: Same image with two tags

# Build from different Dockerfile
docker build -f Dockerfile.prod -t react-docker:prod .
# Result: Uses 'Dockerfile.prod' instead of 'Dockerfile'

# Build from different directory
docker build -t react-docker ./app
# Result: Uses './app' as build context
```

#### Understanding Build Context

🍽️ **Restaurant Analogy**: The build context (`.`) is like **telling the kitchen which pantry to use**:

- `.` = "Use everything in THIS pantry (current folder)"
- `./src` = "Use only the ingredients in the src pantry"
- Docker sends ALL files from that pantry to the kitchen (daemon)
- `.dockerignore` = "Don't send these items" (like saying "don't bring expired ingredients")

The build context (the `.` in the command) is crucial:

```
Your Project Directory (The Pantry)
├── Dockerfile          ← Recipe instructions (Docker looks here first)
├── package.json        ← Ingredient list
├── src/                ← Main ingredients
├── node_modules/       ← Pre-prepared ingredients
├── .dockerignore       ← "Don't send these" list
└── ... (all files sent to Docker daemon/kitchen)
```

**What happens:**

1. Docker packages ALL files in the build context
2. Sends them to the Docker daemon
3. Daemon uses these files during the build process
4. Files can be referenced in Dockerfile with `COPY` or `ADD`

**Important considerations:**

- Large build contexts = slow builds
  - 🍽️ Like sending the **entire warehouse** to the kitchen - very slow!
- Use `.dockerignore` to exclude unnecessary files
  - 🍽️ Like saying **"Don't bring expired ingredients or trash"** - keeps things clean and fast
- Build context determines what files are available to `COPY`/`ADD`
  - 🍽️ You can only use ingredients that are in the pantry you specified!

#### Docker Build Options and Flags

**Tagging options:**

```bash
# Single tag
docker build -t my-app .

# Multiple tags
docker build -t my-app:latest -t my-app:1.0 -t my-app:stable .

# Tag with build argument
docker build -t my-app:$VERSION .
```

**File options:**

```bash
# Use different Dockerfile
docker build -f Dockerfile.prod -t my-app:prod .

# Use Dockerfile from different location
docker build -f ./configs/Dockerfile.dev -t my-app:dev .

# Use different build context
docker build -f Dockerfile -t my-app ./src
```

**Build arguments:**

```bash
# Pass build argument
docker build --build-arg NODE_ENV=production -t my-app .

# Multiple build arguments
docker build \
  --build-arg NODE_ENV=production \
  --build-arg VERSION=1.0 \
  -t my-app .

# Build argument from environment variable
docker build --build-arg VERSION=$VERSION -t my-app .
```

**Cache options:**

```bash
# Don't use cache
docker build --no-cache -t my-app .

# Pull base images even if cached
docker build --pull -t my-app .

# Use specific cache from image
docker build --cache-from my-app:previous -t my-app .
```

**Output options:**

```bash
# Quiet build (less output)
docker build -q -t my-app .

# Progress output
docker build --progress=plain -t my-app .

# JSON output
docker build --progress=json -t my-app .
```

**Platform options:**

```bash
# Build for specific platform
docker build --platform linux/amd64 -t my-app .

# Build for multiple platforms (requires buildx)
docker buildx build --platform linux/amd64,linux/arm64 -t my-app .
```

**Other useful options:**

```bash
# Set memory limit for build
docker build --memory=2g -t my-app .

# Set CPU limit
docker build --cpuset-cpus="0,1" -t my-app .

# Add metadata labels
docker build --label "version=1.0" --label "author=John" -t my-app .

# Use specific network during build
docker build --network=host -t my-app .

# Set build-time secrets
docker build --secret id=mysecret,src=./secret.txt -t my-app .
```

#### Build Process Explained

When you run `docker build -t react-docker .`, here's what happens:

```
1. Docker Client receives command
   └─▶ Validates command syntax

2. Docker Client reads build context
   └─▶ Packages all files from '.' directory
   └─▶ Respects .dockerignore exclusions
   └─▶ Sends context to Docker daemon

3. Docker Daemon receives context
   └─▶ Looks for Dockerfile (or uses -f specified file)
   └─▶ Reads Dockerfile instructions

4. Docker Daemon executes build
   └─▶ Processes each instruction sequentially
   └─▶ Creates layers for each instruction
   └─▶ Caches layers when possible
   └─▶ Executes RUN commands in temporary containers

5. Docker Daemon creates final image
   └─▶ Combines all layers
   └─▶ Applies metadata (tags, labels)
   └─▶ Stores image locally

6. Result
   └─▶ Image 'react-docker:latest' is ready
   └─▶ Can be viewed with 'docker images'
   └─▶ Can be run with 'docker run react-docker'
```

#### Build Context Best Practices

**1. Use .dockerignore:**

```dockerignore
# .dockerignore file
node_modules
npm-debug.log
.git
.gitignore
.env
*.md
.DS_Store
dist
coverage
```

**2. Minimize build context:**

```bash
# Bad: Large context
docker build -t app .  # Includes everything

# Good: Specific context
docker build -t app ./src  # Only includes src directory
```

**3. Organize your project:**

```
project/
├── Dockerfile
├── .dockerignore
├── src/           ← Application code
├── config/        ← Configuration files
└── build/         ← Build artifacts (excluded)
```

#### Common Build Scenarios

**Development build:**

```bash
docker build -t my-app:dev -f Dockerfile.dev .
```

**Production build:**

```bash
docker build \
  --build-arg NODE_ENV=production \
  -t my-app:prod \
  -f Dockerfile.prod \
  .
```

**Multi-stage build:**

```bash
# Dockerfile handles stages, just build normally
docker build -t my-app:optimized .
```

**Build and tag for registry:**

```bash
docker build -t myregistry.com/username/my-app:1.0 .
docker push myregistry.com/username/my-app:1.0
```

#### Troubleshooting Build Issues

**View build output:**

```bash
# Verbose output
docker build --progress=plain -t my-app .

# See what's being sent to daemon
docker build --progress=plain -t my-app . 2>&1 | head -20
```

**Check build context size:**

```bash
# Before building, check what will be sent
du -sh .
tar -czf context.tar.gz .
ls -lh context.tar.gz
```

**Debug build steps:**

```bash
# Build with no cache to see all steps
docker build --no-cache --progress=plain -t my-app .
```

#### Complete docker build Command Reference

```bash
docker build [OPTIONS] PATH | URL

Options:
  -t, --tag list              Name and optionally a tag (format: name:tag)
  -f, --file string           Name of the Dockerfile (default: "PATH/Dockerfile")
  --build-arg list            Set build-time variables
  --cache-from strings        Images to consider as cache sources
  --no-cache                  Do not use cache when building the image
  --pull                      Always attempt to pull a newer version of the image
  -q, --quiet                 Suppress the build output and print image ID on success
  --progress string           Set type of progress output (auto, plain, tty)
  --platform string           Set platform if server is multi-platform capable
  --label list                Set metadata for an image
  --network string            Set the networking mode for the RUN instructions
  --secret stringArray        Secret file to expose to the build
  --ssh stringArray           SSH agent socket or keys to expose to the build
  --target string             Set the target build stage to build
  --memory bytes              Memory limit for the build container
  --cpuset-cpus string        CPUs in which to allow execution
```

#### Example: Complete React Docker Build

```bash
# Step 1: Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Step 2: Create .dockerignore
cat > .dockerignore << EOF
node_modules
npm-debug.log
.git
.env
dist
EOF

# Step 3: Build the image
docker build -t react-docker:latest .

# Step 4: Verify the image
docker images | grep react-docker

# Step 5: Run the container
docker run -p 3000:3000 react-docker
```

This comprehensive breakdown covers every aspect of the `docker build` command!

### Image Tags and Versioning

Tags are labels that identify different versions or variants of an image:

```bash
# Tag format: [registry/][username/]name[:tag]
docker pull nginx:1.21
docker pull nginx:latest
docker pull myregistry.com/user/app:v1.2.3
```

**Common tagging strategies:**

- `latest` - Default tag (usually the most recent)
- Version numbers: `1.0`, `1.2.3`, `v2.1.0`
- Git commit SHA: `abc123def`
- Environment: `dev`, `staging`, `prod`

### Managing Images

**List all images:**

```bash
# List all images
docker images

# List images with specific format
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Filter images
docker images nginx
docker images --filter "dangling=true"
```

**Inspect an image:**

```bash
# View detailed information about an image
docker inspect nginx:latest

# View image history (layers)
docker history nginx:latest
```

**Remove images:**

```bash
# Remove a specific image
docker rmi nginx:1.21

# Remove by image ID
docker rmi abc123def456

# Remove multiple images
docker rmi image1 image2 image3

# Remove all unused images
docker image prune

# Remove all images (use with caution!)
docker rmi $(docker images -q)
```

**Tag an existing image:**

```bash
# Create a new tag for an existing image
docker tag nginx:latest my-nginx:v1.0

# Tag for pushing to a registry
docker tag my-app:latest username/my-app:1.0
```

### Image Registries

A registry is a storage and distribution system for Docker images:

**Public Registries:**

- **Docker Hub** (hub.docker.com) - Default, free public registry
- **GitHub Container Registry** (ghcr.io)
- **Google Container Registry** (gcr.io)
- **Amazon ECR** (amazonaws.com)

**Private Registries:**

- Self-hosted Docker Registry
- Cloud provider registries (AWS ECR, Azure ACR, GCP GCR)

**Working with registries:**

```bash
# Login to Docker Hub
docker login

# Login to a specific registry
docker login registry.example.com

# Push an image to registry
docker push username/my-app:1.0

# Pull from a private registry
docker pull registry.example.com/private/image:tag

# Logout
docker logout
```

### Image Best Practices

1. **Use specific tags** instead of `latest` in production
2. **Keep images small** - Use Alpine-based images when possible
3. **Use multi-stage builds** for smaller final images
4. **Order Dockerfile instructions** from least to most frequently changing
5. **Use `.dockerignore`** to exclude unnecessary files
6. **Scan images** for security vulnerabilities
7. **Tag images meaningfully** with version numbers or commit SHAs

### Multi-Stage Builds

Multi-stage builds allow you to use multiple `FROM` statements in a Dockerfile, keeping the final image small:

```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
CMD ["node", "dist/index.js"]
```

This creates a smaller final image by only including the built artifacts, not the build tools.

### Common Image Commands Cheat Sheet

```bash
# Pull images
docker pull <image>:<tag>

# Build images
docker build -t <name>:<tag> .

# List images
docker images
docker image ls

# Inspect images
docker inspect <image>
docker history <image>

# Tag images
docker tag <source> <target>

# Remove images
docker rmi <image>
docker image rm <image>
docker image prune

# Push images
docker push <image>:<tag>

# Save/Load images (for backup/transfer)
docker save -o image.tar <image>
docker load -i image.tar
```

---

## Docker Containers

A Docker container is a **running instance** of a Docker image. While an image is a read-only template, a container is a live, isolated environment where your application runs. Containers are lightweight, portable, and can be started, stopped, moved, and deleted easily.

### Container vs Image

Think of the relationship like this:

- **Image** = Blueprint or recipe
- **Container** = The actual house built from that blueprint

```
Image (Read-only)          Container (Read-write)
┌─────────────┐           ┌─────────────┐
│   Layers   │    →      │   Running   │
│   (Static) │   run     │  (Dynamic)  │
└─────────────┘           └─────────────┘
```

### Container Lifecycle

🍽️ **Restaurant Analogy**: Think of a dish's journey from order to cleanup:

- **Created** = Order placed, dish prepared but not yet served
- **Running** = Dish is being served/eaten (active)
- **Paused** = Dish put aside temporarily (like keeping it warm)
- **Stopped** = Customer finished, dish cleared from table (but plate still exists)
- **Removed** = Plate washed and put away (deleted)

Containers go through several states during their lifecycle:

```
Created → Running → Paused → Stopped → Removed
   ↑         ↓         ↓         ↓
   └─────────┴─────────┴─────────┘
```

**Container States:**

- **Created**: Container created but not started
  - 🍽️ Dish prepared, ready to serve, but still in kitchen
- **Running**: Container is active and executing
  - 🍽️ Dish is on the table, customer is eating (application is running)
- **Paused**: Container execution is suspended
  - 🍽️ Dish temporarily set aside (like keeping it warm, but not actively being served)
- **Stopped**: Container is stopped but not removed
  - 🍽️ Customer finished, dish cleared, but plate still exists (can restart)
- **Removed**: Container deleted from system
  - 🍽️ Plate washed and put away - completely gone

### Running Containers

🍽️ **Restaurant Analogy**: Running a container is like **serving a dish to a customer**. You can serve it in different ways:

- **Foreground** = Customer eats at the table, you watch them eat
- **Detached** = Customer takes it to-go, you don't need to watch
- **Interactive** = Customer can customize or interact with the dish

**Basic container run:**

```bash
# Run a container from an image
docker run nginx

# ⚠️ IMPORTANT: For web apps, you need to expose ports!
# ❌ This won't be accessible: docker run react-docker
# ✅ This will work: docker run -p 3000:3000 react-docker

# Run with a specific name
docker run --name my-nginx nginx

# Run in detached mode (background)
docker run -d nginx

# Run and remove container when it stops
docker run --rm nginx

# Complete example: Run React app with port mapping
docker run -d -p 3000:3000 --name my-react-app react-docker
# Then access at: http://localhost:3000
```

> 💡 **Tip**: If your container runs a web application, you **must** use the `-p` flag to map ports, otherwise you won't be able to access it from your browser! See the [Port Mapping section](#run-with-port-mapping) below for detailed explanation.

**Run with port mapping:**

🍽️ **Restaurant Analogy**: Port mapping is like **table numbers and delivery addresses**:

- **Container port** = The **dish's internal serving method** (how the dish is prepared inside the container)
- **Host port** = The **table number** where customers can access it from outside
- `-p 8080:80` = "Serve the dish (prepared on internal method 80) to customers at table 8080"

**Why `docker run react-docker` won't work:**

When you run `docker run react-docker` without port mapping, the container is running, but you **can't access it from your local machine**! It's like a dish being prepared in the kitchen, but there's no table number for customers to find it.

**⚠️ TWO THINGS YOU NEED:**

1. **Port mapping** (`-p` flag): Maps container port to host port
2. **Host binding** (`--host` or `0.0.0.0`): Makes app accessible from outside container

**Both are required!** See the [Binding to 0.0.0.0 section](#-critical-binding-to-0000-in-scripts) below for details on host binding.

```bash
# ❌ This won't work - container runs but you can't access it 
docker run react-docker

# ✅ This works - maps container port 3000 to host port 3000
docker run -p 3000:3000 react-docker

# ✅ Or map to a different host port
docker run -p 8080:3000 react-docker  # Access via localhost:8080
```

**Understanding Port Mapping:**

Port mapping follows this format: `-p HOST_PORT:CONTAINER_PORT`

```
┌─────────────────────────────────────────┐
│         Your Local Machine               │
│  localhost:3000  ←─── You access here   │
│         │                                │
│         │ Port Mapping (-p 3000:3000)   │
│         ▼                                │
│  ┌──────────────────────────────┐      │
│  │    Docker Container           │      │
│  │    App running on :3000        │      │
│  └──────────────────────────────┘      │
└─────────────────────────────────────────┘
```

**Common Port Mapping Examples:**

```bash
# React app (typically runs on port 3000)
docker run -p 3000:3000 react-docker
# Access at: http://localhost:3000

# Node.js app on port 3000, but access via host port 8080
docker run -p 8080:3000 react-docker
# Access at: http://localhost:8080 (but app still runs on 3000 inside)

# Nginx web server (runs on port 80 inside container)
docker run -p 8080:80 nginx
# Access at: http://localhost:8080

# Multiple ports (web + API)
docker run -p 3000:3000 -p 5000:5000 my-app
# Web UI at: http://localhost:3000
# API at: http://localhost:5000

# Map to any available host port (Docker picks a random port)
docker run -p 3000 react-docker
# Docker assigns a random host port, check with: docker ps

# Map all exposed ports (uses EXPOSE in Dockerfile)
docker run -P react-docker
# Maps all ports declared with EXPOSE in Dockerfile
```

**How to Find What Port Your App Uses:**

**1. Check the Dockerfile:**

```dockerfile
# In your Dockerfile, look for:
EXPOSE 3000        # App runs on port 3000
# or
CMD ["npm", "start"]  # Check package.json for start script
```

**2. Check your application code:**

```javascript
// React app (usually in package.json or src/index.js)
"start": "react-scripts start"  // Defaults to port 3000

// Node.js/Express
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Python Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Port 5000
```

**3. Check container logs:**

```bash
# Run container and check logs
docker run react-docker
# Look for: "Server running on port 3000" or similar messages
```

**4. Inspect running container:**

```bash
# See what ports are exposed
docker port <container-name>
# Output: 3000/tcp -> 0.0.0.0:3000
```

**⚠️ CRITICAL: Binding to 0.0.0.0 in Scripts**

🍽️ **Restaurant Analogy**: Think of this like **opening the restaurant doors to all customers**, not just people already inside the kitchen! By default, many development servers only listen on `127.0.0.1` (localhost), which means they're only accessible from inside the container itself. You need to bind to `0.0.0.0` to make it accessible from outside the container.

**The Problem:**

Many development servers (React, Vite, Next.js, etc.) by default bind to `127.0.0.1` (localhost only). Inside a Docker container, this means the app is **only accessible from within the container**, not from your host machine, even if you map ports!

```bash
# ❌ This won't work - app binds to 127.0.0.1 (localhost only)
# Even with: docker run -p 3000:3000 react-docker
# You'll get "Connection refused" or can't access it
```

**The Solution: Use `--host` or `0.0.0.0`**

You need to configure your app to bind to `0.0.0.0` (all network interfaces) instead of `127.0.0.1` (localhost only).

**For React Apps (Create React App / react-scripts):**

**Option 1: Use HOST environment variable in Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# Set HOST to 0.0.0.0 to bind to all interfaces
ENV HOST=0.0.0.0
CMD ["npm", "start"]
```

**Option 2: Modify package.json script:**

```json
{
  "scripts": {
    "start": "react-scripts start",
    "start:docker": "HOST=0.0.0.0 react-scripts start"
  }
}
```

Then in Dockerfile:

```dockerfile
CMD ["npm", "run", "start:docker"]
```

**Option 3: Use .env file:**
Create `.env` file:

```
HOST=0.0.0.0
```

**For Vite Apps:**

**Option 1: Use --host flag:**

```json
{
  "scripts": {
    "dev": "vite --host",
    "preview": "vite preview --host"
  }
}
```

**Option 2: Configure vite.config.js:**

```javascript
export default {
  server: {
    host: "0.0.0.0", // Listen on all interfaces
    port: 3000,
  },
};
```

**Option 3: Use command line:**

```dockerfile
CMD ["npm", "run", "dev", "--", "--host"]
```

**For Next.js Apps:**

**Option 1: Use -H flag:**

```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0",
    "start": "next start -H 0.0.0.0"
  }
}
```

**Option 2: Configure next.config.js:**

```javascript
module.exports = {
  // For development
  // Already binds to 0.0.0.0 by default in Docker
};
```

**For Node.js/Express Apps:**

```javascript
// ❌ Wrong - only accessible from inside container
app.listen(3000, "127.0.0.1", () => {
  console.log("Server running");
});

// ✅ Correct - accessible from outside container
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on 0.0.0.0:3000");
});

// ✅ Also correct - binds to all interfaces by default
app.listen(3000, () => {
  console.log("Server running");
});
```

**For Python Flask:**

```python
# ❌ Wrong
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)

# ✅ Correct
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**Complete Example: React App with Proper Host Binding**

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Set host to 0.0.0.0 so it's accessible from outside container
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
```

**package.json:**

```json
{
  "name": "react-app",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-scripts": "5.0.1"
  }
}
```

**Build and run:**

```bash
# Build the image
docker build -t react-docker .

# Run with port mapping
docker run -p 3000:3000 react-docker

# Now accessible at: http://localhost:3000 ✅
```

**Alternative: Using --host flag directly in CMD:**

```dockerfile
# For Vite
CMD ["npm", "run", "dev", "--", "--host"]

# For Next.js
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
```

**Verifying It Works:**

```bash
# 1. Check container logs - should show binding to 0.0.0.0
docker logs <container-name>
# Look for: "Server running on http://0.0.0.0:3000"

# 2. Check inside container
docker exec <container-name> netstat -tuln
# Should show: 0.0.0.0:3000 (not 127.0.0.1:3000)

# 3. Test from host
curl http://localhost:3000
# Should get response (not connection refused)
```

**Common Mistakes:**

```dockerfile
# ❌ MISTAKE 1: Not setting HOST
CMD ["npm", "start"]  # Binds to 127.0.0.1 by default

# ❌ MISTAKE 2: Setting wrong host
ENV HOST=localhost  # Still only accessible from inside

# ✅ CORRECT: Bind to all interfaces
ENV HOST=0.0.0.0
CMD ["npm", "start"]
```

**Summary:**

| Framework       | Solution                      | Example                                   |
| --------------- | ----------------------------- | ----------------------------------------- |
| **React (CRA)** | `ENV HOST=0.0.0.0`            | `ENV HOST=0.0.0.0` in Dockerfile          |
| **Vite**        | `--host` flag                 | `vite --host` or `server.host: '0.0.0.0'` |
| **Next.js**     | `-H 0.0.0.0`                  | `next dev -H 0.0.0.0`                     |
| **Express**     | `app.listen(3000, '0.0.0.0')` | Bind to `0.0.0.0` in code                 |
| **Flask**       | `app.run(host='0.0.0.0')`     | Bind to `0.0.0.0` in code                 |

**Remember:**

- **Inside container**: App must bind to `0.0.0.0` (all interfaces)
- **Outside container**: Use `-p HOST_PORT:CONTAINER_PORT` to map ports
- **Both are required** for the app to be accessible from your host machine!

**Complete React Docker Example:**

```bash
# Step 1: Build the image
docker build -t react-docker .

# Step 2: Run with port mapping
docker run -p 3000:3000 react-docker

# Step 3: Access in browser
# Open: http://localhost:3000

# Step 4: Run in detached mode (background)
docker run -d -p 3000:3000 --name my-react-app react-docker

# Step 5: Check if it's running
docker ps
# You'll see: 0.0.0.0:3000->3000/tcp

# Step 6: Stop the container
docker stop my-react-app
```

**Port Mapping Options Explained:**

```bash
# Format: -p [HOST_IP:]HOST_PORT:CONTAINER_PORT[/PROTOCOL]

# Basic mapping (all interfaces)
docker run -p 3000:3000 react-docker
# Accessible from: localhost:3000, 127.0.0.1:3000, your-ip:3000

# Specific interface only
docker run -p 127.0.0.1:3000:3000 react-docker
# Only accessible from: localhost:3000 (not from other machines)

# Different host port
docker run -p 8080:3000 react-docker
# App runs on 3000 inside, but access via 8080 outside

# Specify protocol (TCP is default)
docker run -p 3000:3000/tcp react-docker
docker run -p 53:53/udp dns-server

# Range of ports
docker run -p 3000-3010:3000-3010 my-app
```

**Troubleshooting Port Issues:**

**Problem: "Port already in use"**

```bash
# Error: Bind for 0.0.0.0:3000 failed: port is already allocated

# Solution 1: Use a different host port
docker run -p 3001:3000 react-docker

# Solution 2: Find what's using the port
# Linux/Mac:
lsof -i :3000
# Windows:
netstat -ano | findstr :3000

# Solution 3: Stop the container using the port
docker ps
docker stop <container-id>
```

**Problem: "Can't access localhost:3000"**

This is often caused by the app binding to `127.0.0.1` instead of `0.0.0.0`. See the [Binding to 0.0.0.0 section](#-critical-binding-to-0000-in-scripts) above for detailed solutions.

```bash
# Check if container is running
docker ps

# Check if port is mapped correctly
docker port <container-name>

# Check container logs for errors
docker logs <container-name>

# ⚠️ MOST COMMON ISSUE: App not binding to 0.0.0.0
# Check what the app is binding to:
docker logs <container-name> | grep -i "listening\|running\|server"

# For React/Vite/Next.js: Make sure you use --host or HOST=0.0.0.0
# For Node.js/Express: Use app.listen(3000, '0.0.0.0')
# For Python Flask: Use app.run(host='0.0.0.0', port=5000)

# Verify the app is listening on 0.0.0.0 (not just 127.0.0.1)
# In your app code, use:
app.listen(0.0.0.0, 3000)  # ✅ Accessible from outside
# NOT:
app.listen(127.0.0.1, 3000)  # ❌ Only accessible from inside container
```

**Problem: "Connection refused"**

```bash
# 1. Check if the container is exposing the port in Dockerfile
# Add to Dockerfile:
EXPOSE 3000

# 2. Check if the app is running
docker logs <container-name>

# 3. ⚠️ MOST COMMON: App binding to wrong host
# The app must bind to 0.0.0.0, not 127.0.0.1
# For React: Add ENV HOST=0.0.0.0 in Dockerfile
# For Vite: Use --host flag or server.host: '0.0.0.0'
# For Express: Use app.listen(3000, '0.0.0.0')

# 4. Verify binding inside container
docker exec <container-name> netstat -tuln | grep 3000
# Should show: 0.0.0.0:3000 (not 127.0.0.1:3000)
```

**Best Practices for Port Mapping:**

1. **Always use `-p` flag** when you need to access the container from host
2. **Use `EXPOSE` in Dockerfile** to document which ports the app uses
3. **Map to same port** when possible: `-p 3000:3000` (easier to remember)
4. **Use different host ports** if conflict: `-p 8080:3000`
5. **Run in detached mode** for production: `docker run -d -p 3000:3000 react-docker`
6. **Name your containers** for easier management: `--name my-app`
7. **Check port conflicts** before running: `lsof -i :3000` or `netstat`

**Quick Reference:**

```bash
# React/Node.js app (port 3000)
docker run -p 3000:3000 react-docker

# Web server (port 80)
docker run -p 8080:80 nginx

# Database (port 5432)
docker run -p 5432:5432 postgres

# Multiple services
docker run -p 3000:3000 -p 5000:5000 my-app

# Background + named
docker run -d -p 3000:3000 --name my-app react-docker

# Check ports
docker ps
docker port <container-name>
```

**Run with environment variables:**

🍽️ **Restaurant Analogy**: Environment variables are like **customization instructions** for the dish:

- "Make it spicy" (NODE_ENV=production)
- "Add extra cheese" (DEBUG=true)
- "No onions" (LOG_LEVEL=error)
  Each dish (container) can have different customizations!

```bash
# Set a single environment variable
docker run -e NODE_ENV=production my-app

# Set multiple environment variables
docker run -e NODE_ENV=production -e DEBUG=true my-app

# Use an environment file
docker run --env-file .env my-app
```

**Run with volume mounting:**

🍽️ **Restaurant Analogy**: Volumes are like **shared storage** between the kitchen and dining area:

- **Bind mount** = A **direct connection** to a specific pantry (host directory)
- **Named volume** = A **shared storage box** that multiple dishes can access
- Data persists even after the dish (container) is finished!

```bash
# Mount a host directory to container
docker run -v /host/path:/container/path nginx

# Mount with read-only access
docker run -v /host/path:/container/path:ro nginx

# Use named volumes (covered in Volumes section)
docker run -v my-volume:/data nginx
```

### Container Modes

🍽️ **Restaurant Analogy**: Different ways to serve a dish:

**1. Foreground Mode (Default):**

- 🍽️ Like **dine-in service** - customer eats at the table, you watch and interact
- You see all the output (like watching the customer eat)
- You can stop it anytime (Ctrl+C = "Customer is done")

```bash
# Container runs in foreground, output visible
docker run nginx

# Press Ctrl+C to stop
```

**2. Detached Mode:**

- 🍽️ Like **takeout/to-go order** - customer takes the dish, you don't need to watch
- Dish runs in background (kitchen continues cooking)
- You get a receipt (container ID) to track it later

```bash
# Run in background with -d flag
docker run -d nginx

# Container runs in background, returns container ID
```

**3. Interactive Mode:**

- 🍽️ Like **customizable dish** - customer can interact, customize, and modify
- Customer can "talk to the chef" (access terminal inside container)
- Perfect for exploring or debugging

```bash
# Run interactively with terminal access
docker run -it ubuntu /bin/bash

# Flags:
# -i : Keep STDIN open (interactive) - "Customer can give instructions"
# -t : Allocate a pseudo-TTY (terminal) - "Give customer a way to communicate"
```

**4. Interactive + Detached:**

- 🍽️ Like **preparing a dish, then serving it later**
- Start the dish in kitchen (detached), then bring it to customer when ready (attach)

```bash
# Start detached, then attach later
docker run -d -it --name my-container ubuntu /bin/bash
docker attach my-container
```

### Managing Containers

**List containers with `docker ps`:**

🍽️ **Restaurant Analogy**: `docker ps` is like **checking the restaurant's order board** - it shows you what dishes (containers) are currently being prepared, served, or finished. It's your primary tool for monitoring what's happening in your Docker kitchen!

**Basic Usage:**

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a
# or
docker ps --all

# List only container IDs
docker ps -q
# or
docker ps --quiet
```

**Understanding the Output:**

When you run `docker ps`, you'll see output like this:

```
CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS        PORTS                    NAMES
a1b2c3d4e5f6   react-docker   "npm start"              2 hours ago    Up 2 hours   0.0.0.0:3000->3000/tcp   my-react-app
x9y8z7w6v5u4   nginx:latest   "/docker-entrypoint..."  1 day ago      Up 1 day      0.0.0.0:8080->80/tcp     web-server
```

**Column Breakdown:**

| Column           | Description                             | Restaurant Analogy                    |
| ---------------- | --------------------------------------- | ------------------------------------- |
| **CONTAINER ID** | Unique identifier (first 12 characters) | Dish order number                     |
| **IMAGE**        | Image used to create container          | Recipe used to make the dish          |
| **COMMAND**      | Command running in container            | Cooking method/instructions           |
| **CREATED**      | When container was created              | When order was placed                 |
| **STATUS**       | Current state (Up, Exited, etc.)        | Dish status (serving, finished, etc.) |
| **PORTS**        | Port mappings                           | Table numbers where dish is served    |
| **NAMES**        | Container name                          | Dish name/customer name               |

**Common Status Values:**

- **Up X minutes/hours** = Container is running
  - 🍽️ Dish is currently being served
- **Exited (0)** = Container stopped normally
  - 🍽️ Customer finished, dish cleared (normal completion)
- **Exited (1)** = Container stopped with error
  - 🍽️ Dish had a problem, couldn't be served properly
- **Restarting** = Container is restarting
  - 🍽️ Dish is being re-prepared
- **Paused** = Container is paused
  - 🍽️ Dish is on hold/warming

**Advanced Options:**

**1. Filter Containers:**

```bash
# Filter by status
docker ps --filter "status=running"
docker ps --filter "status=exited"
docker ps --filter "status=paused"

# Filter by name
docker ps --filter "name=react"
docker ps --filter "name=^my-"  # Names starting with "my-"

# Filter by image
docker ps --filter "ancestor=nginx"
docker ps --filter "ancestor=react-docker:latest"

# Filter by label
docker ps --filter "label=environment=production"
docker ps --filter "label=version"

# Filter by ID
docker ps --filter "id=a1b2c3d4e5f6"

# Multiple filters (AND logic)
docker ps --filter "status=running" --filter "ancestor=nginx"

# Filter by exit code
docker ps -a --filter "exited=0"  # Successfully exited
docker ps -a --filter "exited=1"  # Exited with error
```

**2. Format Output:**

```bash
# Custom format - show only specific columns
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"

# Show as JSON
docker ps --format "{{json .}}"

# Show specific fields
docker ps --format "{{.ID}} - {{.Names}} - {{.Status}}"

# Available format placeholders:
# {{.ID}}           - Container ID
# {{.Image}}        - Image name
# {{.Command}}      - Quoted command
# {{.CreatedAt}}    - Time when created
# {{.RunningFor}}   - Elapsed time since started
# {{.Ports}}        - Exposed ports
# {{.Status}}       - Container status
# {{.Size}}         - Container disk size
# {{.Names}}        - Container names
# {{.Labels}}       - All labels
# {{.Label "key"}}  - Specific label value
# {{.Mounts}}       - Names of volumes
# {{.Networks}}     - Names of networks

# Examples:
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
docker ps --format "{{.Names}}: {{.Status}}"
docker ps --format "ID: {{.ID}} | Name: {{.Names}} | Status: {{.Status}}"
```

**3. Limit Results:**

```bash
# Show only last N containers
docker ps -n 5
docker ps --last 5

# Show only latest container
docker ps -l
docker ps --latest
```

**4. Show Size Information:**

```bash
# Include size of containers
docker ps -s
docker ps --size

# Output includes SIZE column showing:
# - Size: Disk space used by writable layer
# - Virtual: Total disk space (read-only + writable)
```

**5. No Truncation:**

```bash
# Show full output (no truncation)
docker ps --no-trunc

# Useful when command or names are too long
```

**Practical Examples:**

**Example 1: Check what's running:**

```bash
# Quick check of running containers
docker ps

# More detailed with sizes
docker ps -s
```

**Example 2: Find specific container:**

```bash
# Find container by name
docker ps --filter "name=react"

# Find all nginx containers
docker ps --filter "ancestor=nginx"
```

**Example 3: Monitor container status:**

```bash
# Watch containers in real-time (requires watch command)
watch -n 1 docker ps

# Or use docker stats for resource monitoring
docker stats
```

**Example 4: Clean output for scripts:**

```bash
# Get only container IDs (useful for scripts)
docker ps -q

# Get container names
docker ps --format "{{.Names}}"

# Get container ID and name
docker ps --format "{{.ID}} {{.Names}}"
```

**Example 5: Check port mappings:**

```bash
# See what ports are mapped
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Or use docker port command
docker port <container-name>
```

**Example 6: Find stopped containers:**

```bash
# All stopped containers
docker ps -a --filter "status=exited"

# Containers that exited with errors
docker ps -a --filter "exited=1"
```

**Example 7: Custom formatted table:**

```bash
# Create a nice table view
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

# Or with colors (if supported)
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
```

**Combining Options:**

```bash
# Multiple filters with custom format
docker ps -a --filter "status=exited" --filter "ancestor=nginx" \
  --format "table {{.Names}}\t{{.Status}}\t{{.CreatedAt}}"

# Show size for running containers only
docker ps -s --filter "status=running"

# Latest container with full details
docker ps -l --no-trunc
```

**Common Use Cases:**

**1. Quick Status Check:**

```bash
docker ps
# See what's currently running
```

**2. Find Container Name/ID:**

```bash
docker ps --format "{{.ID}} {{.Names}}"
# Get ID and name for other commands
```

**3. Check Port Mappings:**

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
# See which ports are exposed
```

**4. Find Containers to Stop:**

```bash
docker ps -q
# Get IDs to stop: docker stop $(docker ps -q)
```

**5. Monitor Container Health:**

```bash
docker ps --filter "status=restarting"
# Find containers that keep restarting (might have issues)
```

**6. Clean Up:**

```bash
# Find stopped containers
docker ps -a --filter "status=exited"

# Remove all stopped containers
docker ps -a -q --filter "status=exited" | xargs docker rm
```

**Troubleshooting with docker ps:**

**Problem: Container not showing up:**

```bash
# Check if it's stopped
docker ps -a

# Check if it was removed
docker ps -a --filter "name=my-container"
```

**Problem: Container keeps restarting:**

```bash
# Find restarting containers
docker ps --filter "status=restarting"

# Check logs
docker logs <container-name>
```

**Problem: Can't find container:**

```bash
# Search by partial name
docker ps -a --filter "name=react"

# Search by image
docker ps -a --filter "ancestor=react-docker"
```

**Aliases and Shortcuts:**

You can create aliases for common `docker ps` commands:

```bash
# Add to ~/.bashrc or ~/.zshrc

# Short alias
alias dps='docker ps'

# Show all with format
alias dpsa='docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"'

# Show only names
alias dpsn='docker ps --format "{{.Names}}"'

# Show with sizes
alias dpss='docker ps -s'
```

**Complete Command Reference:**

```bash
docker ps [OPTIONS]

Options:
  -a, --all              Show all containers (default shows just running)
  -f, --filter filter    Filter output based on conditions provided
  --format string        Format output using a custom template
  -n, --last int         Show n last created containers (includes all states)
  -l, --latest           Show the latest created container (includes all states)
  --no-trunc             Don't truncate output
  -q, --quiet            Only display numeric IDs
  -s, --size             Display total file sizes
```

**Quick Reference Cheat Sheet:**

```bash
# Basic
docker ps                    # Running containers
docker ps -a                 # All containers
docker ps -q                 # Container IDs only

# Filtering
docker ps -f "status=running"
docker ps -f "name=my-app"
docker ps -f "ancestor=nginx"

# Formatting
docker ps --format "table {{.Names}}\t{{.Status}}"
docker ps --format "{{.ID}} {{.Names}}"

# Useful combinations
docker ps -a -s              # All with sizes
docker ps -l                 # Latest container
docker ps -n 5               # Last 5 containers
docker ps --no-trunc         # Full output
```

**Start/Stop containers:**

🍽️ **Restaurant Analogy**:

- **Start** = "Serve this dish to the customer" (bring prepared dish to table)
- **Stop** = "Customer finished, clear the table" (gracefully finish)
- **Kill** = "Emergency - remove dish immediately" (force stop)

```bash
# Start a stopped container
docker start container-name

# Start and attach
docker start -a container-name

# Start in detached mode
docker start -d container-name

# Stop a running container (graceful shutdown)
docker stop container-name

# Stop with timeout (default 10 seconds)
docker stop -t 5 container-name

# Force stop (kill immediately)
docker kill container-name
```

**Pause/Unpause containers:**

🍽️ **Restaurant Analogy**:

- **Pause** = "Put dish in warmer" (temporarily suspend, but keep ready)
- **Unpause** = "Bring dish back from warmer" (resume serving)

```bash
# Pause a running container
docker pause container-name

# Unpause a paused container
docker unpause container-name
```

**Restart containers:**

🍽️ **Restaurant Analogy**: Like **re-serving a dish** - customer wants the same dish again, so you prepare and serve it fresh.

```bash
# Restart a container
docker restart container-name

# Restart with timeout
docker restart -t 5 container-name
```

**Remove containers:**

🍽️ **Restaurant Analogy**: Like **washing and putting away plates** - the dish is done, clean up and free up space.

```bash
# Remove a stopped container
docker rm container-name

# Force remove a running container
docker rm -f container-name

# Remove multiple containers
docker rm container1 container2 container3

# Remove all stopped containers
docker container prune

# Remove all containers (use with caution!)
docker rm $(docker ps -aq)
```

### Container Information

**Inspect container:**

```bash
# View detailed container information
docker inspect container-name

# View specific information
docker inspect -f '{{.NetworkSettings.IPAddress}}' container-name
docker inspect -f '{{.State.Status}}' container-name

# View container configuration
docker inspect --format='{{json .Config}}' container-name
```

**View container logs:**

```bash
# View logs
docker logs container-name

# Follow logs (like tail -f)
docker logs -f container-name

# Show last N lines
docker logs --tail 100 container-name

# Show logs with timestamps
docker logs -t container-name

# Show logs since a specific time
docker logs --since 2024-01-01T00:00:00 container-name
```

**View container stats:**

```bash
# Real-time container statistics
docker stats

# Stats for specific containers
docker stats container1 container2

# Show stats without streaming
docker stats --no-stream
```

### Executing Commands in Running Containers

🍽️ **Restaurant Analogy**: Like **asking the chef to add something to an already-served dish** - the dish (container) is already running, but you want to modify or check something inside it.

**Execute a command in a running container:**

```bash
# Run a command in a running container
docker exec container-name ls -la

# Execute interactively
docker exec -it container-name /bin/bash

# Execute as a specific user
docker exec -u root container-name whoami

# Execute in a specific working directory
docker exec -w /app container-name pwd
```

**Common use cases:**

```bash
# Access shell in running container
docker exec -it my-container /bin/bash

# Run a script
docker exec my-container /app/script.sh

# Check environment variables
docker exec my-container env

# Install a package
docker exec -it my-container apt-get install vim
```

### Copying Files

🍽️ **Restaurant Analogy**: Like **transferring ingredients or finished dishes** between the kitchen (host) and serving area (container).

**Copy files from host to container:**

```bash
# Copy a file
docker cp /host/file.txt container-name:/container/path/

# Copy a directory
docker cp /host/directory container-name:/container/path/

# Copy with different name
docker cp file.txt container-name:/container/new-name.txt
```

**Copy files from container to host:**

```bash
# Copy a file
docker cp container-name:/container/file.txt /host/path/

# Copy a directory
docker cp container-name:/container/directory /host/path/
```

### Resource Limits

🍽️ **Restaurant Analogy**: Like **limiting how much kitchen resources a dish can use**:

- **CPU limits** = "This dish can only use 50% of one chef's time"
- **Memory limits** = "This dish can only use 512MB of storage space"
- Prevents one dish from consuming all kitchen resources!

**CPU limits:**

```bash
# Limit CPU usage (0.5 = 50% of one CPU)
docker run --cpus="0.5" nginx

# Limit to specific CPUs
docker run --cpuset-cpus="0,1" nginx
```

**Memory limits:**

```bash
# Limit memory to 512MB
docker run -m 512m nginx

# Limit memory and swap
docker run -m 512m --memory-swap 1g nginx
```

**Other resource limits:**

```bash
# Limit device I/O
docker run --device-read-bps /dev/sda:1mb nginx

# Set ulimits
docker run --ulimit nofile=1024:1024 nginx
```

### Container Networking Basics

🍽️ **Restaurant Analogy**: Networking is like **how dishes move between kitchen, tables, and delivery**:

- **Bridge network** = Standard table service (default)
- **Host network** = Direct kitchen access (shares host network)
- **None network** = Isolated dish, no communication

_(More details in Docker Networks section)_

**Network modes:**

```bash
# Use host network (shares host's network stack)
docker run --network host nginx

# Use bridge network (default)
docker run --network bridge nginx

# Use none network (no networking)
docker run --network none nginx

# Connect to a specific network
docker run --network my-network nginx
```

_(More details in Docker Networks section)_

### Container Health Checks

🍽️ **Restaurant Analogy**: Health checks are like **checking if a dish is still good to serve** - periodically verify the dish (container) is still fresh and ready, not spoiled.

**Define health check in Dockerfile:**

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

**Run with health check:**

```bash
# Override health check
docker run --health-cmd="curl -f http://localhost || exit 1" \
           --health-interval=30s \
           --health-timeout=3s \
           --health-retries=3 \
           nginx
```

**Check health status:**

```bash
# View health status
docker inspect --format='{{.State.Health.Status}}' container-name
```

### Container Best Practices

1. **Use specific image tags** instead of `latest` in production
2. **Name your containers** for easier management (`--name`)
3. **Use `--rm` flag** for one-off containers to auto-cleanup
4. **Set resource limits** to prevent containers from consuming all resources
5. **Use health checks** for production containers
6. **Don't store data in containers** - use volumes instead
7. **One process per container** - follow single responsibility principle
8. **Use environment variables** for configuration
9. **Keep containers stateless** when possible
10. **Monitor container logs** and set up log rotation

### Common Container Commands Cheat Sheet

```bash
# Run containers
docker run [options] image [command]
docker run -d image                    # Detached
docker run -it image /bin/bash         # Interactive
docker run -p host:container image     # Port mapping
docker run -v host:container image     # Volume mount
docker run -e VAR=value image          # Environment variable

# Container management
docker ps                              # List running
docker ps -a                           # List all
docker start container                 # Start
docker stop container                  # Stop
docker restart container               # Restart
docker pause container                 # Pause
docker unpause container               # Unpause
docker rm container                    # Remove
docker rm -f container                 # Force remove

# Container information
docker inspect container               # Detailed info
docker logs container                  # View logs
docker logs -f container               # Follow logs
docker stats                           # Resource usage
docker top container                   # Running processes

# Execute commands
docker exec container command          # Run command
docker exec -it container /bin/bash    # Interactive shell

# Copy files
docker cp host/file container:/path    # Host to container
docker cp container:/path host/file    # Container to host
```

---

## Docker Volumes

_[This section will be expanded in the next iteration]_

---

## Docker Networks

_[This section will be expanded in the next iteration]_

---

## Docker Context

_[This section will be expanded in the next iteration]_

---

## Docker Compose

_[This section will be expanded in the next iteration]_

---

## Best Practices

_[This section will be expanded in the next iteration]_

---

_Last updated: [Date will be updated as we progress]_
