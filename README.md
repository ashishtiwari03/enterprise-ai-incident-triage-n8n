# Enterprise AI Incident Triage with n8n

Production-style workflow automation for internal IT support. The project uses n8n to classify incoming incidents, retrieve relevant knowledge-base guidance, decide whether human approval is needed, and return an auditable triage response.

This was built to mirror the kind of AI automation now appearing in enterprise environments: controlled workflows, deterministic routing, retrieval-grounded assistance, and escalation gates instead of a loose chatbot.

## Workflow Preview

### n8n Workflow

![Workflow](screenshots/workflow-canvas.png)

### Architecture Diagram

![Architecture Diagram](screenshots/architecture-diagram.png)

### API Test

![API Test](screenshots/powershell-test.png)

### Execution View

![Execution](screenshots/execution-view.png)

## What It Does

- Accepts an incident through a webhook
- Normalizes the request into a consistent case format
- Classifies the request by category, severity, and risk
- Retrieves matching runbook guidance from a knowledge base
- Decides whether the case can be handled automatically or needs escalation
- Produces a structured triage response with confidence, next steps, and audit fields

## Why This Project Matters

Enterprise teams do not need another demo that only calls an LLM. They need workflows that connect AI with operational rules, approvals, traceability, and existing systems. This project demonstrates that pattern using n8n as the orchestration layer.

Relevant areas:

- AI workflow orchestration
- IT incident and request management
- RAG-style knowledge retrieval
- Human-in-the-loop approval
- Enterprise automation
- SAP, Microsoft 365, ServiceNow, Jira, and internal support style processes

## Tech Stack

- n8n workflow automation
- Docker Compose for local execution
- JavaScript Code nodes for transparent routing logic
- JSON knowledge base and sample incidents
- Webhook-based API interface

The included workflow runs without paid APIs. It is designed so an OpenAI-compatible API, Ollama, Jira, ServiceNow, Microsoft Teams, or Slack can be added without changing the architecture.

## Repository Structure

```text
.
├── docker-compose.yml
├── workflows/
│   └── enterprise-incident-triage.workflow.json
├── data/
│   ├── incidents.sample.json
│   └── knowledge-base.json
├── docs/
│   ├── architecture.md
│   ├── recruiter-summary.md
│   └── linkedin-post.md
└── .env.example
```

## Quick Start

Start n8n:

```powershell
docker compose up -d
```

If Docker Desktop is still starting, you can validate the triage logic locally:

```powershell
node .\tools\triage-simulator.js
```

Open n8n:

```text
http://localhost:5678
```

Import the workflow:

```text
workflows/enterprise-incident-triage.workflow.json
```

Activate it, then call the webhook with a sample incident:

```powershell
$body = Get-Content .\data\incidents.sample.json | ConvertFrom-Json
$incident = $body[0] | ConvertTo-Json -Depth 10
Invoke-RestMethod -Method Post -Uri "http://localhost:5678/webhook/enterprise-incident-triage" -Body $incident -ContentType "application/json"
```

## Example Input

```json
{
  "request_id": "INC-2026-0142",
  "source": "teams",
  "business_unit": "Finance Operations",
  "summary": "Unable to access SAP invoice approval app",
  "description": "Several users in Finance cannot open the invoice approval tile after role changes yesterday.",
  "affected_users": 18,
  "system": "SAP S/4HANA",
  "urgency": "high"
}
```

## Example Output

```json
{
  "request_id": "INC-2026-0142",
  "category": "Access Management",
  "severity": "P2",
  "risk": "medium",
  "recommended_action": "Create ticket and route to identity/access support.",
  "human_approval_required": true,
  "knowledge_match": "SAP role assignment and tile access issues",
  "audit": {
    "workflow": "enterprise-incident-triage",
    "decision_version": "2026.05",
    "automation_mode": "assistive"
  }
}
```

## What I Would Add in Production

- Replace local knowledge matching with ChromaDB, Qdrant, or SAP HANA Cloud Vector Engine
- Add OpenAI-compatible or local Ollama model for response drafting
- Connect Jira, ServiceNow, or SAP Cloud ALM for ticket creation
- Send approval requests through Microsoft Teams or Slack
- Store audit events in PostgreSQL
- Add evaluation tests for false routing and escalation misses

## CV Bullet

Built an enterprise incident triage workflow using n8n, RAG-style knowledge retrieval, severity classification, human approval gates, and audit logging; designed for internal IT automation across SAP/Microsoft-style business systems.
