# FL-05: Agent Concepts and MCP Basics

**Track:** General AI Fluency
**Code:** FL-05
**Author:** Emmanuel Chukwukere Obinna
**Live Production URL:** https://frontend-ai-capstone-two.vercel.app/
**Source Repository:** https://github.com/ephysians/frontend-ai-capstone

---

## 1. Workflow vs. Agent: The Real Distinction

The word "agent" is everywhere right now, and it is almost always wrong. Most things people call agents are workflows. Understanding the difference is not academic — it determines whether you can evaluate an AI product honestly or just repeat its marketing copy.

A **workflow** is a fixed sequence of steps where the control flow is defined in advance by a human. Each stage has a predetermined input, a predetermined output, and a predetermined next step. The AI inside a workflow is a capable executor, but it does not decide what to do next. It does what the pipeline tells it to do. If a step fails, the workflow either stops or follows a pre-written error branch. There is no reasoning about what to try instead.

An **agent** is different in one specific way: it uses the model's own output to decide what action to take next, including which tools to call, in what order, and whether to loop back and try again. The control flow is not written in advance — it emerges from the model's reasoning at runtime. Anthropic's canonical framing puts it plainly: the degree of agency is the degree to which the model directs its own process. A fully agentic system might receive a goal, choose its own tools, execute them, observe the results, revise its plan, and repeat — all without a human scripting each transition.

The practical consequence is that workflows are predictable and auditable. Agents are more capable on open-ended tasks but harder to verify, more likely to compound errors across steps, and more expensive to run. Neither is universally better. The right choice depends on whether the task genuinely requires dynamic decision-making or whether a well-designed fixed pipeline is sufficient.

---

## 2. FL-04 Classification: Workflow, Not Agent

My FL-04 pipeline — Prompt → AI Generation → Automated Verification → Human Review → Rule Capture — is a **workflow**.

Every transition is defined in advance. The AI generates code when given a prompt. The test runner executes when code is produced. Human review happens when tests pass. Rule capture happens when a defect is found. None of these transitions are decided by the model at runtime. The model does not observe the test results and choose whether to regenerate. It does not read `CLAUDE.md` and decide to revise its output. A human makes every routing decision.

The AI inside the pipeline is doing real work — generating production-grade TypeScript, writing Vitest test suites, handling accessibility edge cases — but it is operating as a capable step inside a human-directed sequence, not as the director of that sequence. That is the definition of a workflow.

---

## 3. What MCP Is and Why It Matters

MCP stands for Model Context Protocol. It is an open standard, introduced by Anthropic, that defines how AI models connect to external tools, data sources, and services in a consistent way. The analogy used in the official documentation is accurate: MCP is the USB-C port for AI applications. Before it, every AI integration was a custom wire. MCP standardises the socket.

The protocol defines three primitives:

**Tools** are executable functions the model can invoke. A tool takes structured inputs, performs an action — reading a file, running a query, calling an API — and returns a result. The model decides when to call a tool based on the task at hand. This is the primitive that enables AI to do things plain chat cannot: touch the filesystem, query a live database, run a shell command.

**Resources** are data sources the model can read. Where a tool performs an action, a resource exposes content — a file, a document, a database record — that the model can incorporate into its context. Resources are read-only by design; they inform the model without giving it write access.

**Prompts** are reusable, parameterised instruction templates that a server can expose to a client. They allow teams to standardise how a model is instructed for recurring tasks, keeping prompt logic on the server rather than scattered across client applications.

Together, these three primitives let an AI model reach beyond its training data and interact with the live state of a system — which is the prerequisite for any genuinely useful agentic behaviour.

---

## 4. MCP in Practice: Three Tasks Run Through Amazon Q

The MCP connector used here is the Amazon Q Developer IDE plugin, active in VS Code. Amazon Q exposes filesystem and shell tools via MCP to the model running in this chat. Plain chat — a standard ChatGPT or Claude web session with no plugins — cannot read files from a local disk, traverse a directory tree, or execute shell commands. The three tasks below are things that required tool calls, not knowledge retrieval.

---

### Task 1 — Read `WORKFLOW.md` from local disk

**Tool called:** `fsRead`
**Input:** `c:\Users\PC-039\OneDrive\Documents\flyrank directory\frontend-ai-capstone\frontend-ai-capstone\WORKFLOW.md`
**What it returned:** The full contents of the FL-04 workflow document — 7 sections, 5 run records, the Mermaid diagram, timing tables, and the failure-point checklist — read directly from the local filesystem at the moment of the request.
**Why chat alone cannot do this:** A plain chat session has no access to the local filesystem. It cannot read a file that has never been uploaded or pasted into the conversation. The model would have to guess or hallucinate the contents. The tool call returned the exact, live file.

> Screenshot: see `access-screenshots/fl05-task1-fsread-workflow.png`

---

### Task 2 — List the directory tree of `lib/`

**Tool called:** `listDirectory`
**Input:** `c:\Users\PC-039\OneDrive\Documents\flyrank directory\frontend-ai-capstone\frontend-ai-capstone\lib`
**What it returned:** The exact file tree:
```
lib/
|-- chat-config.ts
|-- search-filter.ts
|-- tools.ts
|-- use-focus-trap.ts
`-- utils.ts
```
**Why chat alone cannot do this:** A plain chat session cannot traverse a directory on a local machine. It has no knowledge of what files exist, what was added recently, or what the current state of the project is. The tool call returned the live directory state, including `use-focus-trap.ts` which was added in FL-04 Run 5.

> Screenshot: see `access-screenshots/fl05-task2-listdir-lib.png`

---

### Task 3 — Read `CLAUDE.md` and report its exact live rules

**Tool called:** `fsRead`
**Input:** `c:\Users\PC-039\OneDrive\Documents\flyrank directory\frontend-ai-capstone\frontend-ai-capstone\CLAUDE.md`
**What it returned:** The exact contents of the project's AI instruction file, including the three engineering rules added during FL-04: the `module.exports` guard convention, blur-and-submit form validation, and live submit-button state computation.
**Why chat alone cannot do this:** The rules in `CLAUDE.md` were written during this project and do not exist in any model's training data. A plain chat session would have no way to retrieve them. The tool call read the file as it exists on disk right now.

> Screenshot: see `access-screenshots/fl05-task3-fsread-claude.png`

---

## 5. What FL-04 Would Need to Become an Agent

The one concrete upgrade that would push FL-04 from workflow to agent is **automated test-failure re-prompting**.

Currently, when `npx vitest run` fails, a human reads the error, decides what to fix, and either edits the code manually or writes a new prompt. The routing decision — what to do when tests fail — is made by a person.

An agent version of this pipeline would give the model access to the test runner as a tool. After generating code, the model would call the tool, receive the test output, read the failure messages, and decide autonomously whether to revise the implementation, adjust the test, or escalate to a human. The control flow would emerge from the model's reasoning about the test results rather than from a human scripting each transition.

This is a meaningful upgrade for a specific reason: it closes the feedback loop that currently requires human attention on every failed run. But it also introduces the failure modes that make agents harder to trust than workflows — the model might loop on a failing test, make increasingly speculative fixes, or silently introduce a regression while chasing a green result. Those risks are why the human review stage in FL-04 is not just a gate but a genuine audit. An agent that bypasses it would be faster and less reliable. Whether that trade-off is worth making depends on the stakes of the code being shipped.

---

## 6. Evidence Summary

| Task | Tool Called | File / Path Accessed | Chat Alone Could Do This? |
|---|---|---|---|
| Read `WORKFLOW.md` | `fsRead` | `WORKFLOW.md` (local disk) | No |
| List `lib/` directory | `listDirectory` | `lib/` (local disk) | No |
| Read `CLAUDE.md` rules | `fsRead` | `CLAUDE.md` (local disk) | No |

**MCP client used:** Amazon Q Developer IDE plugin (VS Code)
**MCP server:** Amazon Q built-in filesystem and shell tool server
**MCP state:** Enabled (`mcp-state.json` → `{"enabled":true}`)
**Tools registered:** `fsRead`, `listDirectory`, `fileSearch`, `executeBash`, `fsWrite`, `fsReplace`

---

## 7. FL-04 Workflow vs. Agent: One-Line Summary

FL-04 is a **workflow**. Every stage transition is decided by a human. The AI generates; the human routes. To become an agent, the model would need to observe its own test results and decide what to do next — closing the loop without waiting for a human to make the routing call.
