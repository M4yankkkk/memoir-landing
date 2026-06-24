# Issue: Cross-Platform Context Missing in Synthesis

## Description
During multi-platform data synthesis, the LLM was unable to include context from Slack, Discord, or Notion, despite the events successfully appearing as vector search matches. The synthesis step continually reported that the information was missing, and the visual context graph did not display the associated text nodes correctly.

## Root Cause
The core issue existed in the background worker responsible for moving data from PostgreSQL into the Neo4j Knowledge Graph (`workers/graph.py`).

1. **Ignored Event Types**: The `write_to_graph` task explicitly checked for `pull_request`, `issue`, or `commit` events. It did not have handlers for non-GitHub event types such as `message` (Slack/Discord) or `page` (Notion).
2. **False Positives in Sync State**: Although the nodes were not created in Neo4j, the background worker still appended their event IDs to the `written_event_ids` array, updating their status in PostgreSQL to `graph_written = TRUE`. 
3. **Empty Graph Context**: When a user queried the system, the vector search correctly retrieved the semantic matches from PostgreSQL and passed the event IDs to `graph_expand`. However, because the events never existed in Neo4j, `graph_expand` returned empty context to the LLM. 

## Fix Implemented (Round 1)

1. **Database Methods (`db/neo4j.py`)**: 
   - Added `merge_message` to handle Slack/Discord events.
   - Added `merge_page` to handle Notion events.
   
2. **Graph Synchronization Worker (`workers/graph.py`)**: 
   - Added specific handlers for `event_type == 'message'` and `event_type == 'page'`.
   - Mapped platform-specific metadata (e.g., `channel_id`, `url`, `platform`) into the graph nodes.
   
3. **Frontend Graph Extraction (`api/query.py`)**:
   - Modified `extract_graph_data` to gracefully fallback to using `.content` as the primary text for visual nodes if standard GitHub properties (`title`, `message`, `filename`) were not present. 
   
4. **LLM Prompts (`api/query.py`)**:
   - Updated the `synthesize_answer` prompt so the LLM explicitly recognizes "Messages (Slack/Discord)" and "Pages (Notion)". 
   - Updated the JSON schema constraint so the `decision_trail` type accepts `message` and `page`.
   
5. **Data Backfill**: 
   - Ran an SQL update to reset stranded events: `UPDATE raw_events SET graph_written = FALSE WHERE event_type IN ('message', 'page');`
   - Triggered `workers.graph.write_to_graph` to successfully port the events over to Neo4j.

---

## Round 2 Bugs: Blank Ingestion & Identity Resolution Failures

Despite the graph and LLM changes above, subsequent runs showed that Discord messages were completely blank (`""`) and Notion events only contained their page title with no internal block text. Furthermore, the `workers.resolution.build_persons_table` task was continuously crashing with a `404 Not Found` error.

### Root Causes (Round 2)
1. **Discord Privilege**: The Discord Bot was missing the **Message Content Intent** in the developer portal. Without it, Discord intentionally returns an empty string for message text.
2. **Notion Connector Defect**: `connectors/notion.py` was merely returning the title property of the page metadata and stopping. It did not query the `/blocks/` API to fetch nested text content.
3. **Identity Resolution 404 Loop**: The background task `workers/resolution.py` naively sent *all* incoming user IDs to `github.get_user(actor_login)`. When passing Slack IDs or Notion UUIDs, GitHub rightfully threw a 404. Since this error crashed the celery pipeline, the events never advanced to the `write_to_graph` step.
4. **Celery State Caching**: Even after updating the python logic, the long-running Celery process was not restarted. Celery does not hot-reload like `uvicorn`, so it persisted executing the old flawed logic over newly ingested data.

### Fix Implemented (Round 2)
1. **Notion Block Pagination (`connectors/notion.py`)**: Extended the connector to fetch page blocks via `GET /blocks/{page_id}/children`, extracting all inner `rich_text` arrays.
2. **Setup Instructions (`OMNITECH_TESTING_SCENARIO.md`)**: Documented the absolute necessity of enabling the Discord Message Content Intent.
3. **Platform-Aware Identity Checks (`workers/resolution.py`)**: Updated the logic to inspect the `source` of the event. Non-GitHub sources bypass the GitHub API and generate a localized dummy profile (e.g., `slack_U0BC97MV868`) to successfully merge cross-platform identities without crashing.
4. **Pipeline Execution (`run_pipeline.py`)**: Manually purged stale events, killed the caching Celery worker (`pkill -f celery`), and reran the full ingestion and synthesis pipeline natively to permanently rectify the data state.

## Verification
Running the query `"Why am I getting 401 errors on the login screen, and what is our new caching strategy after the incident?"` now successfully returns context aggregated perfectly from Discord (the OAuth fix), Notion (the LRU cache documentation), and Slack (the background context on the Redis race condition). The cross-platform data pipeline is 100% operational.
