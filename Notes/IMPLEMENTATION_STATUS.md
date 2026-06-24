# Memoir MVP Implementation Status

## ✅ What Has Been Implemented

The core backend scaffolding and major components from the MVP build plan have been implemented:

### **Infrastructure & Setup**
- Created the full project folder structure.
- Created `docker-compose.yml` for local Postgres and Redis.
- Populated `requirements.txt` with necessary dependencies.
- Created `.env.example` with required variables.
- Created the Next.js frontend scaffolding with `package.json`, `index.js`, and a `DecisionCard` component.

### **Database & Models**
- Created `db/migrations/001_initial.sql` which sets up the Postgres schema: `raw_events`, `persons`, `event_links`, and enables the `pgvector` extension for the `embeddings` table.
- Added `db/postgres.py` to handle all SQL queries (inserts, batching, status updates).
- Added `db/neo4j.py` to manage connection and graph mutations (`MERGE` logic for nodes and edges).

### **Data Connectors**
- Created `connectors/base.py` defining the `RawEvent` schema and interface.
- Created `connectors/github.py` using `PyGithub` to fetch Pull Requests, Issues, and Commits with built-in rate-limit handling.

### **Background Workers (Celery)**
- Configured Celery and Redis in `workers/celery_app.py`.
- **Ingestion (`workers/ingestion.py`)**: Task to read from GitHub and write to `raw_events` in batches.
- **Entity Resolution (`workers/resolution.py`)**: Tasks to link commit authors to GitHub user profiles (`build_persons_table`) and parse `#123` references to link events together (`link_events`).
- **Graph Writer (`workers/graph.py`)**: Task to read unwritten events from Postgres and map them to Neo4j Nodes and Edges, including inferring microservice relationships from modified file paths.
- **Embeddings (`workers/embeddings.py`)**: Task to batch generate embeddings using OpenAI API for new events.

### **Query API**
- Defined request and response schemas in `api/schemas.py`.
- Implemented `/query`, `/stats`, and `/ingest` endpoints in `api/main.py`.
- Wrote the full search pipeline in `api/query.py`:
  1. **Vector Search:** Converts query to vector and performs cosine similarity search in Postgres (`pgvector`).
  2. **Graph Expand:** Fetches 1-hop neighbor context from Neo4j for retrieved events.
  3. **Synthesis:** Passes context to Anthropic's Claude to generate a clean JSON answer with decision trail.


---

## ⏳ What Is Yet To Be Implemented

While the core functionality is built, the following items from the PRD still need to be completed to fully finish the MVP:

1. **Unit and Integration Tests (`tests/`)**
   - Write tests for the `GitHubConnector`.
   - Write tests for the `resolution` logic.
   - Write end-to-end tests for the `/query` endpoint.

2. **Chaining the Celery Tasks**
   - The Celery tasks currently have the `.send_task(...)` triggers commented out at the end of their execution. They need to be un-commented and tested to form a fully automated pipeline (Ingest -> Resolve -> Graph -> Embed).

3. **Frontend Polish (`frontend/`)**
   - The Next.js UI is currently a minimal functional boilerplate. It needs CSS styling and polishing to match the UX standards required for a demo.
   - Deploying the frontend to Vercel and linking it to the backend.

4. **Production Deployment**
   - Setting up Railway for hosting the FastAPI backend and Celery workers.
   - Automating the execution of the ingestion task for the final test repository (`fastapi/fastapi`).

5. **Advanced Reranking (Optional MVP Enhancement)**
   - The PRD mentions a "rerank" function based on recency and graph connectivity before passing to Claude. Right now, it just passes the top results from the vector search directly.

---

## 💡 Free Alternatives for Embeddings (Replacing OpenAI)

If you want to avoid OpenAI's API costs entirely during development or in production, you can replace `text-embedding-3-small` in `workers/embeddings.py` and `api/query.py` with one of the following free alternatives:

### 1. Local/Open-Source: `sentence-transformers` (Hugging Face)
You can run an embedding model entirely locally using the `sentence-transformers` Python library. It's completely free and runs on your own hardware.
*   **Model:** `all-MiniLM-L6-v2` or `BAAI/bge-small-en-v1.5`
*   **Pros:** 100% free, unlimited requests, data never leaves your machine.
*   **Cons:** Requires slightly more local compute (CPU/RAM). Vector dimension changes (e.g., 384 instead of 1536), so the Postgres `vector(1536)` column would need to be updated to `vector(384)`.
*   **Implementation:**
    ```python
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(texts_to_embed)
    ```

### 2. Local via Ollama
If you have Ollama installed locally, you can serve embeddings through its local API.
*   **Model:** `nomic-embed-text`
*   **Pros:** Easy to set up if Ollama is running, completely free.
*   **Cons:** Requires Ollama to be running on the host machine.
*   **Implementation:**
    ```python
    import requests
    response = requests.post('http://localhost:11434/api/embeddings', json={
        "model": "nomic-embed-text", "prompt": text
    })
    embedding = response.json()['embedding']
    ```

### 3. API-Based: Cohere Free Tier
Cohere provides an excellent embedding API with a very generous free tier for developers.
*   **Model:** `embed-english-v3.0`
*   **Pros:** Very high quality (often comparable to OpenAI), no local hardware required.
*   **Cons:** Rate limits apply on the free tier (e.g., 100 calls/min).
*   **Implementation:** Use the `cohere` python library.

### 4. API-Based: Google Gemini API (Free Tier)
Google's Gemini API offers a robust free tier that includes access to their embedding models.
*   **Model:** `text-embedding-004`
*   **Pros:** High quality, generous free tier limits (up to 1500 requests per day for free).
*   **Cons:** Data is sent to a third party. Dimension size is 768.
*   **Implementation:** Use the `google-generativeai` python library.

**Recommendation for Memoir:** If you want zero dependencies and no API limits during local dev, use **`sentence-transformers`** with `all-MiniLM-L6-v2`. Just remember to change `vector(1536)` to `vector(384)` in your `001_initial.sql`!


 celery -A workers.celery_app worker --loglevel=info
  source venv/bin/activate
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
