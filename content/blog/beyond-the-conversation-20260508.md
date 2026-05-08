---
title: "beyond the conversation"
date: "2026-05-08"
description: "how the model context protocol and react loops are defining the next generation of agentic infrastructure"
tags: ["system-design", "mcp", "agentic-ai", "aws-summit-2026"]
---

for the past few years, llms have always been brains in a jar, capable of conversation but disconnected from action. we are now moving past the chatbot era and into the age of agentic ai where the focus has shifted from how a model talks to how it performs.

## core fundamentals of the react loop: reason, act, remember

true autonomy requires more than just a single prompt. it requires a feedback loop and the foundation of any agentic system is the ReAct loop.

the process is cyclical:

1. `reason`: the llm interprets the user intent and formulates a step-by-step plan.
2. `act`: the agent executes a specific tool (e.g., fetching a database record or calculating risk).
3. `remember`: the results are stored in the agent's memory - both short-term (current session state) and long-term (user profiles and episodic history).
4. this loop allows for self-correction. if a tool returns an error, the agent doesn't crash but it reasons about the failure and acts again with a different approach.

## evolution of the user experience

the transition from traditional web applications to agentic ai represents a massive shift in how users interact with data

traditional app experience

- a user interacts with a website. the website calls specific apis, which pull from fixed data stores. this is a linear, rigid path where the user must navigate the interface to find what they need.

agentic ai app experience

- a user interacts with an ai assistant. this assistant doesn't just call a pre-defined api; it uses tools via mcp (model context protocol) to browse semantic apis and reference data dynamically. it can bridge the gap between natural language intent and backend system execution autonomously.

## putting theory into practice

the react loop is the engine of an ai agent. using an insurance quote as an example, the process follows a recursive cycle:

1. input: user says, "i need a car insurance."
2. state management: the agent retrieves the system prompt and current context.
3. reasoning: the agent determines it needs driver details.
4. action: it invokes a tool: get_driver_details(user).
5. observation: it receives data, updates its state, and realises it now needs vehicle and risk data.
6. loop: this continues until all variables (driver + cars + risk) are gathered to generate a final quote response.

## mcp: the universal connector

one of the biggest bottlenecks in agentic design has been the "n+1" problem: every time you add a new data store (sql, nosql, external apis), you have to write a custom tool for the agent.

the model context protocol (mcp) solves this by acting as the usb-c for ai. instead of building bespoke integrations, engineers can now use a standardised protocol to connect agents (mcp clients) to data sources (mcp servers). by standardising these interactions, the harness remains decoupled from the specific database implementation, allowing agents to navigate complex enterprise data environments using a single, unified interface.

## memory as an infrastructure component

an agent without memory is just a function. to move toward long-term autonomy, the harness must manage a complex memory stack:

- `short-term memory`: manages the scratchpad and the current action plan. this is often framework-dependent and sits in the backend data store.
- `long-term memory`: involves semantic retrieval from vector stoares and episodic memory (learning from historical interactions via reinforcement learning).
- `system prompts`: the version-controlled instructions that define the agent's persona and operational boundaries.

## validation is the new unit test

your agentic system is only as good as your ability to measure it. because llms are non-deterministic, the harness must include deterministic verification loops. every action must be validated against business logic and security protocols before it is executed.

only when we can programmatically prove that an agent's thought aligns with our rules can we truly call the system trustworthy.

## key takeaways

- `agent = model + harness`: the brain needs a body to be useful.
- `decouple via mcp`: stop building custom tools; start building standardised servers.
- `manage the state`: use stateful graphs to allow for rewinds and retries in complex reasoning paths.

the era of talking to a box is ending. by moving from a single prompt-response to a persistent react loop, we are effectively giving the ai brain a functional body. and by standardising connections with mcp and managing state with a robust harness, we shift our focus from how well the model talks to how much the system can actually do.

in 2026, the real engineering challenge isn't the llm but the infrastructure we build around it.

## credits / more info

- https://docs.aws.amazon.com/bedrock-agentcore/
- https://modelcontextprotocol.io/docs/getting-started/intro
- https://www.ibm.com/think/topics/react-agent
