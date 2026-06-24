# Memoir: The Complete Journey, Architecture & Future Strategy

## 1. Project Genesis & Zero-to-One Setup
Memoir started as an ambitious idea to solve organizational knowledge fragmentation. We built it entirely from scratch, step-by-step.

### The Foundation
*   **Initialization:** We started with an empty folder, initialized version control (`git init`), and linked it to a remote GitHub repository.
*   **Environment Setup:** We created a Python virtual environment (`venv`), ignored it via `.gitignore`, and installed the core backend dependencies: `fastapi`, `uvicorn`, `neo4j`, `qdrant-client`, `psycopg2`, and `google-generativeai`.
*   **Scaffolding the Architecture:** We deliberately organized the codebase into modular, scalable directories: 
    *   `/api` (FastAPI backend endpoints)
    *   `/connectors` (Scripts to fetch external data)
    *   `/db` (Database connections and setup scripts)
    *   `/workers` (Data processing and AI resolution logic)
    *   `/frontend` (The user interface)
*   **Secrets Management:** Set up a `.env` file to securely manage API keys (Discord, Notion, Gemini/OpenAI) and database credentials.

---

## 2. Setting Up the Infrastructure (The Tri-Store DB)
Instead of relying on expensive cloud databases for development, we orchestrated a robust local environment using Docker Compose to run three distinct databases, each serving a specific purpose.

1.  **PostgreSQL (Relational - The Ledger):** 
    *   *Setup:* Spun up a Postgres container. Wrote `db/postgres.py` to initialize tables.
    *   *Purpose:* Stores the raw, unmodified data fetched from APIs. If the Graph or Vector DB is ever corrupted, we can replay the pipeline from Postgres.
2.  **Neo4j (Graph - The Relationships):**
    *   *Setup:* Deployed a Neo4j container with APOC plugins enabled.
    *   *Purpose:* Stores Nodes (Actors, Documents, Concepts, Messages) and Edges (`AUTHORED`, `RELATES_TO`). This allows complex traversals (e.g., "Find concepts related to the author of this message").
3.  **Qdrant (Vector - The Semantic Engine):**
    *   *Setup:* Deployed a local Qdrant container.
    *   *Purpose:* Stores high-dimensional numerical arrays (embeddings) of text to enable fuzzy semantic search.

---

## 3. Building the Connectors (Ingestion Layer)
We needed to get raw data into the system. We built custom API wrappers for our target platforms.

*   **Discord Connector (`connectors/discord.py`):** We created a Discord Developer Application, invited the bot to a server, enabled the "Message Content Intent", and wrote logic to fetch channel history.
*   **Slack Connector (`connectors/slack.py`):** Created a Slack App with Bot User OAuth Tokens, enabled necessary scopes (`channels:history`, `groups:history`), and fetched conversational context from channels and threads.
*   **GitHub Connector (`connectors/github.py`):** Configured a GitHub App/Personal Access Token to pull pull requests, issues, and commit messages, enabling the graph to link code changes to project discussions.
*   **Notion Connector (`connectors/notion.py`):** We created a Notion Internal Integration, shared pages with the integration, and wrote recursive functions to fetch pages and their deeply nested blocks.
*   *Normalization:* All connectors format the chaotic API responses into a standard `Event` dictionary and save them safely to PostgreSQL.

---

## 4. Building the AI Workers (The Brain)
Once data was in Postgres, we built the pipeline to process it.

*   **Resolution Worker (`workers/resolution.py`):** The core intelligence of Memoir. It pulls raw events from Postgres, batches them, and feeds them to an LLM (Gemini/OpenAI) with a highly strict prompt. The LLM extracts structured JSON:
    *   *Actors:* It performs Identity Resolution (e.g., mapping Discord's "Mayank" and Notion's "m.tiwari" to the same global "Person").
    *   *Entities & Concepts.*
    *   *Relationships.*
*   **Graph Worker (`workers/graph.py`):** Takes the JSON from the Resolution worker and executes Cypher queries against Neo4j to dynamically create and link Nodes and Relationships.
*   **Embedding Worker (`workers/embeddings.py`):** Takes the text of the messages/pages, passes it through an embedding model, and saves the vectors into Qdrant, explicitly linking the Qdrant Vector ID to the Neo4j Node ID.
*   **The Pipeline Orchestrator (`run_pipeline.py`):** A master script that coordinates everything: wiping old data, triggering Discord/Slack/GitHub/Notion ingestion, running the LLM resolution, updating the graph, and processing embeddings.

---

## 5. The Graph RAG API & Frontend
With the data structured and embedded, we built the interface to query it.

*   **FastAPI Backend (`api/query.py`):** We implemented the Graph RAG (Retrieval-Augmented Generation) flow:
    1.  User sends a question ("Who broke the caching system?").
    2.  The API embeds the question and searches Qdrant for semantic matches.
    3.  It takes the matching Vector IDs, goes to Neo4j, and traverses the graph to find the Authors and related Concepts.
    4.  It packages all this context into a massive prompt and asks the LLM to synthesize a final, human-readable answer.
*   **The Frontend (`frontend/`):** We initialized a modern Next.js/Vite React application. We added TailwindCSS for styling and GSAP/Framer Motion for premium animations. The UI provides a clean search bar, displays the synthesized answer, and lists the exact citations (linking back to the raw Discord/Slack/GitHub/Notion data).

---

## 6. The Future: Scaling & Business Strategy
To evolve Memoir from an MVP to an enterprise-grade B2B SaaS product with a 90% profit margin, we will execute the following roadmap:

### 1. One-Click Integrations (UX & Onboarding)
We will replace manual bot creation with an **OAuth2 Connection Flow**.
*   Users will click "Connect Discord", "Connect Slack", "Connect GitHub", or "Connect Notion".
*   They authorize the app in their browser.
*   Memoir automatically receives tokens and auto-discovers channels/databases, presenting them in a clean UI with toggle switches for the admin to choose what to sync.

### 2. Real-World Architecture & Infrastructure
Moving from a synchronous script to a resilient, asynchronous cloud architecture.
*   **Event-Driven Ingestion:** Implement Webhooks (listen for real-time events) and Delta Syncs (poll for changes since `last_synced_at`) instead of full batch pulls.
*   **Message Queues:** Introduce RabbitMQ, Kafka, or Redis+Celery. Incoming events go into a queue, and distributed background workers process them. This prevents 3rd-party API rate limits from dropping data.
*   **Multi-Tenancy:** Append a `tenant_id` to every Neo4j node/relationship and partition the Qdrant Vector DB to ensure strict data isolation between client companies.

### 3. Financials: Maintaining a 90%+ Profit Margin
Compute and LLM costs must be ruthlessly optimized.
*   **LLM Cost Optimization:** Use cheap, lightning-fast models (Gemini Flash, Claude Haiku, Llama 3) for 95% of pipeline tasks (entity extraction). Reserve expensive, high-reasoning models (GPT-4o, Gemini 1.5 Pro) *only* for the final user query synthesis.
*   **Semantic Caching:** Cache query embeddings using Redis. If multiple users ask similar questions, return the cached answer instead of hitting the LLM API again.
*   **Pricing Strategy:** Implement high-ticket B2B pricing based on value and data volume (e.g., $299/mo for Startup Tier, $899/mo for Growth Tier). By aggressively optimizing pipeline costs, an $899/mo client might only cost $50/mo in compute/APIs.

### 4. Go-To-Market (GTM) & Client Acquisition
*   **Target Audience:** Remote-first Tech Companies (Series A - C) and Agencies that suffer from extreme knowledge fragmentation.
*   **Acquisition Channels:** 
    *   *Founder-Led Outbound:* Target CTOs and VPs of Engineering on LinkedIn.
    *   *The "Single Player" Wedge:* Pitch Engineering Managers to use it as a personal tool. Once they love it, they expense it for the whole team.
    *   *Content Marketing & Dev Communities:* Publish deep-dive technical articles on Graph RAG and launch on Product Hunt / Hacker News.
