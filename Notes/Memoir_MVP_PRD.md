**MEMOIR**  —  Product Requirements Document (MVP)    v1.0  |  Confidential

**MEMOIR**

Autonomous Knowledge Graph for Engineering Orgs

**PRODUCT REQUIREMENTS DOCUMENT — MVP**

GitHub-Only Build  |  Open Source Repo Test Target  |  Version 1.0


# **1. Product Overview**
Memoir is an autonomous knowledge graph that continuously ingests a software engineering organisation's activity history, resolves entities across tools, and exposes a permissioned context API that turns years of fragmented institutional memory into structured, queryable intelligence.

The MVP is scoped to GitHub only. Slack and Jira connectors are deferred to v2. The test target will be a large open-source repository (minimum 12 months of activity, 500+ PRs) so that the entire build can be validated without needing a paying customer.

|<p>**One-Line Definition**</p><p>Memoir automatically captures every decision your engineering team ever makes — so the knowledge never leaves when people do.</p>|
| :- |

### **1.1  Problem Statement**
When a new engineer asks "why is the payments service designed this way?" the answer lives across a PR description from 2022, a GitHub issue that was closed without notes, and a commit message that referenced a now-deleted branch. There is no single place to look. Senior engineers carry this in their heads. When they leave, it is gone.
### **1.2  Solution**
Memoir crawls a repository's full history, builds a knowledge graph of every decision, links PRs to issues to commits to authors, generates semantic embeddings over all content, and exposes a REST API that returns structured decision trails in response to natural language questions.
### **1.3  MVP Goal**
Demonstrate that a natural language question about an open-source codebase can be answered with a structured, sourced decision trail — entirely from GitHub data — with no hallucination and no manual curation.

# **2. MVP Scope**

|**Area**|**In Scope for MVP**|
| :- | :- |
|Data source|GitHub only (PRs, Issues, Commits, Comments, Review Comments)|
|Test target|One large public open-source repo (e.g. fastapi/fastapi or vercel/next.js)|
|Entity resolution|GitHub users only — cross-reference commit email to profile|
|Linking|PR ↔ Issue (via GitHub refs), PR ↔ Commit, Issue ↔ Commit|
|Storage|Postgres (raw events) + Neo4j (graph) + pgvector (embeddings)|
|Query interface|REST API endpoint + minimal web UI (single search box)|
|Auth|Single-user, API key auth — no multi-tenant for MVP|
|Deployment|Local Docker Compose + Railway for demo|

|**Area**|**Out of Scope (v2+)**|
| :- | :- |
|Slack connector|Deferred — no test environment available|
|Jira connector|Deferred — no test environment available|
|Agent IAM / permissions|Deferred — single user MVP has no permission model|
|Multi-tenant|Deferred|
|Write-back to GitHub|Never in MVP — read-only only|
|Real-time webhooks|Deferred — backfill only for MVP|

# **3. Test Target Repository**
For MVP validation, use a public open-source repository with sufficient history to produce meaningful decision trails. The following criteria must be met:

- Minimum 18 months of activity
- Minimum 500 merged pull requests
- Minimum 200 closed issues
- Active use of PR descriptions and issue references (not just bare commits)
- English-language content

### **Recommended Test Repositories**

|**Repo**|**Why It Works**|**PRs / Issues**|
| :- | :- | :- |
|fastapi/fastapi|Rich PR descriptions, architectural decisions in issues, active community|~3,000 PRs|
|vercel/next.js|Complex codebase, many linked issues, good commit messages|~15,000 PRs|
|tiangolo/sqlmodel|Smaller scope, deeply documented decisions, same author as FastAPI|~300 PRs|
|pallets/flask|Decade of history, long discussion threads on design choices|~2,000 PRs|

|<p>**Recommendation**</p><p>Start with fastapi/fastapi. It is large enough to produce real results, small enough to backfill in under 10 minutes on a free GitHub token, and the maintainer writes detailed PR and issue descriptions that make ideal test cases for decision queries.</p>|
| :- |

# **4. User Stories**

### **Primary User: Developer / Engineering Lead**

1. As a developer, I want to ask a natural language question about why a part of the codebase is designed a certain way, so that I get a sourced answer without reading hundreds of PRs manually.
1. As an engineering lead, I want to see the full decision trail behind any architectural choice, including who made the call, when, and what alternatives were considered.
1. As a new team member, I want to understand the history of a specific service or module without asking senior engineers to retell it.
1. As a developer, I want the system to work on a real public codebase so I can validate the output against what I already know.

### **Acceptance Criteria for MVP**

- Given a repository is connected, the backfill completes within 15 minutes for a repo with 3,000 PRs on a free GitHub token.
- Given a natural language question, the API returns a response in under 5 seconds.
- Given a question about a real decision in the test repo, the returned decision trail cites the correct PR, issue, or commit with a working URL.
- Given a question about something not in the data, the system returns a low-confidence response rather than hallucinating.
- The query UI runs in a browser with no installation required by the demo viewer.

# **5. Architecture**

### **5.1  High-Level Flow**

|<p>GitHub API</p><p>`    `│</p><p>`    `▼  (PyGithub, rate-limited)</p><p>Ingestion Worker (Celery)</p><p>`    `│</p><p>`    `├──► Raw Events Table (Postgres)     ← source of truth, always kept</p><p>`    `│</p><p>`    `▼</p><p>Entity Resolution Worker</p><p>`    `│  cross-ref commit email ↔ GitHub profile</p><p>`    `│  regex-link PRs ↔ Issues ↔ Commits</p><p>`    `│</p><p>`    `├──► Persons Table (Postgres)</p><p>`    `├──► Event Links Table (Postgres)</p><p>`    `│</p><p>`    `▼</p><p>Graph Writer Worker</p><p>`    `│  writes Person, PR, Issue, Commit nodes</p><p>`    `│  writes AUTHORED, REFERENCES, MODIFIES edges</p><p>`    `│</p><p>`    `├──► Neo4j Aura (Knowledge Graph)</p><p>`    `│</p><p>`    `▼</p><p>Embedding Worker</p><p>`    `│  OpenAI text-embedding-3-small</p><p>`    `│</p><p>`    `└──► pgvector on Supabase (Semantic Index)</p><p></p><p>Query API (FastAPI)</p><p>`    `│  vector search + graph expansion + rerank</p><p>`    `│  Claude Sonnet synthesis</p><p>`    `└──► JSON response with decision trail + source URLs</p>|
| :- |

### **5.2  Data Models**

### **Postgres — raw\_events table**

|<p>CREATE TABLE raw\_events (</p><p>`    `id              TEXT PRIMARY KEY,</p><p>`    `source          TEXT NOT NULL,         -- 'github' (only source in MVP)</p><p>`    `event\_type      TEXT NOT NULL,         -- 'pull\_request' | 'issue' | 'commit'</p><p>`    `actor\_raw       TEXT,                  -- raw GitHub username</p><p>`    `actor\_id        TEXT,                  -- resolved person UUID (filled later)</p><p>`    `timestamp       TIMESTAMPTZ NOT NULL,</p><p>`    `content         TEXT,                  -- full text content for search</p><p>`    `metadata        JSONB,                 -- structured fields</p><p>`    `raw\_payload     JSONB,                 -- original API response, never modified</p><p>`    `processed       BOOLEAN DEFAULT FALSE, -- entity resolution done?</p><p>`    `graph\_written   BOOLEAN DEFAULT FALSE, -- written to Neo4j?</p><p>`    `embedded        BOOLEAN DEFAULT FALSE, -- embedding generated?</p><p>`    `created\_at      TIMESTAMPTZ DEFAULT NOW()</p><p>);</p>|
| :- |

### **Postgres — persons table**

|<p>CREATE TABLE persons (</p><p>`    `id              TEXT PRIMARY KEY,   -- canonical UUID</p><p>`    `canonical\_email TEXT,</p><p>`    `display\_name    TEXT,</p><p>`    `github\_login    TEXT UNIQUE,</p><p>`    `github\_email    TEXT,               -- from commit author field</p><p>`    `created\_at      TIMESTAMPTZ DEFAULT NOW()</p><p>);</p>|
| :- |

### **Postgres — event\_links table**

|<p>CREATE TABLE event\_links (</p><p>`    `id              TEXT PRIMARY KEY,</p><p>`    `source\_event\_id TEXT REFERENCES raw\_events(id),</p><p>`    `target\_event\_id TEXT REFERENCES raw\_events(id),</p><p>`    `link\_type       TEXT,   -- 'explicit\_reference' | 'temporal\_cluster'</p><p>`    `evidence        TEXT,   -- human-readable explanation of why linked</p><p>`    `created\_at      TIMESTAMPTZ DEFAULT NOW()</p><p>);</p>|
| :- |

### **Neo4j — Node Types**

|**Node Label**|**Key Properties**|**Example**|
| :- | :- | :- |
|Person|id, email, github\_login, name|jdoe92, jdoe@gmail.com|
|PR|id, number, title, content, merged, timestamp, repo|PR #892 — auth: use postgres|
|Issue|id, number, title, content, state, timestamp|Issue #441 — evaluate DB options|
|Commit|id, sha, message, timestamp, files\_changed|abc123f — implement pg connection|
|Service|name, repo|auth-service, payments-service|

### **Neo4j — Edge Types**

|**Edge**|**From**|**To**|
| :- | :- | :- |
|AUTHORED|Person|PR / Issue / Commit|
|REFERENCES|PR / Issue / Commit|PR / Issue / Commit|
|MODIFIES|PR / Commit|Service|
|CLOSES|PR|Issue|
|RESOLVED\_BY|Issue|PR|
|PART\_OF|Commit|PR|

# **6. Full Tech Stack**

|**Layer**|**Technology**|**Why / Notes**|
| :- | :- | :- |
|Language|Python 3.11|Best GitHub/AI library ecosystem|
|API framework|FastAPI|Async, fast, auto-docs at /docs|
|Task queue|Celery 5|Reliable async workers|
|Queue broker|Redis via Upstash|Free tier sufficient for MVP|
|Relational DB|Supabase (Postgres)|Free tier, pgvector built-in, hosted|
|Vector store|pgvector on Supabase|Same DB, cosine similarity search|
|Graph DB|Neo4j Aura Free|200K nodes free, native graph traversal|
|GitHub client|PyGithub|Handles rate limiting, pagination|
|Embeddings|OpenAI text-embedding-3-small|Cheap ($0.02/1M tokens), 1536 dims|
|LLM synthesis|Claude claude-sonnet-4-6 (Anthropic)|Best at long-context synthesis|
|Frontend|Next.js on Vercel|Free tier, one search box UI|
|Auth|API key in header|No Clerk needed for MVP single user|
|Local dev|Docker Compose|All services in one command|
|Deployment|Railway (API + workers)|Free trial, always-on for webhooks|
|Raw storage|Cloudflare R2|10GB free, keep all original payloads|

# **7. Build Plan — 8 Weeks**

|<p>**Guiding Principle**</p><p>Build the pipeline end-to-end on one data type before adding more. A working query on 10 PRs is more valuable than a half-built ingestion of 10,000 PRs.</p>|
| :- |

### **Week 1–2: GitHub Connector + Raw Storage**

Goal: Raw events flowing into Postgres from a real repository.

- Set up Supabase project, create raw\_events / persons / event\_links tables
- Set up local Redis with Docker
- Set up Celery with a single worker
- **Task:** Write GitHubConnector class:
- backfill\_pull\_requests(repo, since) — yields RawEvent objects
- backfill\_issues(repo, since) — yields RawEvent objects
- backfill\_commits(repo, since) — yields RawEvent objects
- Write ingest\_github\_backfill Celery task that calls connector and writes to Postgres in batches of 100
- Run against fastapi/fastapi — confirm 3,000+ rows appear in raw\_events

*Done when: SELECT COUNT(\*) FROM raw\_events returns 3,000+ rows for the test repo.*

### **Week 3–4: Entity Resolution**

Goal: Every raw\_event.actor\_id is populated with a canonical person UUID.

- **Task:** Write build\_persons\_table task:
- Extract commit author emails from raw commit payloads
- Call GitHub Users API to get profile email for each unique login seen
- Merge by email — write to persons table
- Write resolve\_event\_actors task — updates actor\_id on raw\_events
- **Task:** Write link\_events task:
- Regex scan: find #123 and Fixes #123 patterns in PR/issue/commit content
- Resolve matches against known event IDs
- Write rows to event\_links table
- Handle GitHub's native closes/fixes keywords — these are in the PR payload as linked issues

*Done when: SELECT COUNT(\*) FROM event\_links WHERE link\_type = 'explicit\_reference' returns 500+ rows.*

### **Week 5: Graph Writer**

Goal: Knowledge graph exists in Neo4j with nodes and edges.

- Set up Neo4j Aura free instance
- **Task:** Write write\_to\_graph Celery task:
- For each person in persons table: MERGE Person node
- For each PR event: MERGE PR node, MERGE AUTHORED edge
- For each Issue event: MERGE Issue node
- For each Commit event: MERGE Commit node, infer Service from changed file paths
- For each row in event\_links: MERGE REFERENCES edge
- Write infer\_service\_from\_files helper — extracts service name from path patterns like services/auth/db.py
- Run full graph write, open Neo4j browser, verify visual graph looks correct

*Done when: MATCH (n) RETURN COUNT(n) in Neo4j returns 5,000+ nodes.*

### **Week 6: Embeddings**

Goal: Every event has a vector stored in pgvector.

- Enable pgvector extension in Supabase
- Create embeddings table with vector(1536) column and ivfflat index
- **Task:** Write generate\_embeddings Celery task:
- Batch 500 events at a time
- Construct rich text: Type + Content + Repo + Labels metadata
- Call OpenAI text-embedding-3-small in batch
- Write vectors to embeddings table
- Mark raw\_events.embedded = True
- If 500 events processed, queue next batch

*Done when: SELECT COUNT(\*) FROM embeddings matches SELECT COUNT(\*) FROM raw\_events.*

### **Week 7: Query API**

Goal: POST /query returns a structured decision trail with sources.

- Write vector\_search function — embed query, cosine similarity against pgvector, return top 20 event IDs
- Write graph\_expand function — for each hit, run Cypher query to get 1-hop neighbors
- Write rerank function — score by relevance score + recency + node connectivity
- Write synthesize function — pass top 15 context nodes to Claude claude-sonnet-4-6 with structured JSON output schema
- Wire together in POST /query FastAPI endpoint
- Add GET /health and GET /stats endpoints
- Write API key middleware — reads X-API-Key header, rejects invalid keys

|<p># Target response shape</p><p>{</p><p>`  `'question': 'Why does FastAPI use Pydantic v2?',</p><p>`  `'answer': {</p><p>`    `'summary': 'Decision made in September 2023 by @tiangolo ...',</p><p>`    `'confidence': 0.91</p><p>`  `},</p><p>`  `'decision\_trail': [</p><p>`    `{</p><p>`      `'type': 'pull\_request',</p><p>`      `'number': 9291,</p><p>`      `'title': 'Add support for Pydantic v2',</p><p>`      `'actor': 'tiangolo',</p><p>`      `'timestamp': '2023-09-04T...',</p><p>`      `'source\_url': 'https://github.com/fastapi/fastapi/pull/9291'</p><p>`    `},</p><p>    ...</p><p>`  `]</p><p>}</p>|
| :- |

*Done when: A real question about a real FastAPI decision returns the correct PR URL in the decision trail.*

### **Week 8: UI + Demo Polish**

Goal: A browser-accessible demo that anyone can use without installing anything.

- Build Next.js single-page app with one search box and a result card
- Result card shows: summary, confidence bar, decision trail with clickable GitHub links
- Deploy API + workers to Railway free trial
- Deploy frontend to Vercel free tier
- Pre-load fastapi/fastapi full backfill so demo is instant
- Write 5 hardcoded demo questions that showcase the best outputs
- Record a 90-second Loom walkthrough

*Done when: Someone with no context can open the URL, type a question, and get a sourced answer in under 5 seconds.*

# **8. API Specification**

### **POST /query**

|<p>Request:</p><p>`  `Header:  X-API-Key: <key></p><p>`  `Body: {</p><p>`    `'question': string,          // required</p><p>`    `'repo': string,              // optional filter e.g. 'fastapi/fastapi'</p><p>`    `'as\_of': ISO8601 string,     // optional, defaults to now</p><p>`    `'max\_sources': integer       // optional, defaults to 10</p><p>`  `}</p><p></p><p>Response 200:</p><p>`  `{</p><p>`    `'question': string,</p><p>`    `'answer': {</p><p>`      `'summary': string,</p><p>`      `'confidence': float        // 0.0 to 1.0</p><p>`    `},</p><p>`    `'decision\_trail': [</p><p>`      `{</p><p>`        `'type': 'pull\_request' | 'issue' | 'commit',</p><p>`        `'id': string,</p><p>`        `'title': string,</p><p>`        `'actor': string,         // GitHub login</p><p>`        `'timestamp': ISO8601,</p><p>`        `'source\_url': string     // direct GitHub link</p><p>`      `}</p><p>`    `],</p><p>`    `'query\_time\_ms': integer</p><p>`  `}</p>|
| :- |

### **GET /stats**

|<p>Response 200:</p><p>`  `{</p><p>`    `'repos\_indexed': integer,</p><p>`    `'total\_events': integer,</p><p>`    `'total\_persons': integer,</p><p>`    `'total\_links': integer,</p><p>`    `'graph\_nodes': integer,</p><p>`    `'embeddings\_count': integer</p><p>`  `}</p>|
| :- |

### **POST /ingest**

|<p>Request:</p><p>`  `Header:  X-API-Key: <key></p><p>`  `Body: {</p><p>`    `'repo': 'fastapi/fastapi',   // required</p><p>`    `'since\_days': 365            // optional, defaults to 365</p><p>`  `}</p><p></p><p>Response 202:</p><p>`  `{</p><p>`    `'job\_id': string,</p><p>`    `'status': 'queued',</p><p>`    `'estimated\_events': integer</p><p>`  `}</p>|
| :- |

# **9. Free Infrastructure Setup**

Everything needed to run the MVP costs zero dollars. Each service has a free tier sufficient for the MVP workload.

|**Service**|**Free Limit**|**Setup Steps**|
| :- | :- | :- |
|Supabase|500MB Postgres, pgvector included|Create project at supabase.com, copy connection string|
|Neo4j Aura|200K nodes, 400K relationships|Create free instance at neo4j.com/cloud/aura, copy bolt URL|
|Upstash Redis|10,000 commands/day|Create database at upstash.com, copy REDIS\_URL|
|OpenAI API|$18 free credit on new account|Create account at platform.openai.com, generate API key|
|Anthropic API|Free credits on new account|Create account at console.anthropic.com, generate API key|
|Railway|500 hours/month free trial|Deploy from GitHub repo, set environment variables|
|Vercel|Unlimited deployments free|Connect GitHub repo, deploys on push to main|
|Cloudflare R2|10GB free forever|Create bucket at cloudflare.com, generate R2 token|
|GitHub API|5,000 requests/hour free|Create personal access token with repo:read scope|

### **Environment Variables Required**

|<p># .env file for local development</p><p></p><p># Database</p><p>DATABASE\_URL=postgresql://...     # Supabase connection string</p><p></p><p># Graph</p><p>NEO4J\_URI=neo4j+s://...           # Aura bolt URL</p><p>NEO4J\_USER=neo4j</p><p>NEO4J\_PASSWORD=...                # Aura password</p><p></p><p># Queue</p><p>REDIS\_URL=rediss://...            # Upstash Redis URL</p><p></p><p># AI</p><p>OPENAI\_API\_KEY=sk-...</p><p>ANTHROPIC\_API\_KEY=sk-ant-...</p><p></p><p># GitHub</p><p>GITHUB\_TOKEN=ghp\_...             # Personal access token</p><p></p><p># Storage</p><p>R2\_ENDPOINT=https://...r2.cloudflarestorage.com</p><p>R2\_ACCESS\_KEY=...</p><p>R2\_SECRET\_KEY=...</p><p></p><p># App</p><p>MEMOIR\_API\_KEY=memoir\_dev\_...    # Any string for local dev</p>|
| :- |

# **10. Project Folder Structure**

|<p>memoir/</p><p>├── api/</p><p>│   ├── main.py              # FastAPI app, routes</p><p>│   ├── query.py             # vector search + graph expand + synthesize</p><p>│   ├── middleware.py        # API key auth</p><p>│   └── schemas.py           # Pydantic request/response models</p><p>│</p><p>├── connectors/</p><p>│   ├── base.py              # BaseConnector abstract class + RawEvent dataclass</p><p>│   └── github.py            # GitHubConnector — PRs, Issues, Commits</p><p>│</p><p>├── workers/</p><p>│   ├── celery\_app.py        # Celery + Redis configuration</p><p>│   ├── ingestion.py         # ingest\_github\_backfill task</p><p>│   ├── resolution.py        # build\_persons\_table, resolve\_event\_actors, link\_events</p><p>│   ├── graph.py             # write\_to\_graph, write\_pr\_node, infer\_service\_from\_files</p><p>│   └── embeddings.py        # generate\_embeddings task</p><p>│</p><p>├── db/</p><p>│   ├── postgres.py          # Supabase client, table helpers</p><p>│   ├── neo4j.py             # Neo4j driver, session helper</p><p>│   └── migrations/</p><p>│       └── 001\_initial.sql  # All CREATE TABLE statements</p><p>│</p><p>├── frontend/                # Next.js app</p><p>│   ├── pages/</p><p>│   │   └── index.js         # Single search page</p><p>│   └── components/</p><p>│       └── DecisionCard.js  # Result display component</p><p>│</p><p>├── tests/</p><p>│   ├── test\_connector.py    # GitHub connector unit tests</p><p>│   ├── test\_resolution.py   # Entity resolution tests</p><p>│   └── test\_query.py        # End-to-end query tests</p><p>│</p><p>├── docker-compose.yml       # Redis + local Postgres for dev</p><p>├── requirements.txt</p><p>├── .env.example</p><p>└── README.md                # Setup instructions</p>|
| :- |

# **11. MVP Validation Tests**

These are the five questions that must return correct, sourced answers against the fastapi/fastapi repository for the MVP to be considered complete.

|**Test Question**|**Expected Behaviour**|
| :- | :- |
|Why does FastAPI use Pydantic for data validation?|Returns PR and issue discussing Pydantic adoption, with direct links|
|Who first introduced async support in FastAPI?|Returns the correct contributor GitHub login and the PR where async was first added|
|What was the reason for moving from Starlette responses to FastAPI responses?|Returns the issue thread and PR where this was discussed|
|What changed in how FastAPI handles dependency injection?|Returns multiple PRs showing evolution with timestamps in order|
|Why is the OpenAPI schema generation done at startup not at request time?|Returns the issue or PR where this performance decision was documented|

|<p>**Hallucination Test**</p><p>For each answer, manually verify the returned source\_url points to a real GitHub URL that actually contains the content cited in the summary. A correct URL that contradicts the summary is a failure. A low-confidence response with no wrong URL is a pass.</p>|
| :- |

# **12. Success Metrics**

|**Metric**|**Target**|**How to Measure**|
| :- | :- | :- |
|Backfill speed|< 15 min for 3,000 PRs|Time the ingest task end-to-end|
|Query latency|< 5 seconds p95|Log query\_time\_ms on each request|
|Source accuracy|5/5 test questions return correct URL|Manual verification against GitHub|
|Hallucination rate|0 confident wrong answers|Manual review of all test outputs|
|Graph completeness|> 80% of PRs linked to at least one Issue or Commit|Cypher query on Neo4j|
|Person resolution|> 70% of PR authors resolved to canonical person|SQL query on persons table|

# **13. Risks and Mitigations**

|**Risk**|**Mitigation**|
| :- | :- |
|GitHub rate limit (5,000 req/hr) slows backfill|Add exponential backoff in connector. Log remaining rate limit header. For 3,000 PRs this is fine — each PR is 1-3 requests.|
|OpenAI API credits run out during development|Embed in batches of 500. Use smaller test repo (sqlmodel) during development, switch to fastapi only for final demo.|
|Neo4j Aura free tier hits 200K node limit|fastapi/fastapi has ~3,000 PRs, ~2,000 issues, ~5,000 commits, ~500 persons = ~12,000 nodes. Well within limit.|
|LLM synthesis returns wrong answer confidently|Add source grounding check: if summary mentions a PR number, verify that PR number appears in decision\_trail. Reject and retry if not.|
|Entity resolution mismatches two different people|Default to creating two separate person nodes rather than merging. Wrong merge is worse than missed merge.|
|Supabase free tier 500MB fills up|Raw payloads are the main consumer. Store raw\_payload in R2 (free), only keep metadata in Postgres.|

# **14. After MVP — v2 Roadmap**

Once the GitHub-only MVP validates the core thesis, the following are the logical next steps in priority order:

1. **v2.1** Add Jira connector — highest additional signal for decision context, clearest enterprise use case
1. **v2.1** Add real-time GitHub webhooks — so the graph stays live without manual re-backfill
1. **v2.2** Add Slack connector — requires a test Slack workspace, worth setting one up for a pilot customer
1. **v2.3** Add Agent IAM — permission model so different agents see different subsets of the graph
1. **v2.4** Multi-tenant architecture — one deployment serves multiple companies with data isolation
1. **v2.5** MCP server implementation — expose Memoir as an MCP server so Claude Code and other agents can query it natively


**MEMOIR — MVP PRD v1.0**

*Confidential — Internal Use Only*
Page 
