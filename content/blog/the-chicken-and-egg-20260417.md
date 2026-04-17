---
title: "the chicken and egg problem"
date: "2026-04-17"
description: "solving the chicken-and-egg paradox during a kubernetes security hardening"
tags: ["kubernetes", "infrastructure", "devops", "karpenter", "aws"]
---

## the infrastructure paradox

i recently hit a textbook kubernetes deadlock: a chicken-and-egg problem where the provisioner needs a node to start, but the node can't exist until the provisioner starts it.

## kubernetes lesson: my recovery post-mortem

these lessons were born from a security update i ran that turned into a full-scale cluster recovery. i was moving my services to a hardened clusterip-based model to transition away from public-facing load balancers and nodeports. however, in the process of locking down the cluster, i accidentally deadlocked the entire system.

## the control plane deadlock (the literal chicken and egg)

i encountered a circular dependency where karpenter (the tool i use to provision nodes) was stuck in a `pending` state because there were no nodes available. the cluster couldn't create new nodes because the karpenter pod wasn't running to tell aws to provision them.

- my scheduling rules were too rigid, by removing a strict `nodeaffinity` that forced karpenter to run only on system nodes, i allowed it to self-rescue by spinning up on any available app node.
- critical infrastructure controllers must have flexible scheduling. if the provisioner is too picky about its house, it can't build the rest of the neighborhood.

## node density vs instance type

i was using small aws instances (like `t4g.micro`) which have very low pod limits due to aws eni (elastic network interface) constraints. during my update of 15 microservices, the cluster briefly tried to run the old and new versions simultaneously. i hit the pod limit ceiling almost instantly.

- for large updates, ensure that my nodepool has enough burst headroom.
- the infrastructure needs to be able to temporarily double in size to handle a rolling deployment. instance types with higher eni limits are worth the cost for high-density microservice environments.

## cattle, not pets philosophy

during the recovery, i watched pods being evicted, nodes entering `notready` states, and new nodes flickering into existence. in traditional systems, this looks like a total crash. in kubernetes, this is the system working exactly as intended.

- don't panic at `terminating` or `pending` statuses.
- as long as my control plane is alive, kubernetes is designed to treat pods as disposable and will eventually drive the cluster back to my desired state.

## gradual vs batch rollouts

i tried to update all 15 microservices in a single batch, while efficient, it puts massive pressure on the cluster’s networking and compute capacity all at once.

- efficiency is the enemy of stability during high-stakes updates.
- moving forward, stagger updates in smaller groups (e.g., 3 at a time) to keep the cluster churn manageable and avoid overwhelming the scheduler.

## troubleshooting strategy

debugging this deadlock required me to follow a specific breadcrumb trail of cluster events:

1.  **`kubectl get pods`**: identified the symptom (everything was pending).
2.  **`kubectl describe pod`**: found the clue ("too many pods" or "unschedulable").
3.  **`kubectl get nodes`**: identified the bottleneck (nodes were notready or overloaded).
4.  **`kubectl get nodepool`**: found the root cause (resource limits hit).

## the terminal war room: k9s

while the manual breadcrumb trail was great for learning the nervous system, i quickly learned that manually typing four different commands is too slow during a real-time crisis. i've now moved my troubleshooting into k9s, and it has been the single biggest productivity boost for my workflow.

it aggregates everything into a few keystrokes, allowing for immediate context switching. instead of jumping between separate commands, i can now toggle from `:pods` to `:nodes` to `:events` in seconds.

seeing the red text for my pending pods and hitting `d` to describe them instantly gives me a real-time view of the scheduler's complaints. it’s significantly faster than following a manual trail.

## wrap up

this post-mortem wasn't just about a technical fix but a shift in how i observe my systems. moving from the manual breadcrumb trail to the real-time visibility of k9s changed how i interact with the cluster.

the takeaway is also simple: don't over-restrict your control plane, watch your eni limits and treat your infra like cattle. the more disposable the components, the more permanent the uptime.

## credits / more info

- https://k9scli.io/
