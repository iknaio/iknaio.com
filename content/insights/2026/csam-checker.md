---
title: "The CSAM Checker: One Address, Every Network, One Click"
date: 2026-08-25
draft: true
description: "A new Iknaio Pathfinder plugin checks a cryptoasset address against known CSAM attribution tags across every network it exists on, and names exactly how close the match is."
tags: ["csam", "law-enforcement", "investigation", "product-update", "darknet"]
image: "images/insights/csam-checker/cover.png"
posttype: "insight"
aliases: ["/blog/csam-checker/"]
---

During [Operation Alice](/insights/operation-alice/) we ran a bespoke workflow over 5,170 Bitcoin addresses, cross-checking every one of them against dark web attribution data. That was a notebook written for one investigation. Part of what we learned there is now a button in [Iknaio Pathfinder](https://app.iknaio.com): the **CSAM Checker**.

## What it does

Enter one address. The checker first works out which of the supported networks that address actually exists on, then checks each of them in parallel against addresses tagged as related to child sexual abuse material. Results appear as they arrive rather than after the last network finishes, and the full table can be exported as CSV for the case file.

The tags come from several sources. One of them is our friends at [CFLW](https://cflw.com/): when their Dark Web Monitor finds a cryptoasset address on a site offering child sexual abuse material, that address is reported to us as a CSAM tag. Every row names the source its tag came from and links back to it, so the origin of a finding is one click away.

![The CSAM Checker in Iknaio Pathfinder: an address checked across every network it exists on, with the summary above the results table](/images/insights/csam-checker/overview.png)

You do not have to start from the checker either. Right-click any address in the Pathfinder graph and pick **CSAM Check**, and it opens on that address. The entry deliberately runs the check across all networks rather than only the one the address sits on in the graph, because the same address turning up tagged on another chain is one of the more telling things a check can report.

![The Pathfinder address context menu, with the CSAM Check entry](/images/insights/csam-checker/context-menu.png)

## What kind of hit is it?

The design decision that matters most is what the checker refuses to do: it does not collapse its findings into a single risk score.

"This address is tagged as CSAM-related" and "an address in a cluster that once sent funds to this address's cluster is tagged" are both hits. They are not remotely the same finding, and a number between 0 and 100 destroys that difference. So the checker reports six relationships explicitly. The order is not arbitrary: it runs from the finding that bears most directly on the address to the one that bears least, so where a hit falls in this list is the first thing telling an investigator how much weight it can carry.

1. <span class="ui-pill" style="--pill-color:#DD3D2B">DIRECT</span>: the address itself is tagged
2. <span class="ui-pill" style="--pill-color:#DE6007">SAME CLUSTER</span>: another address in the same cluster is tagged
3. <span class="ui-pill" style="--pill-color:#5B84DE">INCOMING ADDRESS NEIGHBOR</span>: a direct neighbour that sent funds to the address is tagged
4. <span class="ui-pill" style="--pill-color:#A05BDD">OUTGOING ADDRESS NEIGHBOR</span>: a direct neighbour that received funds from the address is tagged
5. <span class="ui-pill" style="--pill-color:#007F56">INCOMING CLUSTER NEIGHBOR</span>: an address in a cluster that sent funds to this cluster is tagged
6. <span class="ui-pill" style="--pill-color:#06A6C2">OUTGOING CLUSTER NEIGHBOR</span>: an address in a cluster that received funds from this cluster is tagged

The first is a statement about the address in front of you. The last is a statement about the company it keeps, several steps removed. Both belong on screen, labelled, so the investigator decides what each one is worth.

Above the table, a short summary states the same thing in plain sentences: whether the address itself is tagged, how much of its cluster is as both a count and a percentage, and how many tagged addresses sit in its immediate neighbourhood.

![Results table with one row per match, showing the relationship, the tag concept, the tag source and a link into the Pathfinder](/images/insights/csam-checker/results-table.png)

## Clusters here, but not in the report

We have argued that [address clustering is not evidence](/insights/address-clustering-issues/), and that Pathfinder is right to keep clusters out of the investigator's way. Two of the six relationships above are cluster-based, so it is worth being explicit about why that is not a contradiction.

Clustering is a lead generator. That is precisely and only what the CSAM Checker is for. A cluster groups addresses *likely* controlled by the same actor, which is exactly the right basis for deciding which address to investigate next, and exactly the wrong basis for a claim in a forensic report. That is why the relationship is printed on every row: a same-cluster hit is visibly a same-cluster hit, and it can be treated accordingly.

## What "no result" means

Some clusters and neighbourhoods are too large to check exhaustively in reasonable time. When that happens, the checker skips that step and says so, listing which checks were performed and which were skipped.

Each of those pills says what the check actually looked at rather than just naming itself. **Cluster Neighbors** explains itself as "CSAM tags on the clusters that exchanged funds with the submitted address's cluster". A skipped pill adds why it was skipped, with the figure that tripped the limit: the cluster has 4,545 neighbouring clusters, more than this check scans.

![Checks performed and checks skipped, shown as two rows of pills, with the reason a check was skipped on the pill itself](/images/insights/csam-checker/checks-skipped.png)

This matters more than it sounds. An empty result set that quietly omits half the work reads as a clean address. An empty result set alongside a skipped cluster-neighbour check reads as what it is: an incomplete check. Investigators need to be able to tell those apart, and so does anyone reviewing the work later.

Even a complete check that finds nothing says less than it appears to. It means no address in the checked neighbourhood carries a CSAM tag *we hold*, and nobody holds complete attribution data. Tags exist because someone found an address on a site and reported it, so the absence of a tag is the absence of a report, not the absence of abuse. A clean result rules a lead out. It does not rule an address out.

## Availability

The CSAM Checker is available in Iknaio Pathfinder now. If you work CSAM cases and this would help, [reach out](/contact/).

And remember: a hit in the CSAM Check is a lead. It tells an investigator where to look next, not what happened.
