const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const incidents = JSON.parse(fs.readFileSync(path.join(root, 'data', 'incidents.sample.json'), 'utf8'));
const knowledgeBase = JSON.parse(fs.readFileSync(path.join(root, 'data', 'knowledge-base.json'), 'utf8'));

function retrieveRunbook(incident) {
  const rawText = `${incident.summary || ''} ${incident.description || ''} ${incident.system || ''}`.toLowerCase();
  const scored = knowledgeBase
    .map((entry) => ({
      ...entry,
      score: entry.keywords.reduce((sum, keyword) => sum + (rawText.includes(keyword) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0].score > 0
    ? scored[0]
    : {
        id: 'KB-GENERAL-000',
        title: 'General support triage',
        category: 'General IT',
        score: 0,
        guidance: 'Create a support ticket, collect logs or screenshots, and route to the responsible application owner.',
      };
}

function classify(incident) {
  const rawText = `${incident.summary || ''} ${incident.description || ''} ${incident.system || ''}`.toLowerCase();
  const match = retrieveRunbook(incident);
  const affected = Number(incident.affected_users || 1);
  const urgency = String(incident.urgency || 'medium').toLowerCase();
  const securitySignals = ['phishing', 'credential', 'breach', 'suspicious', 'mfa', 'password'].some((term) => rawText.includes(term));
  const outageSignals = ['outage', 'down', 'unavailable', 'cannot open', 'failed for all'].some((term) => rawText.includes(term));
  const accessChange = match.category === 'Access Management' || ['access', 'role', 'permission'].some((term) => rawText.includes(term));

  let severity = 'P4';
  if (securitySignals || affected > 50 || (outageSignals && affected > 20)) severity = 'P1';
  else if (urgency === 'high' || affected > 10) severity = 'P2';
  else if (urgency === 'medium' || affected > 1) severity = 'P3';

  let risk = 'low';
  if (securitySignals || severity === 'P1') risk = 'high';
  else if (accessChange || severity === 'P2') risk = 'medium';

  const humanApprovalRequired = risk !== 'low' || accessChange || affected > 5;

  return {
    request_id: incident.request_id,
    category: match.category,
    severity,
    risk,
    confidence: match.score >= 3 ? 'high' : match.score > 0 ? 'medium' : 'low',
    human_approval_required: humanApprovalRequired,
    queue: humanApprovalRequired ? 'human-review' : 'service-desk-auto-draft',
    knowledge_match: match.title,
  };
}

console.table(incidents.map(classify));

