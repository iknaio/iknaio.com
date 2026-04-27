---
title: "Pathfinder 2.0"
date: 2024-11-20
description: "Rethinking Manual Cryptoasset Tracing with Pathfinder 2.0"
tags: ["pathfinder", "investigation", "tracing", "product-update"]
image: "images/blog/iknaio-new-pathfinder-2-0-advancing-cryptoasset-tracing-methods/cover.png"
posttype: "insight"
aliases: ["/blog/iknaio-new-pathfinder-2-0-advancing-cryptoasset-tracing-methods/"]
---

**A Decade of Cryptoasset Tracing**

For over a decade, our team has been deeply engaged in the evolving field of cryptoasset tracing. We’ve witnessed foundational methodologies like address clustering progress from academic concepts to widely adopted tools in blockchain intelligence, now used globally by cryptoasset investigators. As the ecosystem grows, especially with the advent of account-model ledgers like Ethereum and an increasing variety of tokens, a shift in traditional approaches has become essential.

Beyond technical advances, our extensive experience has provided valuable insights into how investigators use these tools and the kinds of results they achieve. Pathfinder 2.0 reflects our efforts to address the major challenges we’ve identified over the years.

**Enhanced Address-Based Tracing**

While address clustering offers valuable insights, it’s critical to understand that these are heuristic approaches, which occasionally yield false positives. For instance, CoinJoin transactions can lead to inaccurate address clustering, mistakenly associating unrelated addresses with the same actor. While seasoned investigators are equipped to navigate these nuances, the majority of tools lack transparency in their clustering methodologies, which can mislead users and potentially compromise investigations.

We highlighted this concern years ago in our article, Safeguarding the Evidential Value of Forensic Cryptoasset Investigations​,****and have since seen real cases where investigations faltered due to misapplied clustering. Additionally, address clustering has been criticized by defense experts who argue it lacks the transparency and reliability necessary for evidential use​.

Pathfinder 2.0 addresses these issues with a robust, transaction-level tracing approach, following the money from source to recipient address to ensure the highest evidential standards. Address clustering remains available but is designed to encourage users toward this more reliable, transaction-centric methodology. We also continue to propagate tags across addresses using conservative co-spent clustering, preserving transparency and evidential integrity.

**Unified UTXO- and Account-Model Tracing**

Bitcoin’s UTXO model and Ethereum’s account-based model differ fundamentally, with Bitcoin allowing for multi-input, multi-output transactions and Ethereum featuring simpler, single-input and output transactions with smart contracts and a variety of token systems. Early forensic tools, including Pathfinder’s previous version, often struggled to integrate these two models seamlessly, requiring investigators to adapt workflows to each platform’s constraints.

In Pathfinder 2.0, we revisited our design principles and reimagined tracing around asset flows, an approach that natively supports both UTXO and account-model ledgers. This abstraction offers investigators a coherent experience across BTC, ETH, and other account-model tokens, supporting smooth, adaptable tracing.

**Pathfinder: A Streamlined Solution for Every Desk**

Our open-source Pathfinder solution prioritizes the needs of the majority of investigations, which involve tasks like determining balances and tracing flows to and from exchanges. For these standard investigations, Pathfinder provides an efficient and accessible tool for institutions dealing with crypto. More than 85% of cases benefit from this streamlined approach, without the extensive costs of more complex tracing platforms.

Pathfinder's capabilities focus on this majority use, ensuring affordability and simplicity. For more complex cases, we incorporate automated procedures for asset flow tracking through our Data Analytics Platform, using Pathfinder to then visualize and interpret the identified paths. This approach effectively meets both routine and advanced investigations needs.

