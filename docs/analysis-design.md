# 1 Analysis and Design

## 1.1 Analysis

This section outlines the analytical process conducted to understand the problem domain, define the system requirements, and structure the domain model according to Domain-Driven Design (DDD) principles.

### 1.1.1 Problem Analysis

#### The Context

Students at the University of Bologna often need a space to study as libraries are often full (or far way) 
or there is a need for spaces where they can work in groups without having to be silent.
Currently, there is no centralized, real-time method to verify if a classroom 
(laboratory or lecture hall) is free and available for individual or group study 
during these gaps.

#### The Problem Statement

The current ecosystem presents several critical issues:
1.  **Data Fragmentation:** Schedule information is scattered across courses'
    and/or teachers' web portals, making it difficult to 
    gather information about rooms' occupancy.
2.  **Lack of Real-Time Updates:** Official schedules do 
    not account for last-minute unforeseen events (e.g. 
    seminaries, SPRITe events).
3.  **Inefficient Resource Usage:** Students whom randomly search for a spot,
    often are evicted from a room because a lecture they 
    were unaware of is about to start.

#### Proposed Solution
AlmaSpot is a system that aggregates official data via automated workers, 
empowers administrators to manage exceptions manually, 
and provides students with an intuitive interface to find free rooms and receive 
proactive push notifications.

#### Actors
The system identifies two distinct roles:

| Actor | Role | Responsibilities & Goals                                                                                                           |
| :--- | :--- |:-----------------------------------------------------------------------------------------------------------------------------------|
| **Student** | Passive/Reactive | Wants to find an immediate study spot based on location and time. Needs to be notified before a room becomes occupied.             |
| **Admin** | Active/Manager | Responsible for the accuracy of availability data. Needs to override automatic schedules in case of emergencies or special events. |

### 1.1.2 Requirements Analysis

This section details the specific requirements derived from the problem analysis, categorized by domain granularity.

**Coarse-Grained Domain Requirements**

These high-level requirements define the boundaries of the system's microservices:

1.  **Schedule Acquisition (Ingestion):** The system must autonomously acquire heterogeneous schedule data from university sources (Open Data/Scrapers) and normalize it into a consistent format.
2.  **Availability Calculation:** The system must determine the status of a resource in real-time by intersecting official events, physical room constraints, and manual administrative blocks.
3.  **Administrative Override:** The system must allow authorized operators (Admins) to manually overwrite a room's status, with these manual inputs taking precedence over automatic data.
4.  **Smart Discovery (AI):** The system must support natural language queries (e.g., "Room for 4 people now") to lower the entry barrier for students.
5.  **Proactive Notification:** The system must shift from a "pull" model to a "push" model, notifying subscribed users regarding imminent state changes.

**Functional Requirements**
* 1: The system shall scrape Unibo Open Data periodically (batch process).
* 2: Users shall be able to filter rooms by campus, time, and capacity.
* 3: Users shall be able to "subscribe" to a room to receive alerts.
* 4: Admins shall be able to login and set a room status to "Closed" or "Force Free".
* 5: The system shall parse natural language search queries using an LLM.

**Non-Functional Requirements**
* 1 (Polyglot Architecture): The backend must utilize at least two distinct technology stacks 
  (Go for data ingestion, Node.js for API/Web).
* 2 (DevOps): The application must be containerized via Docker and orchestratable via Docker 
  Compose.
* 3 (Responsiveness): The frontend must be a Progressive Web App (PWA) optimized for mobile devices.
* 4 (Real-time): State changes (e.g., Admin override) must be propagated to connected clients 
  via WebSockets/Push within seconds.

### 1.1.3 Domain Model

This section defines the conceptual model of the business domain, establishing the **Ubiquitous Language** shared between developers and domain experts.

**Ubiquitous Language**

| Term | Definition |
| :--- | :--- |
| **Room** | A physical spatial unit identified by a code, campus, and capacity. Can be in states: *Free*, *Occupied*, *Closed*. |
| **Event** | A planned academic activity (Lecture, Exam) imported from the official schedule that occupies a *Room* during a specific *Time Slot*. |
| **Time Slot** | A specific start-time and end-time interval. |
| **Availability Gap** | A calculated time interval between two consecutive *Events* during which a *Room* is available for student use. |
| **Override** | A manual priority command issued by an Admin that forces a *Room* into a specific state, ignoring conflicting *Events*. |
| **Subscription** | A link between a *Student* and a *Room*, enabling the delivery of *Push Alerts*. |

**Bounded Contexts & Context Map**
The domain is partitioned into specific contexts to ensure loose coupling, mapped to the microservices architecture:

1.  **Scheduling Context:**
    * *Responsibility:* Managing the "Official Truth" of university schedules.
    * *Service:* Worker Service (Golang).
2.  **Availability & Booking Context:**
    * *Responsibility:* Merging schedules with Overrides to determine the "Effective Truth" and serving users.
    * *Service:* API Core (Node.js).
3.  **Intelligence Context:**
    * *Responsibility:* Interpreting user intent via AI.
    * *Service:* AI Module (Node.js Adapter).

**Entity-Relationship Overview**
* A **Room** has many **Events**.
* An **Override** belongs to a **Room** and is created by an **Admin**.
* A **Student** can have multiple **Subscriptions** to different **Rooms**.
* **Availability** is not stored but calculated on-the-fly: `Availability = (Total Time) - (Events) - (Overrides)`.

## 1.2 Design