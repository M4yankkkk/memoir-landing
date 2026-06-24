# Memoir V2: One-Click OAuth Architecture Plan

This document outlines the exact technical implementation required to transition from manual bot configuration to a seamless, "One-Click" OAuth2 connection flow for enterprise clients.

---

## 1. The Database Layer (Postgres Updates)
To support multi-tenancy and dynamic connections, we must update our Postgres schema before writing any backend logic.

*   **`tenants` table:** Represents a company/workspace (e.g., "Omnitech").
*   **`integrations` table:** 
    *   `id` (UUID)
    *   `tenant_id` (Foreign Key)
    *   `platform` (Enum: slack, discord, notion, github)
    *   `access_token` (**Encrypted** string - NEVER store plaintext tokens)
    *   `refresh_token` (Encrypted string)
    *   `metadata` (JSONB - stores workspace name, team ID, bot user ID)
*   **`data_sources` table:** 
    *   `id` (UUID)
    *   `integration_id` (Foreign Key)
    *   `source_type` (Enum: channel, database, repo)
    *   `external_id` (e.g., Slack Channel ID)
    *   `name` (e.g., "#general")
    *   `is_sync_enabled` (Boolean - allows admins to toggle ingestion on/off)

---

## 2. The Backend API (FastAPI Auth Routes)
We will create a new router in FastAPI (`api/auth.py`) to handle the standard OAuth 3-legged flow for each provider.

### Step 1: The Login Endpoint (e.g., `/api/auth/slack/login`)
*   **Action:** When the user clicks "Connect Slack" on the frontend, it hits this endpoint.
*   **Logic:**
    1.  Generate a cryptographically secure random `state` string (to prevent CSRF attacks).
    2.  Save `state` mapped to the current `tenant_id` in Redis (with a 10-minute expiry).
    3.  Redirect the user to the provider's authorize URL:
        `https://slack.com/oauth/v2/authorize?client_id=XYZ&scope=channels:history,chat:read&redirect_uri=OUR_URL/callback&state=ABC`

### Step 2: The Callback Endpoint (e.g., `/api/auth/slack/callback`)
*   **Action:** After the user clicks "Allow" on Slack/Notion, the provider redirects them back to this endpoint with a temporary `code` and the `state`.
*   **Logic:**
    1.  Verify the `state` matches what is in Redis to ensure security.
    2.  Make a `POST` request to the provider's token endpoint (e.g., `slack.com/api/oauth.v2.access`) passing the `code`, our `client_id`, and our `client_secret`.
    3.  The provider returns the permanent `access_token` (and for chat apps, the `bot_token`).
    4.  Encrypt the token and save it to the `integrations` table for the active `tenant_id`.
    5.  **Trigger Auto-Discovery:** Fire off a background Celery task to fetch all available channels/workspaces.
    6.  Redirect the browser back to the Frontend Dashboard.

---

## 3. Auto-Discovery & The Configuration UI
Once the integration is saved, we don't just start blindly ingesting data. We need to give the admin control.

### Background Task (Celery)
*   Immediately after the token is saved, a worker uses the token to call the provider's API (e.g., `conversations.list` for Slack, or `search` for Notion databases).
*   It populates the `data_sources` table with all found channels/databases and sets `is_sync_enabled = False` by default.

### The Frontend Configuration Screen
*   The user lands back on `/dashboard/settings`.
*   The UI polls the backend and displays the newly discovered sources.
*   *UI Example:* 
    *   [x] #engineering-chat
    *   [ ] #random
    *   [x] Notion: Engineering Wiki
*   When the user toggles a switch and clicks "Save & Start Sync", the backend flips `is_sync_enabled = True` and pushes a massive "Historical Backfill" job to the ingestion queue.

---

## 4. Platform-Specific OAuth Nuances to Watch Out For

1.  **Slack:** 
    *   Requires you to differentiate between User Tokens (acting on behalf of a user) and Bot Tokens (acting as the Memoir Bot). We want the **Bot Token**.
    *   Scopes needed: `channels:history`, `groups:history`, `users:read`.
2.  **Notion:**
    *   Notion OAuth allows the user to select *exactly* which pages the app can see during the authorization screen. We must design our UI to remind users: *"Please select the top-level teamspace pages when prompted."*
3.  **Discord:**
    *   Uses a specialized OAuth flow for adding bots to Guilds (Servers). We must request the `bot` scope and pass an `permissions` integer representing "Read Messages" and "Read Message History".
4.  **GitHub:**
    *   Best implemented as a **GitHub App** rather than pure OAuth. The user installs the App on their Organization/Repository, which fires a webhook to our backend giving us an Installation ID. We then use that ID to generate short-lived tokens on the fly.
