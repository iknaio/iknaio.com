---
title: "CoinJoin Detection"
date: 2026-05-12
description: "How we spot CoinJoin transactions at Iknaio, and why that matters for blockchain analytics."
tags: []
image: "images/insights/coinjoin-detection/cover.png"
posttype: "insight"
aliases: ["/blog/coinjoin-detection/"]
---

## What is a CoinJoin

Bitcoin is pseudonymous, which means users operate under addresses rather than real identities, but every transaction is public. Clustering techniques like the multi-input heuristic can link together hundreds of addresses under a single actor. If two inputs appear in the same transaction, they are often controlled by the same entity, and that assumption is the foundation of most address clustering in blockchain analytics.

CoinJoin is the class of methods that deliberately break that assumption. A CoinJoin is a cooperative transaction where several independent users combine their spends into a single on-chain transaction, with each participant contributing their own inputs and receiving their own outputs. Without knowledge about CoinJoins the transaction still looks like "one entity spent all these inputs and sent money to all these outputs", but that is no longer true. The multi-input heuristic is exploited and becomes misleading, and any clustering built on top of it pulls strangers into the same cluster.

For an investigator, walking into a CoinJoin unaware means chasing outputs that were never controlled by the subject, and attributing funds to the wrong cluster. Detecting CoinJoins up front makes it possible to know *before* tracing begins whether a given transaction can be trusted as a simple transfer or has to be treated as a mixing event.

## How to recognise a CoinJoin

Every CoinJoin method leaves a structural fingerprint in the shape of its inputs and outputs. The engine behind Iknaio exploits this by running six independent checks on every Bitcoin transaction, one per major method in the wild today, based on [Schnoering and Vazirgiannis (2023)](https://arxiv.org/abs/2311.12491) with adjustments as the methods evolve.

The six methods differ mostly in three dimensions: how the participants coordinate, what the output amounts look like after mixing, and how many people are required.

- **JoinMarket** is peer-to-peer with no coordinator and a flexible denomination, which makes it the loosest fit and the easiest to confuse with a normal transaction.
- **Wasabi 1.0** adds a central coordinator and fixes the post-mix value near 0.1 BTC.
- **Wasabi 1.1** extends that with doubling levels so a single round can produce outputs at 0.1, 0.2, 0.4 and 0.8 BTC simultaneously.
- **Wasabi 2.0** (WabiSabi) throws the fixed denomination out entirely and derives a dynamic value set from the transaction's own outputs, but is flagged by the detection engine when a transaction has at least 20 inputs.
- **Whirlpool** has two transaction types: a preparation step (Tx0) that produces pre-mix outputs plus a coordinator fee and an OP_RETURN (a special type of output in Bitcoin), and the mix itself, which always has exactly 5 inputs and 5 outputs at a fixed pool denomination.

| | JoinMarket | Wasabi 1.0 | Wasabi 1.1 | Wasabi 2.0 | Whirlpool Tx0 | Whirlpool CJ |
|---|---|---|---|---|---|---|
| Fixed denomination | flex | ~0.1 BTC | ~0.1 BTC | dynamic | pool d | pool d |
| Multi-denom (2^i) outputs | no | no | yes | yes | no | no |
| Zero-value output | no | no | no | no | yes | no |
| Coordinator fee | no | yes | yes | yes | yes | no |
| Min input count | ≥ 3 | ≥ 3 | ≥ 3 | ≥ 20 | --- | = 5 |
| Distinct output scripts | yes | yes | yes | yes | yes | yes |

Because JoinMarket has the loosest rules and its conditions overlap with the more specific methods, we run the specific checks first and only fall back to JoinMarket at the end. Whirlpool Tx0 is treated separately because it is a preparation step rather than the mix itself, so we do not want to double-count the same user journey once at preparation and again at the round.

Once every check has run, we roll the results into a single answer: if any method matched, the transaction is flagged as a CoinJoin, and the label shown to the investigator is the strongest signal of the bunch. A single transaction can match more than one method at once, which is expected whenever a Whirlpool or Wasabi mix also satisfies the looser JoinMarket conditions.

## Check it out in Pathfinder

Here is a real CoinJoin as it appears in Pathfinder. The transaction panel shows **Whirlpool CoinJoin · High confidence**, with 5 sending and 5 receiving addresses at 0.25 BTC total:

<figure class="figure-center">

![Pathfinder transaction panel labelling the transaction as Whirlpool CoinJoin at high confidence, with 5 senders and 5 receivers](/images/insights/coinjoin-detection/pathfinder-coinjoin-panel.png)

</figure>

In the graph view, mixing transactions such as CoinJoins are marked with an **M**. Multiple sending addresses each contribute 0.050 BTC, and the outputs each receive exactly 0.050 BTC:

<figure class="figure-center">

![Pathfinder graph view with the CoinJoin transaction marked M; each address sends and receives exactly 0.050 BTC](/images/insights/coinjoin-detection/pathfinder-coinjoin-graph.png)

</figure>

The [same transaction can be opened in Pathfinder](https://app.iknaio.com/pathfinder/btc/tx/4217ba9a049bbc298662f265c060f95089c8b40cf6c58eb15b357957872d1f92).

## Improve your investigations

For investigators, the mixing label is an immediate signal that the standard tracing approach changes at this point. When tracing funds forward from a victim address and landing on a CoinJoin, following every output past it will pull in strangers. The next step is to find a different angle on the subject (a Tx0 or a downstream withdrawal from an exchange that received one of the mixed outputs).

For compliance teams, a CoinJoin label is the kind of signal that should feed directly into transaction monitoring. An address that appears on the output side of many consecutive CoinJoins carries a different risk profile than one that participates in a single round. CoinJoin detection makes that distinction visible.

## Limitations

All checks rely purely on the structure of the transaction. That works well in most cases, but it means that a regular transaction with equal output amounts can look like a JoinMarket mix. Most regular transactions do not produce this pattern, but false positives exist and their exact count is unknown. Wasabi 2.0 detection requires at least 20 inputs, so small WabiSabi rounds with fewer participants will not be detected. It is also possible that participants coordinate CoinJoin transactions through unofficial or private channels outside of the known methods. If their structure differs enough from known patterns, they would not be recognised by any of the six checks.

## Outlook

CoinJoin methods continue to evolve. At the same time, regulators are increasing pressure on mixing services. The arrest of the Samourai Wallet developers in 2024 and the shutdown of the Wasabi Wallet coordinator show that law enforcement is treating CoinJoin infrastructure as a priority. Whether that reduces CoinJoin volume or pushes it toward more decentralised methods remains to be seen.
