---
title: "Address Clustering Is Not Evidence"
date: 2026-08-20
description: "Why cryptocurrency address clusters are investigative leads rather than evidence, and what that means for blockchain forensic reports."
tags: ["clustering", "bitcoin", "blockchain-forensics", "evidence", "law-enforcement", "courtroom-readiness"]
image: "images/insights/address-clustering-issues/cover.png"
posttype: "insight"
aliases: ["/blog/address-clustering-issues/"]
author: "Bernhard Haslhofer"
---

**An investigative lead and a piece of evidence are not the same thing.**

This distinction sounds obvious, but forensic reports that include address clustering results violate it surprisingly often. What is the problem with address clustering, and what can investigators do about it? This question arises whenever forensic reports must not only be written, but also defended in court.

In this post, we describe how address clustering became a problem in the first place, largely due to a translation issue between academic research and operational practice. We present examples of misinterpreted address clusters from real criminal proceedings and explain why [Iknaio Pathfinder](https://iknaio.com/platform/#pathfinder) deliberately hides clustering from its users.

The short summary: address clustering is a powerful technique for generating leads, but it is not evidence. The reliability of cluster-based findings cannot be established in general, and they are typically not reproducible by third parties. Any knowledgeable defence lawyer can and will challenge them.

Our recommendation is therefore simple: **do not include clusters in forensic reports**.

## Lost in Translation

The idea of address clustering is to group addresses that might be controlled by the same actor. This is useful because actors such as cryptocurrency exchanges or dark web markets can easily control hundreds of thousands of addresses, and grouping them is far more convenient than working with each address in isolation.

In a previous post [[1]](#references) we described the underlying techniques and their implementation in more detail, so we will not repeat that here. The most important takeaway at this point is that address clustering relies on **heuristic** methods. The possibility of linking addresses was already noted by Nakamoto himself in the original Bitcoin whitepaper [[2]](#references). Academia picked the idea up and proposed heuristics, such as the multi-input or change heuristics, for clustering addresses presumably controlled by the same actor. The seminal study in this line of work is "A Fistful of Bitcoins" by Meiklejohn et al. [[3]](#references), which combined clustering heuristics with re-identification attacks to characterize payment flows among major Bitcoin services.

So far so good. Academia has long accepted heuristic methods because the term **heuristic** carries a shared understanding: the method is an approximation, something like a rule of thumb, and it can yield false positives. Data scientists working in industry are typically aware of the same limitation in clustering techniques such as k-means [[4]](#references). That is why it is standard practice to quantify error rates and take them into account when interpreting results.

The problem started when address clustering was translated into a key feature of operational blockchain forensics tools. Somewhere along the way, the word "heuristic" and its meaning got lost. Address clusters became treated as facts, even though they can group unrelated users and services together. What this means legally is not uncharted territory: in earlier joint work with legal scholars, we derived key requirements, among them reliability and verifiability, that cryptocurrency forensics must meet to safeguard its evidential value [[5]](#references).

To see why this matters in a legal context, consider DNA evidence. Courts trust DNA analysis because its error rates are known and quantified. Now imagine a world in which DNA tests had unknown error rates: no court would accept them as proof. Address clustering lives in exactly that world.

In a recent study [[6]](#references), we evaluated the multi-input heuristic against ground truth address-to-entity mappings obtained directly from European crypto-asset service providers. The results depend heavily on the metric applied and the entity examined: while the heuristic appears strong on some metrics, full-cluster precision and recall drop to 0.36 and 0.44, and for some services the heuristic fails almost completely. There is still no agreement on how reliability should be measured, and large-scale ground truth remains scarce. What our measurements do show is that the most widely used clustering method is not reliable enough to serve as sole evidence in court. A method whose error rate cannot be established in general can generate leads, but it cannot carry the weight of evidence.

## The Consequences

Our work as court-certified expert witnesses regularly brings us into criminal investigations, where we cross-check forensic reports created with various blockchain intelligence tools. In the following, we schematically outline three cases and explain the misinterpretations. All three draw on real proceedings, with details generalized to protect the cases involved.

### Case 1: The Thousand-Address CSAM Cluster

A prosecutor's office received a report from a cryptocurrency exchange stating that one of its customers had transferred Bitcoin to an address that was part of a cluster associated with Child Sexual Abuse Material (CSAM) shared on the dark web. The report contained no additional evidence.

![Two clusters connected by a BTC withdrawal arrow: exchange withdrawal addresses on the left, a cluster of thousands of addresses on the right where the address in question shares membership with CSAM-exposed addresses but carries no direct evidence](/images/insights/address-clustering-issues/case1-csam-cluster.svg)

Checking the address confirmed that it was indeed part of a larger cluster that also contained addresses exposed on CSAM sites on the dark web. For the address itself, however, tools like [Dark Web Monitor](https://cflw.com/dwm/) produced no evidence that it was ever used in a CSAM context. Establishing that would typically require a screenshot of the site showing the address.

What went wrong: cluster co-membership was treated as individual attribution. The customer became a suspect through unverifiable algorithmic association, not through evidence.

The lesson: a cluster tag never convicts a single address. It must be corroborated independently, for instance through a screenshot, or dropped.

### Case 2: The Untagged Service Address

In an investment fraud case, victims reported that they had transferred funds from their wallets, mostly custodial ones, to a known cryptocurrency service, let us call it Service X. Many victims provided screenshots of these transfers, clearly documenting the source and destination of the funds.

Investigators started tracing these funds and could reproduce most of the flows from the victim wallets to addresses controlled by Service X. These addresses fell neatly into a cluster, which the tool attributed and labelled accordingly.

![Two victim transfers documented by screenshots: one lands in the tagged Service X cluster and traces correctly; one lands in an untagged address actually controlled by Service X, and the trace wrongly continues to unrelated services](/images/insights/address-clustering-issues/case2-untagged-address.svg)

However, some destination addresses carried no Service X label in the tool the investigators used. They assumed that these addresses were therefore not controlled by the service, even though the victims' screenshots showed otherwise. As a consequence, the investigators traced straight through the service, treated its internal flows as the perpetrator's, and ended up at entirely unrelated service providers.

What went wrong: a missing tag was read as negative evidence. Heuristic clustering yields not only false positives but also false negatives, and attribution data is always incomplete, so the absence of a tag proves nothing.

The lesson: absence of a tag is not evidence of absence. It must be checked against what the victims already provided.

### Case 3: The Unreproducible Amount

In another investment fraud case, the investigator used a tracing tool to quantify the amount the suspected fraudster had collected from a specific victim. The report contained a figure roughly like this:

![Victim and fraudster clusters connected by an arrow carrying roughly 800K EUR, with addresses, transaction hashes, and clustering all undisclosed or unverifiable](/images/insights/address-clustering-issues/case3-unreproducible-amount.svg)

At trial, the defence asked us to reproduce the findings presented in the forensic report. This was not possible: the report disclosed neither the involved addresses nor the transaction hashes, and the underlying clustering came from a proprietary commercial tool that no independent party can verify.

What went wrong: the damage figure was built on an unverifiable heuristic. Under the verifiability requirement, the figure could not stand.

The lesson: numbers that cannot be reproduced by an independent third party do not survive cross-examination.

### Three Cases, One Mistake

The three cases differ in detail but share the same root cause: an investigative lead was treated as if it were evidence. In each case, at least one of two safeguards was missing. The first is corroboration, that is, independent confirmation of an attribution through evidence that does not depend on the clustering itself, such as a screenshot, a deposit test, or records obtained from a service provider. The second is reproducibility, meaning that an independent third party, including the defence, can recompute every result.

This pattern is not limited to individual investigators or jurisdictions. In the US trial against the operator of the Bitcoin Fog mixing service [[7]](#references), the reliability of commercial clustering software was litigated extensively: the defence challenged the tool's output precisely because no error rates for its clustering had been established or recorded. The court ultimately admitted the evidence, in part because the case did not rest on clustering alone but on corroborating evidence and address-by-address tracing. That is exactly the point: a forensic cryptoasset investigation is a chain of methods, from data extraction through clustering and attribution to tracing and reporting, and each link has its own failure modes. The defence only has to break one link.

## Why Pathfinder Hides Clustering

The conclusion from the cases above is not that clustering is useless. It is that clustering belongs in a different place than the evidence. This distinction directly shaped the design of our own tracing tool, Iknaio Pathfinder.

In Pathfinder, traces are built address by address. Every step in a trace is deterministic and reproducible: given the same addresses and transactions, anyone recomputing the trace arrives at the same result, including the defence. This is what allows a trace to satisfy the verifiability requirement discussed above. A report built this way discloses the involved addresses and transaction hashes, and an independent third party can check every step against the public ledger.

Clustering still runs in the background, where it belongs. It propagates attribution tags to related addresses and connects related cases through [CaseConnect](https://iknaio.com/platform/#caseconnect), both at lower confidence and clearly separated from the evidentiary layer. Investigators benefit from clustering as a lead generator without being tempted to present its output as fact.

But clusters never appear in the evidence presented. This is a deliberate design decision, not a missing feature. By hiding clustering from the user-facing trace, Pathfinder makes the error of the three cases above structurally difficult to commit: what the tool shows is what the report can safely contain.

The screenshot below shows a typical trace in Pathfinder: funds flow from a scam-tagged address through intermediary addresses to an exchange. Every hop is a concrete transaction between specific addresses, with amount and date, each verifiable against the public ledger, and no cluster boundaries in sight.

![Pathfinder trace from a scam-tagged Bitcoin address through intermediary addresses to an exchange; every hop is a concrete transaction with amount and date, and no cluster boundaries appear](/images/insights/address-clustering-issues/screenshot-pathfinder.png)

**Clustering is for leads and overview, never for the evidence presented in court.**

## Outlook

The argument of this post was developed in the context of criminal proceedings, but its reach extends further. The same evidential limits apply wherever cluster-based attribution is consumed as if it were fact, and financial supervision is a prominent example.

Financial market authorities and central banks increasingly monitor crypto-asset markets, and most of them consume attribution data through commercial black-box tools. This creates a structural problem: no tool provider can know every address controlled by a given crypto-asset service provider (CASP). Attribution data is always incomplete, as Case 2 illustrated, and the completeness of any provider's coverage cannot be verified from the outside. Only the CASP itself, and by extension its supervisor, can hold the complete picture.

The consequence is a change of paradigm. Rather than relying on opaque vendor outputs, supervisors should collect the addresses controlled by the CASPs they oversee and build their monitoring on data and methods under their own control. That this approach works in practice is demonstrated by a recent study [[8]](#references) in which we reconstructed the on-chain activity of all CASPs registered in Austria across Bitcoin, Ether, USDC, and USDT, based on a regulatory registry that directly identifies their addresses. No commercial attribution tool was needed, and every step of the analysis is transparent and reproducible. The shift is from thinking in tools to thinking in data and methods: transparent, reproducible procedures applied to authoritative data, instead of unverifiable outputs from proprietary systems.

For investigators, the recommendation of this post stands on its own: use clustering to generate leads, corroborate every attribution independently, and present only what an independent third party can reproduce. Whether the setting is a courtroom or a supervisory authority, the underlying principle is the same. Understanding the data and the methods matters more than any tool.

## References

[1] Niedermayer, T. (2026). [Multi-input clustering all of Bitcoin on a laptop](/insights/multi-input-clustering-bitcoin-on-a-laptop/). Iknaio Insights.

[2] Nakamoto, S. (2008). [Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf).

[3] Meiklejohn, S., Pomarole, M., Jordan, G., Levchenko, K., McCoy, D., Voelker, G. M., & Savage, S. (2013). [A Fistful of Bitcoins: Characterizing Payments Among Men with No Names](https://doi.org/10.1145/2504730.2504747). Proceedings of the 2013 Internet Measurement Conference (IMC), 127-140.

[4] Jain, A. K. (2010). [Data clustering: 50 years beyond K-means](https://doi.org/10.1016/j.patrec.2009.09.011). Pattern Recognition Letters, 31(8), 651-666.

[5] Fröwis, M., Gottschalk, T., Haslhofer, B., Rückert, C., & Pesch, P. (2020). [Safeguarding the evidential value of forensic cryptocurrency investigations](https://doi.org/10.1016/j.fsidi.2019.200902). Forensic Science International: Digital Investigation, 33, 200902.

[6] Müller, L., Elsner, J., Niedermayer, T., Haslhofer, B., Goger, T., Kühl, N., & Rückert, C. (2026). [How Reliable Is the Multi-Input Heuristic for Bitcoin Address Clustering in Law Enforcement Contexts?](https://arxiv.org/abs/2607.07414) arXiv:2607.07414.

[7] United States v. Sterlingov, No. 1:21-cr-00399 (D.D.C.).

[8] Saggese, P., Sigmund, M., Raunig, B., Segalla, E., Haslhofer, B., & Makridis, C. (2026). [Stablecoins under Stress in a National Economy: Transaction-Level Evidence from Austrian Crypto-Asset Service Providers](https://arxiv.org/abs/2607.08524). arXiv:2607.08524.