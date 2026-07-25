---
title: "Operation Alice"
date: 2026-04-26
description: "How we used network thinking and direct data analysis to support the takedown of a darknet CSAM platform spanning 373,000 domains and 5,170 Bitcoin addresses."
posttype: "case-study"
image: "images/insights/operation-alice/sperrbanner.png"
aliases: ["/blog/operation-alice/"]
tags: ["case-study", "law-enforcement", "investigations-as-code", "darknet"]
---

## A 10-day operation, years of preparation

Between March 9 and 19, 2026, law enforcement agencies in 23 countries, coordinated by [Europol](https://www.europol.europa.eu/), executed [Operation Alice](https://www.polizei.bayern.de/OP-Alice). The operation took down 373,000 darknet domains, identified roughly 440 customers, and seized 105 servers. About 90,000 of those domains advertised child sexual abuse material (CSAM). The operator, a 35-year-old based in China, ran the platform for years before investigators in Bavaria began pulling the threads in mid-2021. More than 80% of all known illicit sites on the dark web are now under the control of Bavarian authorities.

We supported the investigation in its early phase. This post is a behind-the-scenes account. We focus on how we worked, why network thinking was the key move, and where cryptoasset investigations are heading next.

## The challenge: 5,170 starting points

The investigation began with a CSAM platform discovered on the dark web, called *Alice with Violence CP*. The platform was duplicated across more than 1,200 onion domains, each requiring a Bitcoin payment for full access. Together, those domains exposed 5,170 Bitcoin addresses used by the operators to receive payments.

![Redacted landing page of the Alice with Violence darknet platform, with content thumbnails blacked out above duplicated onion domains](/images/insights/operation-alice/figure-1.png)

That number is the entire problem in one figure. Investigating one Bitcoin address by hand takes hours. Investigating 5,170 by hand is not an investigation, it is a project plan. Off-the-shelf forensic tools, the kind designed for ad-hoc, address-by-address case work, do not solve a problem of that shape. Manual workflows are inconsistent across analysts, hard to reproduce, and impossible to scale to the volumes real darknet operations now generate.

## Working directly with the data

We took a different approach. Instead of treating each address as a separate case, we treated all 5,170 addresses as a single seed dataset. We implemented the entire forensic procedure in a [Jupyter notebook](https://jupyter.org/), working against the [Iknaio Cryptoasset Analytics Platform API](https://api.iknaio.com/docs) and [CFLW's](https://cflw.com/) [Dark Web Monitor API](https://api.dark-web-monitor.cflw.com/v3/docs). Any action an analyst would normally perform manually in a tracing dashboard can also be automated through these APIs. That capability was essential at this scale, and the seed addresses were only the beginning.

The investigation then ran in three main steps.

First, since we were dealing with Bitcoin addresses, we applied the well-known multiple-input heuristic to the seed dataset to retrieve further addresses likely controlled by the same operators. Heuristics can produce false positives, so we cross-checked each candidate against the Dark Web Monitor to confirm that it actually appeared on the dark web in the context of an illicit site. That left us with roughly 2,000 addresses that (i) were demonstrably abused for illegal purposes and (ii) had received payments. The cross-check also surfaced additional dark web sites that referenced these same addresses, expanding the perimeter of the investigation.

Exploratory analysis of these addresses surfaced the most important finding at this stage: addresses were **reused across dark web sites**. An operator would only expose the same address on two different sites if they controlled both. On that assumption, we constructed a network in which each node is a site and each edge represents addresses shared between two sites.

![Network graph of dark web sites linked by shared Bitcoin addresses, revealing dense clusters of related platforms](/images/insights/operation-alice/figure-2.jpeg)

The picture that emerged was not one site but a whole network of platforms, each duplicated across thousands of onion domains. That alone justified action against all of them. From the extended and validated address dataset, we then automatically traced (i) incoming transactions to identify likely consumers and (ii) outgoing transactions to identify operator cash-out paths. We compiled two evidence packages for cryptoasset exchange data requests and handed them to the authorities.

## Investigations as Code

What we just described is, in effect, an **automated forensic workflow**. Every step is documented in code, runs against a known dataset, and produces the same result on re-execution. We call this approach **Investigations as Code**.

The benefits are the ones engineering disciplines have relied on for decades:

- **Reproducible.** Any analyst (or court-appointed reviewer) can re-run the workflow and reach the same conclusions, given the same data.
- **Repeatable.** The next case with similar shape (a different platform, a different set of seed addresses) reuses the same code with minimal changes.
- **Sharable.** Workflows can be packaged and exchanged across teams and jurisdictions. What one country learns, others can apply.
- **Scalable.** Whether the input is 50 addresses or 50,000, the cost in analyst time stays roughly constant.

Investigations as Code does not replace investigators. It changes what they spend their time on: less mechanical lookup, more interpretation, hypothesis testing, and judgment.

## The lesson: data first, tools second

Operation Alice succeeded because the right data was available, comprehensive, and queryable. The investigation rested on two datasets: the address-graph data held in the Iknaio Cryptoasset Analytics Platform, and the dark web sites indexed by the Dark Web Monitor. Without them, no workflow, however well coded, would have produced the network we needed to trace.

That is the broader pattern we see across cryptoasset investigations today. The agencies and teams that get the most out of blockchain analytics are not the ones with the flashiest UIs or the most expensive off-the-shelf tools. They are the ones who hold their data, understand its structure, and use modern data-science tools (Python, SQL, graph libraries, notebooks) to interrogate it. Tools matter, workflows matter, but neither carries the investigation if the underlying data is shallow or out of reach.

We expect the gap between data-fluent and tool-dependent investigative units to widen over the next few years. Operation Alice is a useful early example of what the data-fluent end of the spectrum looks like in practice.