# Claude.md - Project Guidelines & Agent Instructions

## Tool Accessibility Status

| Tool | Status | Verified |
|------|--------|----------|
| n8n-MCP Server | ✅ ACCESSIBLE | API connectivity confirmed |
| n8n-skills | ✅ ACCESSIBLE | Expression syntax, workflow patterns, validation |
| n8n API | ✅ CONNECTED | https://agenticailerner.app.n8n.cloud/ |
| GitHub MCP | ✅ CONFIGURED | Via GITHUB_PAT in .env |

**All required tools are accessible and ready for building flawless n8n workflows.**

---

## Project Overview

This project transforms **n8n workflows into secure, production-grade web applications**. The system bridges workflow automation with modern frontend development, enabling non-technical users to interact with complex automations through intuitive web interfaces.

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   n8n Workflows │────▶│  External APIs  │
│   (Frontend)    │◀────│   (Backend)     │◀────│  & Services     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│     Vercel      │ ◀── GitHub (auto-deploy)
└─────────────────┘
```

---

## System Components

### 1. n8n Workflows
- Serve as the backend API layer
- Accept HTTP/Webhook requests from the frontend
- Return structured, validated JSON responses
- Must be **application-ready** (no UI dependencies)

### 2. Frontend Web Application
- **Framework**: Next.js + React
- **Requirements**:
  - Production-quality UX
  - Comprehensive error handling
  - Loading states for all async operations
  - Input validation (client & server-side)
  - Secure API communication

### 3. Version Control & Deployment
- **Repository**: GitHub
- **Deployment**: Vercel (automatic sync)
- **Flow**: Code change → GitHub push → Vercel auto-deploy

---

## Required Tools & MCP Configuration

### N8n-MCP Server (MANDATORY)
- **Repository**: https://github.com/czlonkowski/n8n-mcp
- **Purpose**: Inspect, modify, and manage n8n workflows programmatically
- **Security**: Store MCP connection details in `.env`; never log, expose, or hardcode MCP endpoints or credentials

### n8n-skills (MANDATORY)
- **Repository**: https://github.com/czlonkowski/n8n-skills
- **Purpose**: Workflow patterns, node configurations, expression syntax, and validation
- **Security**: Treat workflow metadata and node configurations as sensitive operational data; access only via authorized MCP sessions. Store configuration in `.env`

### GitHub MCP
- **Repository**: https://github.com/github/github-mcp-server
- **Purpose**: Repository management, commits, and CI/CD operations
- **Security**: Use with least-privilege access; never expose repository tokens in code or logs

### Frontend Designer Skill
- **Reference**: https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
- **Purpose**: UI/UX design guidance for React components

---

## MANDATORY: n8n Workflow Quality Requirements

**Claude Code MUST treat n8n-MCP and n8n-skills as fully accessible tools within this project.**

### When Building or Modifying n8n Workflows, You MUST:

1. **Use n8n-MCP** to:
   - Inspect existing workflow structure before modifications
   - Validate node configurations
   - Retrieve available nodes and their parameters
   - Test workflow execution
   - Ensure webhook endpoints are properly configured

2. **Use n8n-skills** to:
   - Apply correct expression syntax (`{{ $json.field }}`, `{{ $node["name"].json }}`)
   - Follow proven workflow patterns
   - Configure nodes with all required parameters
   - Handle errors properly within workflows
   - Validate data transformations

### Workflow Quality Standards (NON-NEGOTIABLE)

All workflows MUST be:
- **Flawless**: No syntax errors, no misconfigured nodes
- **Complete**: All required nodes and connections in place
- **Fully Configured**: Every node has all required parameters set
- **Production-Ready**: Error handling, proper responses, clean data contracts
- **Free of Missing Steps**: No placeholder nodes, no "TODO" comments
- **Free of Assumptions**: All configurations verified via MCP tools

### Workflow Validation Checklist

Before considering any workflow complete:
- [ ] Used n8n-MCP to inspect current workflow state
- [ ] All nodes have required parameters configured
- [ ] Webhook/HTTP triggers have proper response configurations
- [ ] Error handling nodes are in place where needed
- [ ] Data transformations use correct n8n expression syntax
- [ ] Tested workflow execution via n8n-MCP
- [ ] Response format matches frontend expectations

### If a Capability Exists in n8n-MCP or n8n-skills, YOU MUST USE IT

Do NOT:
- Guess at node configurations
- Assume expression syntax
- Skip validation steps
- Create incomplete workflows
- Leave nodes with default/placeholder values

---

## Environment Variables

### Required `.env` Configuration

```env
# n8n API Configuration
N8N_API_URL=https://agenticailerner.app.n8n.cloud/
N8N_API_KEY=your_n8n_api_key_here

# GitHub Configuration
GITHUB_PAT=your_github_pat_here

# MCP Configuration (if applicable)
MCP_ENDPOINT=your_mcp_endpoint_here
```

### Security Rules (MANDATORY)

1. **`.env` files are REQUIRED** for all sensitive configuration
2. **`.env` MUST be in `.gitignore`** - verify before every commit
3. **Secrets must NEVER appear in**:
   - Source code (hardcoded values)
   - Git commits or history
   - Frontend bundles (client-side code)
   - Logs or error messages
   - Console output or debugging statements

---

## Agent Behavior Guidelines

### General Principles

1. **Security First**: Always validate that secrets are in `.env` before any operation
2. **Deliberate Tool Use**: Use MCP tools only when required, not speculatively
3. **Minimal Changes**: Make only the changes necessary to complete the task
4. **Production Quality**: All code must be deployment-ready

### When Working with n8n Workflows

1. **Inspect before modifying** - Understand the workflow structure first
2. **Validate inputs/outputs** - Ensure clean data contracts
3. **Test webhook endpoints** - Verify HTTP request/response cycles
4. **Document changes** - Note any workflow modifications

### When Building Frontend Components

1. **Follow Next.js conventions** - App Router, Server Components where appropriate
2. **Implement error boundaries** - Graceful failure handling
3. **Add loading states** - UX feedback for all async operations
4. **Validate all inputs** - Client-side and API-level validation
5. **Use environment variables** - Access via `process.env.NEXT_PUBLIC_*` for client-side only when necessary

### When Deploying

1. **Verify `.gitignore`** - Confirm `.env` is excluded
2. **Check for hardcoded secrets** - Scan code before commits
3. **Test locally first** - Validate functionality before push
4. **Use Vercel environment variables** - Configure secrets in Vercel dashboard, not in code

---

## Project Structure (Expected)

```
├── .env                    # Local environment variables (NEVER commit)
├── .env.example            # Template for required variables (safe to commit)
├── .gitignore              # Must include .env
├── next.config.js          # Next.js configuration
├── package.json
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and API clients
│   └── styles/             # CSS/styling
├── public/                 # Static assets
└── Claude.md               # This file
```

---

## API Communication Pattern

### Calling n8n Workflows from Next.js

```typescript
// src/lib/n8n-client.ts
const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

export async function callWorkflow(workflowPath: string, data: unknown) {
  const response = await fetch(`${N8N_API_URL}${workflowPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${N8N_API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Workflow error: ${response.status}`);
  }

  return response.json();
}
```

### Server-Side Only
- API keys must only be used in **Server Components** or **API Routes**
- Never expose `N8N_API_KEY` to the client bundle

---

## Checklist Before Every Commit

- [ ] `.env` is in `.gitignore`
- [ ] No hardcoded secrets in any file
- [ ] No secrets in console.log or error messages
- [ ] Environment variables used for all sensitive values
- [ ] API calls made server-side only (for authenticated requests)
- [ ] Error handling implemented
- [ ] Loading states present for async operations

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Check for secrets in codebase (run before commits)
grep -r "eyJ" --include="*.ts" --include="*.tsx" --include="*.js" .
grep -r "github_pat" --include="*.ts" --include="*.tsx" --include="*.js" .
```

---

## Forbidden Actions

1. **NEVER** hardcode API keys, tokens, or credentials
2. **NEVER** commit `.env` files
3. **NEVER** log sensitive data
4. **NEVER** expose secrets in client-side code
5. **NEVER** use MCP tools without clear purpose
6. **NEVER** modify workflows without understanding their current state
7. **NEVER** deploy without verifying security checklist

---

## ⚠️ CRITICAL: n8n Execution Limits & Safeguards

### Background: Execution Loop Incident
A previous session caused an **uncontrolled execution loop** that:
- Nearly exhausted all n8n execution credits
- Triggered mass email generation
- Resulted in Google blocking the email account

**This must NEVER happen again.**

### Execution Budget Rules (MANDATORY)

| Context | Maximum Executions | Notes |
|---------|-------------------|-------|
| Testing integration | **1** (hard max: 2) | Single validation only |
| Development iteration | **0** | Use static inspection |
| Debugging | **0** | Analyze logs, not re-execute |
| Production deployment | **0** | Frontend only, workflow already validated |

### Before ANY n8n Execution

1. **Static Inspection First**: Use `n8n_get_workflow` to inspect configuration without executing
2. **Verify Workflow is INACTIVE**: Check `active: false` before any modifications
3. **Check for Loop Risks**:
   - Schedule triggers (cron-based)
   - Recursive webhook calls
   - Error retry configurations
   - Connected email nodes
4. **Disconnect Dangerous Nodes**: If email nodes exist, disconnect or mock them before testing
5. **Mental Walkthrough**: Trace the entire flow mentally before executing

### Loop Prevention Checklist

Before enabling or testing any workflow:
- [ ] Workflow `active` status is `false`
- [ ] No schedule/cron triggers (or they are disabled)
- [ ] No recursive HTTP calls back to same workflow
- [ ] Email nodes are disconnected or mocked
- [ ] Webhook trigger is NOT connected if workflow is active
- [ ] Error handling does NOT trigger re-execution
- [ ] Test with single, isolated request only

### Emergency Procedures

If execution loop is detected:
1. **IMMEDIATELY** deactivate workflow via `n8n_update_full_workflow` with `active: false`
2. Disconnect the trigger node from the flow
3. Report the issue with execution count
4. Do NOT attempt to "fix and retry" - stop and analyze

### Email Node Safety

**Email nodes require special handling:**
- Always disconnect email nodes during testing
- Never test email functionality with real addresses
- Use mock/test email services if email testing is required
- Rate limit any email operations (1 per minute max)

### Execution Tracking

After any testing session, document:
```
## Execution Report
- Date: [DATE]
- Workflow: [NAME/ID]
- Executions Used: [COUNT]
- Purpose: [REASON]
- Result: [SUCCESS/FAILURE]
- Loop Risk Status: [ELIMINATED/PRESENT]
```

---

## Resource Efficiency Guidelines

### n8n Credit Conservation

1. **Inspect, Don't Execute**: Use MCP read operations instead of test executions
2. **Validate Statically**: Check expressions, connections, and configurations without running
3. **Single-Shot Testing**: One execution maximum per integration test
4. **Batch Changes**: Make all modifications before testing, not iteratively

### Claude Code Efficiency

1. **Minimize Redundant Operations**: Don't re-read files unnecessarily
2. **Parallel Tool Calls**: Batch independent operations
3. **Avoid Verbose Experimentation**: Plan before executing
4. **Direct Solutions**: No exploratory debugging loops

### Core Philosophy

> The purpose of automation is to **optimize processes and conserve resources**, not to consume them excessively. Every action must align with efficiency, stability, and sustainability.
