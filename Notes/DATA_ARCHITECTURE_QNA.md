# System Architecture: Unified Data Storage Q&A

This document explains how Memoir stores and organizes data from multiple repositories and diverse platforms.

## Q1: If I test on the `fastapi` and `orbis` repos, are there separate tables and graphs for these?

**No. There is exactly one global table and one global graph.**

### How it works:
1. **PostgreSQL (Vector Storage):** Both `fastapi` and `orbis` events are inserted into the exact same `raw_events` table. 
   - We do not create new tables for new repos. 
   - Instead, every row has a `source` tag (e.g., `"github"`) and a specific target ID (e.g., `"WebClub-NITK/orbis"` or `"tiangolo/fastapi"`). 
   - When you search, the query engine searches across the entire global table unless you specifically pass a filter to limit the search to a single repo.

2. **Neo4j (Knowledge Graph):** The graph is completely unified. 
   - If a developer (e.g., "Mayank Tiwari") committed to both `fastapi` and `orbis`, the system will not create two separate "Mayank" nodes.
   - The Entity Resolution worker merges them into **a single `Person` node**.
   - That one `Person` node will have `AUTHORED` relationships pointing to Commits/PRs in `fastapi` AND Commits/PRs in `orbis`. The graph physically cross-links the repositories together through the people who work on them.

---

## Q2: What if I ingest different sources for other connectors as well (Slack, Discord, Notion)?

**The exact same principle applies: all data goes into the unified storage, regardless of the platform.**

### How we achieve this:
1. **The `RawEvent` Standardization:** Before touching the database, the connectors for Slack, Discord, and Notion all strip away their platform-specific complexities and convert the data into a standard `RawEvent` object. 
   - A Discord message becomes an "Event" with `text`, `author`, `timestamp`, and `source="discord"`.
   - A Notion page becomes an "Event" with `text`, `author`, `timestamp`, and `source="notion"`.

2. **Unified Search & Synthesis:** 
   - Because a Slack message and a GitHub PR are stored in the exact same format in the same `raw_events` table, the Vector Search engine doesn't care where the data came from. It only looks for mathematical similarity to your question.
   - If you ask *"Why did we change the database migration strategy?"*, the vector search might retrieve a GitHub PR describing the code, a Notion document detailing the architecture decision, and a Slack thread where the team debated the issue.
   - All of this diverse context is fed into the LLM (Gemini) simultaneously. The LLM seamlessly synthesizes an answer referencing the code, the documentation, and the team chat all at once.

3. **Identity Merging:** 
   - The true power of the Neo4j graph lies here. The `Entity Resolution` worker connects Slack user IDs, Discord tags, and GitHub emails. If you mention an issue in Slack, the graph connects the Slack message directly to the GitHub Issue node, creating a "Living Timeline" of organizational knowledge across all platforms.
