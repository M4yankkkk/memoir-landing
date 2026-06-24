# Memoir: End-to-End System Testing & Stress Test Guide

**Company Persona:** OmniTech
**Goal:** To rigorously test Memoir from 0 to 100, proving its ability to ingest data across four platforms, merge identities in the Neo4j graph, and synthesize cross-platform knowledge using vector search.

---

## Phase 0: Bot Authorization & API Key Setup
Before you can ingest or test anything, you must create bots for each platform, get their API tokens, and invite them to your test servers.

### 1. Discord Setup
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** -> name it "Memoir Bot".
3. Go to the **Bot** tab and click **Reset Token** to get your `DISCORD_TOKEN`. Paste this into your `.env`.
4. **CRITICAL**: On the **Bot** tab, scroll down to **Privileged Gateway Intents** and enable **Message Content Intent** (otherwise the bot reads empty strings).
5. Go to **OAuth2 -> URL Generator**.
6. Check the `bot` scope, and under Bot Permissions check `Read Messages/View Channels` and `Read Message History`.
7. Copy the generated URL at the bottom, paste it into your browser, and authorize the bot to join your test Discord server.

### 2. Slack Setup
1. Go to [Slack API Apps](https://api.slack.com/apps) and click **Create New App** (from scratch) for your test workspace.
2. Go to **OAuth & Permissions**. Under **Bot Token Scopes**, add `channels:history`, `channels:read`, and `users:read`.
3. Scroll to the top and click **Install to Workspace**.
4. Copy the **Bot User OAuth Token** (`xoxb-...`). This is your `SLACK_TOKEN` for `.env`.
5. **CRITICAL:** In your Slack app, go to the channel you want to test (e.g., `#incident-response`), type `/invite @Memoir` to explicitly give the bot access to that specific channel.

### 3. Notion Setup
1. Go to [Notion My Integrations](https://www.notion.so/my-integrations) and click **New integration**. Name it "Memoir".
2. Copy the **Internal Integration Secret**. This is your `NOTION_TOKEN` for `.env`.
3. Go to your Notion workspace and create a database (e.g., "Architecture Decisions").
4. **CRITICAL:** Click the **three dots (...)** at the top right of the Notion database page -> **Connections** -> **Add connection** -> search for "Memoir" and add it. If you don't do this, the API cannot see the database.

---

## Phase 1: Data Seeding (The Breadcrumbs)
**Yes, you must seed this data manually.** To prove the connectors actually work against the live APIs, you need to physically log into your test GitHub, Slack, Discord, and Notion accounts and type out these specific messages so the bots can fetch them.

### 1. GitHub (Target: `OmniTech/core-api`)
*   **Create Issue #1:** "Production API downtime during peak load."
*   **Create Pull Request #2:** "Implement Redis caching layer for Auth module."
*   **Commit:** "Revert PR #2 to fix race condition." *(Notice the commit doesn't explain WHY the race condition happened, just that it was reverted).*

### 2. Slack (Target Channel: `#incident-response`)
*   **Alice (DevOps):** "Hey team, the API went down again. CPU spiked to 100%."
*   **Bob (Backend Lead):** "I found the issue. The new Redis caching layer I added in PR #2 isn't thread-safe when authenticating concurrently. It caused a massive race condition. I'm reverting the code now."

### 3. Discord (Target Channel: `#frontend-dev-chat`)
*   **Charlie (Frontend):** "Hey Bob, I'm getting weird 401 errors on the login screen today. Any ideas?"
*   **Bob (Backend Lead):** "Yeah, that's because of the OAuth scope mismatch we introduced yesterday. Just update the client ID in your local `.env` and it will fix the 401s." *(Crucial undocumented knowledge).*

### 4. Notion (Target Database: `Architecture Decisions`)
*   **Page Title:** "Caching Strategy v2"
*   **Content:** "Following the production incident caused by the Redis race condition, the engineering team has officially decided to move to an in-memory LRU cache for all future authentication flows to guarantee thread safety."

---

## Phase 2: Connecting the Connectors
With the data seeded, simulate the integration phase using the Memoir Frontend Dashboard.

1.  **Environment Setup:** Ensure your `.env` contains valid keys for `GITHUB_TOKEN`, `SLACK_TOKEN`, `DISCORD_TOKEN`, and `NOTION_TOKEN`.
2.  **Dashboard Ingestion:** Navigate to `http://localhost:3000/ingest` and trigger the following background tasks:
    *   **Tab: GitHub** -> Input: `OmniTech/core-api`
    *   **Tab: Slack** -> Input: `C12345678` *(Channel ID for #incident-response)*
    *   **Tab: Discord** -> Input: `108938291` *(Channel ID for #frontend-dev-chat)*
    *   **Tab: Notion** -> Input: `abc123def456` *(Database ID for Architecture Decisions)*
3.  **Validation:** Watch the terminal UI. Ensure all 4 pipelines report `SUCCESS` and output the total number of events inserted into PostgreSQL.

---

## Phase 3: The 0-100 Synthesis Tests
Now we test the Vector Search and LLM's ability to act as a unified brain.

### Test 1: The Cross-Platform Story
*   **Query:** *"Why did we revert the Redis caching layer and what are we using instead?"*
*   **Expected Behavior:** The vector search pulls the GitHub PR (the revert), the Slack message (the race condition explanation), and the Notion page (the LRU cache decision).
*   **Expected LLM Answer:** *"The Redis caching layer was reverted because it caused a race condition that led to production downtime (as explained by Bob in Slack). According to the Architecture Decisions document, we are now moving to an in-memory LRU cache to guarantee thread safety."*

### Test 2: Unearthing Undocumented Chat Knowledge
*   **Query:** *"How do I fix the 401 errors on the login screen?"*
*   **Expected Behavior:** The vector search identifies semantic similarity with the Discord chat.
*   **Expected LLM Answer:** *"According to Bob on Discord, the 401 errors are caused by an OAuth scope mismatch. You can fix this by updating the client ID in your local `.env` file."*

### Test 3: Identity Merging (Graph Validation)
*   **Action:** Open the Neo4j Browser (`http://localhost:7474`).
*   **Query:** `MATCH (p:Person {name: "Bob"})-[r]->(e:Event) RETURN p, r, e`
*   **Expected Behavior:** Bob should exist as **one single node**. Coming out of Bob, you should see relationships pointing to a GitHub commit, a Slack message, and a Discord message. The graph successfully merged his identity across platforms.

---

## Phase 4: Stress Testing the System
To prove Memoir is production-ready, subject it to the following stress tests:

1.  **Massive Backfill (Celery Limits):**
    *   Trigger ingestion for a massive repository like `tiangolo/fastapi` or `vercel/next.js`.
    *   *Goal:* Verify that the background worker can paginate through thousands of API requests without crashing, and that Postgres handles the bulk vector inserts smoothly.
2.  **Concurrent Ingestion (Database Locks):**
    *   Open 4 browser tabs. Trigger ingestion for GitHub, Slack, Discord, and Notion simultaneously.
    *   *Goal:* Ensure the Celery workers can process tasks in parallel without hitting Postgres connection pool limits or locking the `raw_events` table.
3.  **Rapid Query Fire (Rate Limit Testing):**
    *   Send 15 complex queries to the search endpoint in rapid succession.
    *   *Goal:* Monitor OpenRouter/Gemini for `429 Too Many Requests` errors. Verify the FastAPI backend gracefully catches errors and doesn't crash the server.
