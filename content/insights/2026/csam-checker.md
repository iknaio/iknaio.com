---
title: "Is This Address Involved in CSAM?"
date: 2026-09-01
draft: true
description: "Our new CSAM checker add-on checks an address against known CSAM tags on every network it exists on, and names what kind of hit each one is."
tags: ["csam", "law-enforcement", "investigation", "product-update"]
image: "/images/insights/csam-checker/cover.png"
posttype: "insight"
---

Whether a given cryptoasset address has been used in the context of Child Sexual Abuse Material (CSAM) is a question our law enforcement and compliance customers face routinely. As we set out in [a previous post](/insights/address-clustering-issues/), it is harder to answer than it looks, and the two ways of getting it wrong are not equally costly. A missed lead delays an investigation. A weak finding presented as a strong one attaches one of the gravest allegations there is to someone who may have no connection to the offense.

Consider the case we described there: an address sitting in an address cluster of several thousand members, where a single one of those addresses carries a CSAM tag. Is the submitted address CSAM-related? That depends entirely on what produced the hit. An address that is itself tagged, an address that shares a cluster with a tagged address, and an address that once received funds from a tagged address are three findings of very different evidential strength. A tool that reports them identically invites the reader to treat them identically.

In this post, we describe what the **CSAM Checker** covers, why it names the relationship behind every hit, and what a negative result does and does not establish.

The short summary: the CSAM Checker is a lightweight add-on to the Iknaio analytics platform that checks an address across every network it exists on and prints the underlying relationship (e.g., a direct attribution tag, a shared cluster, a transaction neighbor) on every row of the result. Nothing is condensed into a risk score, because the relationship is precisely the part an investigator needs in order to judge what a hit is worth.

## What does the check cover?

Enter one address. The CSAM Checker first determines which of the supported networks that address exists on, then checks each of them in parallel against addresses tagged as CSAM-related. Results appear as each network finishes, so the first hits are on screen while the remaining networks are still running, and the full table exports as CSV for the case file.

The tags themselves come from attribution providers who gather and report them. One of these providers is [CFLW](https://cflw.com/): when their Dark Web Monitor finds a cryptoasset address on a site offering CSAM, that address is reported to us as a CSAM tag, together with the corroborating evidence behind it (e.g., a screenshot of the page on which the address appeared). Every row therefore names the source of its tag and links back to it, so that an investigator can establish not only that an address was tagged, but on what basis.

![The CSAM Checker in Iknaio Pathfinder: an address checked across every network it exists on, with the summary above the results table](/images/insights/csam-checker/overview.png)

You do not have to start from the CSAM Checker. Right-click any address in the Pathfinder transaction graph, pick **CSAM Check**, and the check opens on that address. Even when you start from a node on one chain, the check still covers every network on which the address exists. Not every check can be run to completion on every address, however, and the results always state which ones were; we return to that below.

![The Pathfinder address context menu, with the CSAM Check entry](/images/insights/csam-checker/context-menu.png)

## What kind of hit is it?

Every hit arrives with the relationship that produced it, named on the row.

"This address is tagged as CSAM-related" and "an address in a cluster that once sent funds to this address's cluster is tagged" are both hits, and they carry very different weight. The CSAM Checker therefore reports six relationships explicitly, listed here from the most direct to the least. That order is a guide to how closely a hit bears on the address itself rather than a confidence score, and the two directions within each pair (incoming, outgoing) say different things instead of more or less.

1. <span class="ui-pill" style="--pill-color:#DD3D2B">DIRECT</span> the address itself is tagged
2. <span class="ui-pill" style="--pill-color:#DE6007">SAME CLUSTER</span> another address in the same cluster is tagged
3. <span class="ui-pill" style="--pill-color:#5B84DE">INCOMING ADDRESS NEIGHBOR</span> a direct neighbor that sent funds to the address is tagged
4. <span class="ui-pill" style="--pill-color:#A05BDD">OUTGOING ADDRESS NEIGHBOR</span> a direct neighbor that received funds from the address is tagged
5. <span class="ui-pill" style="--pill-color:#007F56">INCOMING CLUSTER NEIGHBOR</span> an address in a cluster that sent funds to this cluster is tagged
6. <span class="ui-pill" style="--pill-color:#06A6C2">OUTGOING CLUSTER NEIGHBOR</span> an address in a cluster that received funds from this cluster is tagged

A <span class="ui-pill" style="--pill-color:#DD3D2B">DIRECT</span> hit is a statement about the address in front of you. An <span class="ui-pill" style="--pill-color:#06A6C2">OUTGOING CLUSTER NEIGHBOR</span> hit is a statement about the company that address keeps: one transaction hop away, and at cluster level on both ends. Both belong on screen, labeled, so that the investigator decides what each one is worth.

Above the table, a short summary puts the main figures into plain sentences: whether the address itself is tagged, how many addresses in its cluster are tagged and what share of the cluster they represent, and how many tagged addresses sit in its immediate neighborhood.

![Results table with one row per match, showing the relationship, the tag, its source, and a link back into the graph](/images/insights/csam-checker/results-table.png)

## Why clusters belong in the check

We have argued that [address clustering is not evidence](/insights/address-clustering-issues/), and Pathfinder is deliberately built so that clustering never silently shapes what an investigator sees. Three of the six relationships above rest on clustering, so it is worth saying where the line sits.

Clustering is a lead generator, and lead generation is what the CSAM Checker is for. A cluster groups addresses *likely* controlled by the same actor, which makes it a reasonable basis for deciding where to look next; excluding it would mean missing leads that matter. What clustering cannot do is carry weight in a forensic report. Therefore the relationship is printed on every row: a same-cluster hit is visibly a same-cluster hit, and can be treated as one.

Furthermore, cluster size and ownership matter as much as the relationship. A same-cluster hit inside a small cluster under one actor's control is a different finding from the same hit inside a custodial cluster (e.g., an exchange administering millions of addresses on behalf of its customers), where the tagged address and the submitted one may share nothing beyond a common custodian. Where we hold entity attribution for a cluster, the results carry that attribution, so the distinction is visible rather than left to the reader to reconstruct.

**A cluster tells an investigator where to look next. It never tells them who did it.**

## What "no result" means

Clusters and neighborhoods above the scan limits of the check cannot be enumerated exhaustively. Given such an address, the CSAM Checker skips the affected step and says so. Two rows of pills above the results name every check that was performed and every check that was skipped.

Each pill states what that check looked at. **Cluster Neighbors**, for instance, covers CSAM tags on the clusters that exchanged funds with the submitted address's cluster. A skipped pill also gives the reason, together with the figure that tripped the limit (e.g., a cluster with 4,545 neighboring clusters, more than this check scans).

![Checks performed and checks skipped, shown as two rows of pills, with the reason a check was skipped on the pill itself](/images/insights/csam-checker/checks-skipped.png)

The distinction matters. An empty result set on its own looks like a clean address. An empty result set next to a skipped cluster-neighbor check is an incomplete check. Investigators need to see which of the two they have in front of them, and so does anyone reviewing the work later.

However, even a complete check that finds nothing establishes less than it appears to. It establishes that no address in the checked neighborhood carries a CSAM tag *we hold*, and no attribution provider holds complete data. Tags exist because someone gathered and reported them, so the absence of a tag is not evidence that an address is clean. A negative result closes one line of inquiry. It does not clear the address.

## Getting access

The CSAM Checker is an add-on to the [Iknaio analytics platform](https://app.iknaio.com) and is available to our institutional customers (law enforcement agencies, regulators, and compliance teams). If you work CSAM cases and this would help, [reach out](/contact/).

Our recommendation for working with it is simple: treat every hit as a lead, read the relationship on the row to see how far that lead reaches on its own, and corroborate independently before any of it enters a report. Keeping those steps apart is what protects the people at the other end of a wrong answer.
