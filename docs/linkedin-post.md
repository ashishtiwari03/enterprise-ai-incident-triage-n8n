I built a small enterprise AI automation project with n8n.

The workflow handles IT incident triage from intake to routing:

- receives an incident through a webhook
- classifies category, severity, and risk
- retrieves matching runbook guidance
- decides whether human approval is needed
- returns a structured response with audit fields

I wanted to avoid making another chatbot demo. The interesting part of enterprise AI is not only generating text. It is connecting AI assistance with business rules, approvals, existing systems, and traceability.

The project is designed around the same pattern companies are moving toward with AI orchestration: deterministic workflow logic where the answer must be correct, and AI-assisted retrieval where context helps the user move faster.

Stack: n8n, Docker, webhook automation, JSON knowledge base, JavaScript Code nodes.

Next step: connect it to Jira or Microsoft Teams and replace the local knowledge matching with a vector database.

