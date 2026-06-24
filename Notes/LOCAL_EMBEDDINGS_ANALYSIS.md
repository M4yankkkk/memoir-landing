# Local Embedding Models vs. OpenAI

When moving away from OpenAI's `text-embedding-3-small` to a free or local alternative for the Memoir MVP, there are trade-offs in quality, context window, and infrastructure. However, with the right strategy, you can match or even exceed OpenAI's retrieval performance.

---

## 📉 1. The Quality Dip

OpenAI's `text-embedding-3-small` is currently one of the industry standards for general-purpose retrieval. Moving to a lightweight local model introduces a few challenges:

| Feature | OpenAI `text-3-small` | `all-MiniLM-L6-v2` (Local) | `nomic-embed-text` (Local) |
| :--- | :--- | :--- | :--- |
| **MTEB Score** (Avg Quality) | ~62.3 | ~56.2 | ~62.4 |
| **Dimensions** | 1536 | 384 | 768 |
| **Context Window** | 8191 tokens | 512 tokens | 8192 tokens |
| **Handling Technical Code** | Excellent | Average | Very Good |

**What you will notice with a basic model (like MiniLM):**
1. **Context Truncation:** If a GitHub PR description is 1,000 words long, `all-MiniLM-L6-v2` will silently chop off everything after the first ~350 words (512 tokens). OpenAI reads the whole thing.
2. **Nuance Loss:** OpenAI is very good at understanding the semantic overlap between code snippets and natural language (e.g., matching "database connection pooling" to `asyncpg.create_pool`). Smaller local models struggle more with bridging code-to-text.

---

## 🛠️ 2. How to Maintain (or Beat) OpenAI Quality

You can completely offset the quality dip of free models by adjusting your retrieval architecture. 

### Strategy A: Use a State-of-the-Art Local Model
Instead of the older `MiniLM`, use **`nomic-embed-text-v1.5`** or **`BAAI/bge-large-en-v1.5`**. 
* *Why?* Nomic matches OpenAI's 8192 token context window and actually scores slightly higher than `text-embedding-ada-002` on benchmarks.

### Strategy B: Semantic Chunking
Because GitHub Issues and PRs can be massive, don't embed the entire event as a single string.
* Break large PRs into logical chunks (e.g., "PR Description", "Review Comment 1", "Review Comment 2"). 
* Embed each chunk separately, but tie them all back to the same `event_id` in Postgres. 

### Strategy C: Hybrid Search + Reranking (The Gold Standard)
Pure vector search isn't perfect. If a user searches for `Issue #4052`, vector search might miss it, but a dumb keyword search finds it instantly.
1. **Vector Search:** Use your local embedding model to get the top 50 semantic matches.
2. **Keyword Search (BM25):** Use Postgres full-text search to get the top 50 exact keyword matches.
3. **Cross-Encoder Reranking:** Pass the combined 100 results through a local Cross-Encoder (e.g., `cross-encoder/ms-marco-MiniLM-L-6-v2`). Cross-encoders are incredibly accurate because they compare the query and the document simultaneously, rather than comparing pre-computed vectors.

---

## 💻 3. Hardware Requirements for Local Models

Running local embeddings for an ingestion pipeline (where you might process 10,000 PRs at once) requires different hardware than just querying one at a time.

### Lightweight Tier (`all-MiniLM-L6-v2`)
* **RAM/VRAM:** ~90 MB
* **Hardware:** Any standard CPU (even a basic $5/mo DigitalOcean droplet or AWS t3.micro).
* **Speed:** Generates embeddings in milliseconds on CPU.
* **Best for:** Extremely cheap, serverless, or low-power deployments.

### Mid Tier (`BAAI/bge-small-en-v1.5`)
* **RAM/VRAM:** ~500 MB 
* **Hardware:** Modern multi-core CPU or an entry-level GPU.
* **Speed:** Fast on CPU for single queries. For backfilling 10,000 GitHub events, a CPU will take several minutes, while a basic GPU will take seconds.
* **Best for:** The sweet spot for quality vs. compute cost.

### Heavy Tier (`nomic-embed-text` or `BAAI/bge-large-en-v1.5`)
* **RAM/VRAM:** ~2.5 GB to 4 GB
* **Hardware:** 
  * **Mac:** Excellent on Apple Silicon (M1/M2/M3) using MLX or Ollama.
  * **PC/Server:** Nvidia GPU (e.g., RTX 3060, T4, A10g) is highly recommended.
* **Speed:** Can be agonizingly slow to backfill thousands of events purely on CPU.
* **Best for:** High-fidelity enterprise applications where you have access to a small GPU instance or Apple Silicon development machines.

### Summary Recommendation for Memoir
For your local development on Linux, install **Ollama** and run `ollama run nomic-embed-text`. It will automatically leverage your system's hardware to run efficiently, providing OpenAI-level quality for absolutely zero cost.
