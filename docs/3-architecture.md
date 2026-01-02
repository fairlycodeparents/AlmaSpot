# 3. Architecture

#### Index

1. [Analysis](1-analysis.md)
2. [Design](2-design.md)
3. [Architecture](3-architecture.md)
   - 3.1 [Physical architecture](#31-physical-architecture)
   - 3.2 [Logical architecture](#32-logical-architecture)
4. [Implementation](4-implementation.md)
5. [DevOps](5-devops.md)
6. [License](6-license.md)

## 3.1. Physical architecture

The system follows a **Client-Server** physical architecture, where the two main components are strictly decoupled
and communicate exclusively via REST APIs and WebSockets.

- **Client (Frontend):** Developed as a _Progressive Web App (PWA)_ using Vue.js, it runs within the user's browser
  and is responsible solely for the presentation logic and user interaction.
- **Server (Backend):** Developed with Node.js and Go, it hosts the business logic, domain rules, and data persistence
  mechanisms.

The entire solution is containerized using **Docker** and orchestrated via **Docker Compose**. This approach ensures
consistency between development and production environments, satisfying the portability requirements.

## 3.2. Logical architecture

Within each specific Bounded Context, we applied **Hexagonal Architecture** principles to protect the Domain Model
from technological coupling. Each module is divided into three concentric layers:

1. **Domain layer:** Contains _Entities_, _Value Objects_, and business invariants. It is entirely free of
   external dependencies. This is where the interfaces (_Ports_) for external services are defined.
2. **Application layer:** Contains _Domain Services_ that implement the use cases. It coordinates the data flow
   using domain entities without knowing the details of the implementation.
3. **Infrastructure layer:** Contains the concrete implementations of the interfaces defined in the
   domain. This includes controllers, _Repositories_, and clients for third-party services.

//TODO: component diagram
