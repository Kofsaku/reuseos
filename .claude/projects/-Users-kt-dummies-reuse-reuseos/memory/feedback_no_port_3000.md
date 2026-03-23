---
name: feedback_no_port_3000
description: Do not use port 3000 for dev server
type: feedback
---

Do not use localhost:3000 for the dev server.

**Why:** User explicitly requested not to use port 3000 (likely another service running there).

**How to apply:** Always start the Next.js dev server on port 3002 (or another port) using `-p 3002` or `PORT=3002`.
