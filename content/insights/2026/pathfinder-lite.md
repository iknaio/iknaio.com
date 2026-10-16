---
title: "8 New Blockchains in Pathfinder"
date: 2026-10-13
author: "Thomas Niedermayer"
draft: true
description: "Iknaio Pathfinder now covers BNB Smart Chain, Arbitrum, Base, Optimism, Polygon, Avalanche C-Chain, Gnosis and Robinhood Chain. In the GANA Payment exploit, stolen funds crossed a bridge from BNB Smart Chain to Ethereum, and Pathfinder follows them across."
tags: ["pathfinder", "bnb-smart-chain", "bridges", "cross-chain", "product-update"]
image: "images/insights/pathfinder-lite/cover.jpg"
posttype: "insight"
---

<style>
.content p code, .content td code { word-break: break-all; }
.content figcaption { font-size: .85rem; color: var(--color-dark-soft); margin-top: 8px; text-align: center; }
.content ul.pl-chains { list-style: none; padding: 0; margin: 1.5rem 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.content ul.pl-chains li { display: flex; flex-direction: column; align-items: center; gap: 10px; margin: 0; padding: 16px 8px; border: 1px solid var(--color-gray); border-radius: 8px; text-align: center; font-size: .9rem; line-height: 1.3; }
.content .pl-chain-icon { display: flex; width: 52px; height: 52px; border: 2px solid var(--color-primary); border-radius: 50%; align-items: center; justify-content: center; }
.content .pl-chain-icon svg { width: 28px; height: 28px; fill: var(--color-dark); }
@media (max-width: 479px) { .content ul.pl-chains { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.content .pl-key { margin: 1.5rem 0; }
.content .pl-key-canvas { overflow-x: auto; }
.content .pl-key svg { display: block; width: 100%; min-width: 560px; height: auto; color: var(--color-dark); }
.pl-key .ring { fill: none; stroke: var(--color-dark); stroke-width: 1.5; }
.pl-key .ring.new { stroke: var(--color-primary); stroke-width: 2; }
.pl-key line { stroke: var(--color-dark-soft); stroke-width: 1.5; opacity: .6; }
.pl-key text { fill: var(--color-dark-soft); font-size: 13px; text-anchor: middle; }
.pl-key text.addr { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
.pl-key path.span { fill: none; stroke: var(--color-dark-soft); stroke-width: 1.2; opacity: .6; }
.content .pl-key svg a:not(.btn), .pl-key svg a { cursor: pointer; text-decoration: none; }
.pl-key svg a:hover text, .pl-key svg a:focus text { text-decoration: underline; }
.pl-key use.icon { fill: var(--color-dark); }
</style>

Iknaio Pathfinder now covers fourteen blockchains: the six core blockchains Bitcoin, Bitcoin Cash, Litecoin, Zcash, Ethereum and Tron, and eight new ones, including BNB Smart Chain, Arbitrum and Base.

In this post, we present the eight new blockchains, what they add to investigations and what Pathfinder can do on them. We then follow one real case across a bridge: stolen funds from the GANA Payment exploit of November 2025, on their way from BNB Smart Chain to Ethereum.

## The new blockchains

The eight new blockchains are:

<ul class="pl-chains">
<li><span class="pl-chain-icon"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="/images/insights/pathfinder-lite/blockchains.svg#bnb"/></svg></span>BNB Smart Chain</li>
<li><span class="pl-chain-icon"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="/images/insights/pathfinder-lite/blockchains.svg#arb"/></svg></span>Arbitrum</li>
<li><span class="pl-chain-icon"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="/images/insights/pathfinder-lite/blockchains.svg#base"/></svg></span>Base</li>
<li><span class="pl-chain-icon"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="/images/insights/pathfinder-lite/blockchains.svg#opt"/></svg></span>Optimism</li>
<li><span class="pl-chain-icon"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="/images/insights/pathfinder-lite/blockchains.svg#pol"/></svg></span>Polygon</li>
<li><span class="pl-chain-icon"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="/images/insights/pathfinder-lite/blockchains.svg#avax"/></svg></span>Avalanche C-Chain</li>
<li><span class="pl-chain-icon"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="/images/insights/pathfinder-lite/blockchains.svg#gnosis"/></svg></span>Gnosis</li>
<li><span class="pl-chain-icon"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="/images/insights/pathfinder-lite/blockchains.svg#robinhood"/></svg></span>Robinhood Chain</li>
</ul>

All eight run the same software as Ethereum (they are EVM blockchains) and use its address format, so one key gives the same address on each of them. This brings two improvements for investigations:

- **More hits for cross-chain key reuse.** Pathfinder lists the addresses of one key on other blockchains as related addresses, as described in our post on [cross-chain key reuse](/insights/cross-chain-key-reuse/). The new blockchains add more places where a key can show up. Figure 1 shows a key of the exchange Gate that is in use on Bitcoin, Tron, Ethereum and seven of the eight new blockchains.
- **More bridge transfers resolved.** Pathfinder links a bridge transfer to its payout when both blockchains are in Pathfinder. Many bridges connect Ethereum with the new blockchains, so more bridge transfers now lead to their payout, and the trace continues in the same graph.

<figure class="pl-key">
<div class="pl-key-canvas"><svg viewBox="0 0 720 284" role="group" aria-label="A key of the exchange Gate, linked by solid lines to the same address 0x0d0707963952f2fba59dd06f2b425ace40b492fe on Ethereum, BNB Smart Chain, Arbitrum, Base and Polygon, and by dashed lines to its Bitcoin address 1G47mSr3oANXMafVrR8UC4pzV7FEAzo3r9 and its Tron address TBA6CypYJizwA9XdC7Ubgc5F1bxrQ7SqPt">
<line x1="360" y1="78" x2="72" y2="163"/>
<line x1="360" y1="78" x2="168" y2="163"/>
<line x1="360" y1="78" x2="264" y2="163"/>
<line x1="360" y1="78" x2="360" y2="163"/>
<line x1="360" y1="78" x2="456" y2="163"/>
<line x1="360" y1="78" x2="552" y2="163"/>
<line x1="360" y1="78" x2="648" y2="163"/>
<circle class="ring" cx="360" cy="48" r="30"/><use href="/images/insights/pathfinder-lite/blockchains.svg#key" x="338" y="26" width="44" height="44"/>
<a href="https://app.iknaio.com/pathfinder/btc/address/1G47mSr3oANXMafVrR8UC4pzV7FEAzo3r9" target="_blank" rel="noopener"><title>Bitcoin: 1G47mSr3oANXMafVrR8UC4pzV7FEAzo3r9 (opens in Pathfinder)</title><circle class="ring" cx="72" cy="190" r="27"/><use class="icon" href="/images/insights/pathfinder-lite/blockchains.svg#btc" x="57" y="175" width="30" height="30"/><text x="72" y="239">Bitcoin</text><text class="addr" x="72" y="268">1G47mSr3…o3r9</text></a>
<a href="https://app.iknaio.com/pathfinder/trx/address/TBA6CypYJizwA9XdC7Ubgc5F1bxrQ7SqPt" target="_blank" rel="noopener"><title>Tron: TBA6CypYJizwA9XdC7Ubgc5F1bxrQ7SqPt (opens in Pathfinder)</title><circle class="ring" cx="168" cy="190" r="27"/><use class="icon" href="/images/insights/pathfinder-lite/blockchains.svg#trx" x="153" y="175" width="30" height="30"/><text x="168" y="239">Tron</text><text class="addr" x="168" y="268">TBA6CypY…SqPt</text></a>
<a href="https://app.iknaio.com/pathfinder/eth/address/0x0d0707963952f2fba59dd06f2b425ace40b492fe" target="_blank" rel="noopener"><title>Ethereum: 0x0d0707963952f2fba59dd06f2b425ace40b492fe (opens in Pathfinder)</title><circle class="ring" cx="264" cy="190" r="27"/><use class="icon" href="/images/insights/pathfinder-lite/blockchains.svg#eth" x="249" y="175" width="30" height="30"/><text x="264" y="239">Ethereum</text></a>
<a href="https://app.iknaio.com/pathfinder/bnb/address/0x0d0707963952f2fba59dd06f2b425ace40b492fe" target="_blank" rel="noopener"><title>BNB Smart Chain: 0x0d0707963952f2fba59dd06f2b425ace40b492fe (opens in Pathfinder)</title><circle class="ring new" cx="360" cy="190" r="27"/><use class="icon" href="/images/insights/pathfinder-lite/blockchains.svg#bnb" x="345" y="175" width="30" height="30"/><text x="360" y="239">BNB Smart Chain</text></a>
<a href="https://app.iknaio.com/pathfinder/arb/address/0x0d0707963952f2fba59dd06f2b425ace40b492fe" target="_blank" rel="noopener"><title>Arbitrum: 0x0d0707963952f2fba59dd06f2b425ace40b492fe (opens in Pathfinder)</title><circle class="ring new" cx="456" cy="190" r="27"/><use class="icon" href="/images/insights/pathfinder-lite/blockchains.svg#arb" x="441" y="175" width="30" height="30"/><text x="456" y="239">Arbitrum</text></a>
<a href="https://app.iknaio.com/pathfinder/base/address/0x0d0707963952f2fba59dd06f2b425ace40b492fe" target="_blank" rel="noopener"><title>Base: 0x0d0707963952f2fba59dd06f2b425ace40b492fe (opens in Pathfinder)</title><circle class="ring new" cx="552" cy="190" r="27"/><use class="icon" href="/images/insights/pathfinder-lite/blockchains.svg#base" x="537" y="175" width="30" height="30"/><text x="552" y="239">Base</text></a>
<a href="https://app.iknaio.com/pathfinder/pol/address/0x0d0707963952f2fba59dd06f2b425ace40b492fe" target="_blank" rel="noopener"><title>Polygon: 0x0d0707963952f2fba59dd06f2b425ace40b492fe (opens in Pathfinder)</title><circle class="ring new" cx="648" cy="190" r="27"/><use class="icon" href="/images/insights/pathfinder-lite/blockchains.svg#pol" x="633" y="175" width="30" height="30"/><text x="648" y="239">Polygon</text></a>
<a href="https://app.iknaio.com/pathfinder/eth/address/0x0d0707963952f2fba59dd06f2b425ace40b492fe" target="_blank" rel="noopener"><title>Ethereum and the new blockchains: 0x0d0707963952f2fba59dd06f2b425ace40b492fe (opens in Pathfinder)</title><path class="span" d="M264,247 V253 H648 V247 M456,253 V257"/><text class="addr" x="456" y="268">0x0d070796…92fe</text></a>
</svg></div>
<figcaption>Figure 1: A key of the exchange Gate and its addresses, all in use: the same address on Ethereum and on the new blockchains, and an address in another format on Bitcoin and on Tron.</figcaption>
</figure>

### Capabilities

Pathfinder supports the new blockchains in Lite mode and marks them with a Lite badge. For an address on a new blockchain, Pathfinder shows:

- its transactions in the native coin and in the tokens Iknaio supports, with filters for direction, token and time range
- its attribution tags (labels that name who controls an address)
- its related addresses: the addresses of the same key on other blockchains
- its bridge transfers, each linked to its payout on the destination blockchain

Relationship mode (the view of the counterparties of an address) is not available on the new blockchains.

## The GANA Payment exploit

On 20 November 2025, an attacker took more than 3.1 million USD from GANA Payment, a payment protocol on BNB Smart Chain, as [reported by The Block](https://www.theblock.co/post/379619/gana-payment-exploit) based on [an analysis by ZachXBT](https://t.me/investigations/289). The perpetrator address [`0x2e8a8670b734e260cedbc6d5a05532264aae5c38`](https://app.iknaio.com/pathfinder/bnb/address/0x2e8a8670b734e260cedbc6d5a05532264aae5c38) split the stolen USDT (a US dollar stablecoin) between two wallets, A and B.

Wallet A's part stayed on BNB Smart Chain. It was swapped for BNB and, less than an hour after the split, deposited into Tornado Cash (a mixing service). Wallet B's part took the bridge to Ethereum. Scrolling through the graph below follows both routes step by step.

<figure class="pl-story" data-src="/data/pathfinder-lite/gana-story.json" data-svg-light="/data/pathfinder-lite/gana-pathfinder-light.svg" data-svg-dark="/data/pathfinder-lite/gana-pathfinder-dark.svg" data-label="The GANA Payment case in Pathfinder, from BNB Smart Chain to Ethereum" data-overview="The whole case in Pathfinder on 20 November 2025. Scroll on, or select a step, to follow the funds in order.">
<img class="pl-story-fallback" src="/images/insights/pathfinder-lite/figure-2-pathfinder.png" alt="The GANA Payment case in Pathfinder: the perpetrator address on BNB Smart Chain, the swap of 200.00k USDT for 217.34 BNB, and the bridge transfer of 300.00k USDT linked to its payout of 299.82k USDT on Ethereum">
<ol class="pl-story-steps">
<li data-label="Start">The trail starts at the perpetrator address on BNB Smart Chain.</li>
<li data-label="Split">The perpetrator split the stolen USDT between wallet A and wallet B.</li>
<li data-label="Swap">Wallet A's part was swapped for BNB on BNB Smart Chain.</li>
<li data-label="Mixer">Less than an hour after the split, the BNB went into Tornado Cash.</li>
<li data-label="Bridge">Wallet B sent its part through Stargate to Ethereum. Pathfinder links each transfer to its payout there, at the same address.</li>
<li data-label="Mixer">On Ethereum, wallet B swapped the USDT for ETH and, about four hours later, deposited it into Tornado Cash.</li>
</ol>
<figcaption>The GANA Payment case in Pathfinder, with one transaction for each pair of addresses.</figcaption>
</figure>
<script src="/js/pathfinder-lite-story.js" defer></script>

In the GANA case, the trail does not stop where the stolen funds leave BNB Smart Chain. With fourteen blockchains in Pathfinder, many more cases that cross a bridge can now be followed in one graph, from the first address to the last.
