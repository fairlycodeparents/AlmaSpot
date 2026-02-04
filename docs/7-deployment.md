# 7. Deployment

#### Index

1. [Analysis](1-analysis.md)
2. [Design](2-design.md)
3. [Architecture](3-architecture.md)
4. [Implementation](4-implementation.md)
5. [DevOps](5-devops.md)
6. [License](6-license.md)
7. [Deployment](7-deployment.md)
   - 7.1. [Container Architecture](#71-container-architecture)
   - 7.2. [Client Build](#72-client-build)
   - 7.3. [Setup and Execution](#73-setup-and-execution)

The application deployment adopts a **Container-Based** approach, ensuring isolation, reproducibility, and
independence from the host environment. The entire architecture is defined declaratively via a `docker-compose.prod.
yml` file, which orchestrates service execution within a dedicated virtual network (`almaspot-network`).

## 7.1. Container Architecture

The configuration includes the following services:

- **mongo**: the MongoDB NoSQL database (version 6.0), configured with a persistent volume (`mongo_data`) to ensure
  data durability. It includes a native _healthcheck_ that prevents the backend from starting until the database is
  fully available.
- **server**: the Node.js backend. The application is distributed via an immutable Docker image, automatically
  pulled from the project's _Container Registry_ (`ghcr.io`). This ensures that the running code is identical to the code validated by the Continuous Integration pipeline. Configuration occurs exclusively at _runtime_ via environment variables.
- **client**: the Vue.js frontend. In this environment, the application does not use the development server but is
  served via an optimized **Nginx** container. The container performs a dual function:
  1. _Web Server_: serves the static files of the compiled application.
  2. _Reverse Proxy_: forwards API calls (routes starting with `/api`) directly to the server container on port 3000,
     handling routing internally and avoiding CORS issues.
- **unibo-provider**: the Go service, also pulled from the container registry. It is responsible for fetching and
  normalizing data from the university's Open Data.

## 7.2. Client Build

For the client, a **Multi-Stage Build** strategy defined in the Dockerfile was adopted:

1. **Build**: a Node.js image compiles the Vue source code, injecting necessary environment variables (such as the
   VAPID public key and the relative API URL).
2. **Serve**: the compiled artifacts are copied into a lightweight Nginx image (Alpine Linux), discarding all source
   code and development dependencies (`node_modules`), drastically reducing the final size.

## 7.3. Setup and Execution

System deployment requires Docker and Docker Compose installed on the host machine.

1. **Clone the repository**: download the project source code by cloning the GitHub repository:
   > `git clone https://github.com/fairlycodeparents/AlmaSpot.git`
2. **Configuration**: create a `.env` file in the project root (based on the `.env.example` template) containing
   database credentials, VAPID cryptographic keys, the provider URL, and the Gemini API key.
3. **Startup**: the following command pulls the latest image versions for the backend, builds the optimized frontend,
   and starts the entire stack in the background:
   > `docker compose -f docker-compose.prod.yml up -d`
4. **Access**: once initialization is complete, the entire platform is accessible to the end user at
   [http://localhost:80](http://localhost:80).
