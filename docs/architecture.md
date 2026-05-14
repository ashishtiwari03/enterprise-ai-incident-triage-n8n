# Architecture

## Workflow Overview

```text
Webhook
  -> Normalize Incident
  -> Retrieve Knowledge Match
  -> Classify Severity and Risk
  -> Approval Decision
  -> Structured Response
```

## Design Principles

The workflow separates deterministic business rules from AI-assisted reasoning. In production, the retrieval and response drafting steps can use an LLM, but the final routing decision should remain inspectable.

## Decision Logic

Severity is based on urgency, affected users, and keywords:

- P1: security risk, outage, or more than 50 affected users
- P2: high urgency or more than 10 affected users
- P3: medium urgency or more than 1 affected user
- P4: low urgency and single-user requests

Human approval is required when:

- risk is medium or high
- category is Security
- request changes access permissions
- affected users are greater than 5

## Enterprise Integrations

This project is intentionally connector-ready:

- SAP: SAP BTP, SAP S/4HANA, Joule Studio, SAP Cloud ALM
- Microsoft: Teams, Outlook, SharePoint, Microsoft 365 agent workflows
- ITSM: Jira, ServiceNow, Zendesk
- Data: PostgreSQL, ChromaDB, Qdrant, SAP HANA Cloud Vector Engine

## Production Hardening

- Store audit events in a database
- Use SSO and scoped service accounts
- Add workflow execution tests
- Monitor routing accuracy and escalation misses
- Keep a versioned prompt and decision policy
- Add redaction for personal or confidential data

