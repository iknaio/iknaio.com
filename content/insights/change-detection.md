---
title: "Change Address Heuristics"
date: 2026-04-15
description: "How we identify the change output of a Bitcoin transaction at Iknaio, and why getting it right matters."
tags: []
image: "images/insights/change-detection/cover.png"
posttype: "insight"
aliases: ["/blog/change-detection/"]
---

## What is a change address

In traditional banking a payment has exactly one sender and one recipient. Bitcoin works differently because each output of a transaction creates a single identifiable coin (a UTXO). Once you receive it, you have to spend it in full. You cannot break it apart. If the coin is worth more than what you want to pay, the transaction produces a second output that sends the leftover back to you, much like receiving change when you hand over a banknote. That leftover is the **change output**. On the blockchain there is nothing that marks it as change, so we attempt to classify outputs as change based on the data we have.

For an investigator this matters because without knowing which output is the payment and which is the change, it is impossible to tell which side of the transaction continues the fund flow under investigation.

## How to recognise change

The engine behind Iknaio runs three independent checks on every transaction and merges their results into a per-output consensus. Each check captures a different structural signal that tends to be present when an output is change. When multiple checks agree, confidence goes up. When they disagree, the output stays unlabelled.

**Direct change** is the strongest and simplest signal. If an output sends back to an address that was also one of the inputs, we flag it as change with high confidence. The sender reuses their own address, so there is little ambiguity.

**Multi-input change** uses the address clustering that Iknaio has already built from the multi-input heuristic. If an output lands in the same cluster as any of the inputs, we flag it. This picks up cases where the sender uses a fresh change address but the address is already known to belong to their wallet.

**One-time change** is the most procedural of the three. It looks at the transaction in isolation and only flags an output when all of the following are true at once: the output matches the script type of the inputs, the value is not a round number (round amounts tend to be deliberate payments), the value is smaller than the smallest input, and the address has no prior on-chain activity. An output has to survive every filter and be the *only* survivor in the transaction, otherwise the heuristic abstains.

After the three checks run, their results merge per output address. Each entry in the consensus carries the union of source names and the highest confidence among any source that fired. An output that two checks agree on is not double-counted. It simply inherits the maximum confidence. The figure below shows this for a real transaction (`fc12dfcb...` from block 400,000): all three inputs come from the same address, which sends 2.0 BTC to a recipient and 4.697 BTC back to itself. Direct change fires at confidence 100 (address reuse) and multi-input change at confidence 50 (same cluster). One-time change stays silent because the address already has on-chain history. The consensus merges both into a single label at confidence 100 with 2 sources.

![Direct and multi-input checks flag the 4.697 BTC output as change; the consensus merges both at confidence 100](/images/insights/change-detection/figure-1.png)

## Check it out in Pathfinder

When a transaction is opened in Pathfinder, the change label appears directly in the transaction panel next to the affected output address.

Here is the same transaction as it appears in Pathfinder:

<figure class="figure-center">

![Pathfinder transaction panel with three inputs from one address and the 4.70 BTC output marked with a green change badge](/images/insights/change-detection/figure-2.png)

</figure>

All three inputs come from `17bAY2JM…d7Ma` (contributing 0.27, 1.54, and 4.90 BTC). The first output sends 4.70 BTC back to the sender's own address, and Pathfinder marks it with a green **change** badge. The second output sends 2.00 BTC to `1MxhYrFg…jG7a`, a payment to a different address.

Direct change fires at confidence 100 because the output returns to an address that was also an input. Multi-input change confirms at confidence 50 because the address belongs to the same cluster. One-time change stays silent because the address has prior on-chain history. The [same transaction can be browsed in Pathfinder](https://app.iknaio.com/pathfinder/btc/tx/fc12dfcb4723715a456c6984e298e00c479706067da81be969e8085544b0ba08).

## Improve your investigations

For investigators, the change label on any transaction immediately shows which output likely continues the sender's side of the story. Following a victim address forward through a suspect's wallet, the change labels allow skipping dead-end payment branches and focusing on the funds that stayed under the same control. The same labels feed into address clustering, making it possible to resolve dozens of transactions into a single entity without reading every one by hand.

For compliance teams, the change labels reduce the false positive rate of transaction screening. A screening rule that flags every output above a threshold fires on both the payment and the change. The change labels allow the rule to focus on the payment branch only, which is typically the side a compliance reviewer cares about.

## Limitations

The checks described here are deliberately conservative to avoid false positives. They are correct in the majority of cases, but they can be wrong and there is no way to quantify exactly how often they fail. Senders can intentionally construct transactions that mislead the checks, and the one-time change check depends on on-chain state at the time it runs, so an address that looked fresh when the label was computed may have been reused since. A change label that is right most of the time is still far more useful than no signal at all, but investigators should treat it as one input among many rather than a definitive answer.

## Outlook

Privacy-aware wallets already avoid address reuse, which weakens direct change. As more wallets adopt this practice, the heuristics that rely on seeing the same address twice will fire less often. Multi-input change, however, benefits from growing cluster data over time, and as long as wallets produce transactions with two outputs, the structural signals remain present. The underlying problem of a transaction having to send the leftover somewhere appears to remain for the foreseeable future.
