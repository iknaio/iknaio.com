---
title: "The Binance Hot Wallet Hack, Step by Step"
date: 2026-10-30
author: "Thomas Niedermayer"
draft: true
description: "On 29 October 2026, Binance hot wallets on nine blockchains sent about 6.3 billion USD to an attacker. On Ethereum, one hot wallet was turned into a sweeper with EIP-7702. We follow the Ethereum funds in Iknaio, from the Tornado Cash-funded operator to the wallets that hold the ETH today."
tags: ["binance", "hack", "ethereum", "eip-7702", "stablecoin-freeze", "case-study"]
image: "images/insights/binance-hot-wallet-hack/cover.jpg"
posttype: "insight"
---

<style>
.content p code, .content li code, .content td code { word-break: break-all; }
.content figcaption { font-size: .85rem; color: var(--color-dark-soft); margin-top: 8px; text-align: center; }
.content .bh-ledger { margin: 2rem 0 2.5rem; border-top: 2px solid var(--color-dark); }
.content .bh-ledger-date { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin: 0; padding: 10px 0; font-family: var(--font-tertiary); font-size: .8rem; letter-spacing: .01em; color: var(--color-dark-soft); text-align: left; }
.content .bh-ledger-date time { color: var(--color-dark); font-weight: 600; }
.content .bh-ledger-block { font-variant-numeric: tabular-nums; }
.content .bh-ledger-block { padding-left: 10px; border-left: 1px solid var(--color-gray); }
.content .bh-ledger dl { margin: 0; }
.content .bh-ledger dl > div { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 12px 0; border-top: 1px solid var(--color-gray); }
.content .bh-ledger dt { font-size: .95rem; color: var(--color-dark-soft); }
.content .bh-ledger dd { margin: 0; font-family: var(--font-tertiary); font-size: 1.35rem; font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: -.01em; color: var(--color-dark); text-align: right; white-space: nowrap; }
.content .bh-ledger dd small { display: block; font-size: .72rem; font-weight: 400; letter-spacing: 0; color: var(--color-dark-soft); }
.content .bh-ledger-note { margin: 0; padding: 12px 0 0; border-top: 1px solid var(--color-gray); font-size: .85rem; line-height: 1.6; color: var(--color-dark-soft); text-align: left; }
.content .bh-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 1.5rem 0; }
.content .bh-two > div { border: 1px solid var(--color-gray); border-radius: 8px; padding: 16px; }
.content .bh-two h3 { margin: 0 0 6px; font-size: 1rem; }
.content .bh-two p { margin: 0; font-size: .95rem; }
.content .bh-two .bh-tag { display: inline-block; font-size: .72rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; padding: 2px 7px; border-radius: 4px; margin-bottom: 8px; background: var(--color-primary); color: #1a1a1a; }
.content .bh-two .bh-tag.alt { background: transparent; box-shadow: inset 0 0 0 1px var(--color-dark-soft); color: var(--color-dark-soft); }
@media (max-width: 639px) { .content .bh-two { grid-template-columns: 1fr; } }
.content .bh-auth { overflow-x: auto; margin: 1.5rem 0 0; border: 1px solid var(--color-gray); border-radius: 8px; }
.content .bh-auth table { width: 100%; border-collapse: collapse; font-size: .85rem; margin: 0; }
.content .bh-auth th { text-align: left; font-size: .72rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--color-dark-soft); padding: 10px 12px; border-bottom: 1px solid var(--color-gray); white-space: nowrap; }
.content .bh-auth td { padding: 8px 12px; border-bottom: 1px solid var(--color-gray); white-space: nowrap; }
.content .bh-auth tr:last-child td { border-bottom: 0; }
.content .bh-auth td code { word-break: normal; font-size: .8rem; }
.content .bh-auth .bh-num { font-variant-numeric: tabular-nums; }
.content .bh-auth tr.bh-hit td { background: rgba(43, 221, 150, .12); font-weight: 600; }
.content .bh-auth tr.bh-hit td:first-child { box-shadow: inset 3px 0 0 var(--color-primary); }
.content .bh-auth tr.bh-fold td { text-align: center; color: var(--color-dark-soft); font-size: .8rem; letter-spacing: .02em; padding: 6px 12px; }
.content .bh-chip { display: inline-block; font-size: .7rem; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; padding: 1px 7px; border-radius: 4px; color: var(--color-dark-soft); box-shadow: inset 0 0 0 1px var(--color-gray); }
.content .bh-chip.yes { background: var(--color-primary); color: #1a1a1a; box-shadow: none; }
.content figure { margin: 1.5rem 0 2rem; }
.content .bh-two p { text-align: left; }
.content .bh-ledger dl > div { justify-content: flex-start; }
.content .bh-ledger dt { flex: 0 0 15rem; }
.content .bh-ledger dd { text-align: left; }
@media (max-width: 479px) { .content .bh-ledger dl > div { justify-content: space-between; } .content .bh-ledger dt { flex: 1 1 auto; } .content .bh-ledger dd { text-align: right; } }
.content .bh-auth-head { margin: 0; padding: 10px 12px; font-size: .85rem; line-height: 1.5; text-align: left; border-bottom: 1px solid var(--color-gray); }
.content .bh-auth:focus-visible, .pl-story-controls button:focus-visible { outline: 2px solid var(--color-dark); outline-offset: 2px; }
.content > table td:nth-child(2) { white-space: nowrap; text-align: right; font-variant-numeric: tabular-nums; }
/* the case graph is wider than the text, so its labels can be read */
.content figure.pl-story { position: relative; left: 50%; width: min(1100px, calc(100vw - 32px)); margin-left: calc(-1 * min(550px, 50vw - 16px)); }
.content figure.pl-story .pl-story-canvas { aspect-ratio: auto; height: min(calc(min(1100px, 100vw - 32px) / 1.9), calc(100vh - 300px)); }
@media (max-width: 639px) { .content figure.pl-story .pl-story-canvas { height: min(62vh, 520px); } }
</style>

On the evening of 29 October 2026, Binance hot wallets on nine blockchains sent their balances to addresses controlled by one attacker. Binance estimates the impact at about 6.3 billion USD [1], about four times the Bybit hack of February 2025. Within hours, Tether and Circle froze 2.58 billion USD of the stolen USDT and USDC on Ethereum and Tron. Most of the rest was turned into ETH and BTC. No issuer can freeze these two coins.

In this post, we explain how the attacker reached nine blockchains from a single entry point, how an Ethereum feature called EIP-7702 turned the busiest Binance hot wallet into a sweeper, and where the Ethereum funds went. Figure 2 follows the funds step by step, as they appear in Iknaio.

<section class="bh-ledger" aria-label="The case in numbers">
<p class="bh-ledger-date">As of <time datetime="2026-10-30T11:00Z">30 October 2026, 11:00 UTC</time> <span class="bh-ledger-block">Ethereum block 26,305,172</span></p>
<dl>
<div><dt>Taken from Binance wallets</dt><dd>6.3B USD<small>Binance estimate</small></dd></div>
<div><dt>Blockchains drained</dt><dd>9</dd></div>
<div><dt>USDT and USDC frozen</dt><dd>2.58B USD<small>Ethereum and Tron</small></dd></div>
</dl>
<p class="bh-ledger-note">The funds are still moving. Balances, frozen amounts and the wallets that hold the funds will change after this point.</p>
</section>

## How the attacker reached nine blockchains

A hot wallet is an active wallet of an exchange that manages its daily business, such as customer withdrawals. Each withdrawal needs a valid signature, and Binance's withdrawal system signs on request. According to Binance, the attacker came in through the compromised laptop of a DevOps engineer and reached a service container that submits withdrawals [1]. Binance says that no private key leaked.

The attacker used two methods:

<div class="bh-two">
<div><span class="bh-tag alt">Other wallets</span><h3>Ordinary signed transfers</h3><p>On the XRP Ledger, Bitcoin, Tron, Solana, Arbitrum, Optimism, Base, Polygon and one Ethereum wallet (Binance 16), the drained wallets sent plain transfers to the attacker, signed with their own keys.</p></div>
<div><span class="bh-tag">Binance 14</span><h3>EIP-7702 sweeper on Ethereum</h3><p>On Binance 14, the attacker installed its own code with EIP-7702. One call then moved ETH and 63 different tokens at once, and later calls swept new deposits.</p></div>
</div>

The attacker used EIP-7702 only for Binance 14. With the delegation in place, later calls swept new deposits from the wallet until 23:56 UTC.

## How a hot wallet became a sweeper

Since the Pectra upgrade of May 2025, an ordinary Ethereum wallet can sign an EIP-7702 authorization: a note that tells the network to run the code of a smart contract whenever someone calls the wallet. The note stays in force until the wallet signs a new one.

An authorization is only valid for one value of the wallet's transaction counter (its nonce). Binance 14 sends withdrawals every few seconds, so its counter moves quickly. The attacker brought 50 signed authorizations, one for each of 50 consecutive counter values, so that one of them would still match when the transaction ran.

The authorization list is part of the transaction and can be read from the blockchain. In transaction [`0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b`](https://app.iknaio.com/pathfinder/eth/tx/0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b), all 50 entries carry a valid signature of Binance 14, are valid only on Ethereum and point to the same sweeper code. They cover the counter values 18,914,775 to 18,914,824. A Binance 14 withdrawal earlier in the same block used the value 18,914,808, so the entry for 18,914,809 matched. The next Binance 14 withdrawal used 18,914,810, and the other 49 entries had no effect (Figure 1).

<figure>
<div class="bh-auth" tabindex="0" role="region" aria-label="Authorization list">
<p class="bh-auth-head">All 50 entries are signed by <a href="https://app.iknaio.com/pathfinder/eth/address/0x28c6c06298d514db089934071355e5743bf21d60">Binance 14</a> and point to the sweeper code <a href="https://app.iknaio.com/pathfinder/eth/address/0x63e842b054bd624a465454d533c33f573e9c6fae"><code>0x63e842…6fae</code></a>.</p>
<table>
<thead><tr><th>Counter (nonce)</th><th>Result</th><th>Signature</th></tr></thead>
<tbody>
<tr><td class="bh-num">18,914,775</td><td><span class="bh-chip">no match</span></td><td><code>0x29d09a58…b7a7</code></td></tr>
<tr><td class="bh-num">18,914,776</td><td><span class="bh-chip">no match</span></td><td><code>0x83292222…1cbc</code></td></tr>
<tr class="bh-fold"><td colspan="3">⋯ 30 more, no match ⋯</td></tr>
<tr><td class="bh-num">18,914,807</td><td><span class="bh-chip">no match</span></td><td><code>0xffb36147…2f3a</code></td></tr>
<tr><td class="bh-num">18,914,808</td><td><span class="bh-chip">no match</span></td><td><code>0xfd586089…0f42</code></td></tr>
<tr class="bh-hit"><td class="bh-num">18,914,809</td><td><span class="bh-chip yes">valid</span></td><td><code>0xed435cb6…709a</code></td></tr>
<tr><td class="bh-num">18,914,810</td><td><span class="bh-chip">no match</span></td><td><code>0x2a31c1ed…30b8</code></td></tr>
<tr><td class="bh-num">18,914,811</td><td><span class="bh-chip">no match</span></td><td><code>0xd563e502…e3c8</code></td></tr>
<tr class="bh-fold"><td colspan="3">⋯ 11 more, no match ⋯</td></tr>
<tr><td class="bh-num">18,914,823</td><td><span class="bh-chip">no match</span></td><td><code>0x6828137e…953c</code></td></tr>
<tr><td class="bh-num">18,914,824</td><td><span class="bh-chip">no match</span></td><td><code>0x25ba40cd…e8ba</code></td></tr>
</tbody></table></div>
<figcaption>Figure 1: The authorization list of transaction 0xad99…298b. The signer of each entry is recovered from its signature.</figcaption>
</figure>

## Following the funds

The graph in Figure 2 starts at the operator and ends at the wallets that hold the ETH today. Scrolling through it follows the case in order. Every address opens in Pathfinder, except those on the XRP Ledger and Solana.

<figure class="pl-story" data-src="/data/binance-hack/case-story.json" data-svg-light="/data/binance-hack/case-light.svg" data-svg-dark="/data/binance-hack/case-dark.svg" data-min-width="620" data-label="The Binance hot wallet hack, from the Tornado Cash-funded operator to the ETH stashes" data-overview="The whole case, 28 to 30 October 2026. Scroll on, or select a step, to follow the funds in order.">
<img class="pl-story-fallback" src="/images/insights/binance-hot-wallet-hack/figure-case.png" alt="The Binance hot wallet hack: drains on the XRP Ledger, Solana, Tron and Bitcoin, the EIP-7702 takeover of Binance 14, the main receiver with its frozen stablecoins, and the routes of the USDT into four ETH wallets">
<ol class="pl-story-steps">
<li data-label="Preparation">On 28 and 29 October, the operator receives three withdrawals of 0.1 ETH from Tornado Cash and 1.08 ETH from a second wallet, which is also funded through Tornado Cash. At 15:59 UTC, it deploys the sweeper code.</li>
<li data-label="First wave">From 20:05 UTC, Binance wallets on the XRP Ledger, Solana, Tron and Bitcoin send their balances to the attacker through ordinary signed transfers. On Bitcoin, the 18,270 BTC are split into 19 addresses by 20:48 UTC, most of them holding 1,000 BTC.</li>
<li data-label="ETH exploit">At 20:20:59 UTC, the operator hands Binance 14 its 50 signed authorizations. The transaction runs nothing itself. From then on, every call to Binance 14 runs the sweeper code.</li>
<li data-label="Sweep">At 20:24:23 UTC, one call to Binance 14 moves 167,464 ETH, 1.615 billion USDT and 62 other tokens to the main receiver. Binance 16 and a Binance USDC wallet follow, and later calls sweep new deposits until 23:56 UTC.</li>
<li data-label="Freeze">At 21:01 UTC, Tether freezes the main receiver for USDT, and at 21:04 UTC, Circle freezes its 823 million USDC. The USDT freeze blocks sending but not receiving, so later sweeps bring the frozen USDT to 1,175 million.</li>
<li data-label="ETH out">Fourteen minutes after the sweep, 195,500 ETH leave the main receiver for a new wallet, and 2,000 ETH follow on 30 October. No issuer can freeze ETH.</li>
<li data-label="Sell USDT">At 20:30 UTC, 500 million USDT go to a new pass-through wallet. Between 20:34 and 20:50 UTC, it sells 325 million USDT through UniswapX and 1inch orders for about 122,300 ETH, about 2,660 USDT per ETH, while the Chainlink price feed showed 2,240 to 2,310 USD per ETH. The other 175 million USDT reach a wallet that Tether freezes at 21:15 UTC.</li>
<li data-label="Wallet chain">From 20:33 UTC, another 200 million USDT run through a chain of new pass-through wallets. Along the way, 110 million USDT are swapped for ETH on Uniswap (an automated exchange). One wallet puts 60 million USDT into Aave (a lending service) and borrows about 19,800 WETH (wrapped ETH) against it.</li>
<li data-label="Chain end">At the end of the chain, 30 million USDT stay in a wallet that Tether freezes at 21:19 UTC, and 57,900 ETH reach a third ETH wallet. A side wallet adds 20,500 ETH to it later that night.</li>
<li data-label="ETH now">On 30 October at 05:15 UTC, the main receiver moves its last 17,260 ETH to a fourth wallet. A side branch that sold 217.5 million ENA tokens adds 15,300 ETH to the second ETH wallet. At 11:00 UTC, the four ETH wallets hold 430,737 ETH and have not sent a transaction.</li>
<li data-label="BTC and Tron">On Tron, 300 million USDT go to a swap wallet that turns them into 638.2 million TRX. Tether freezes 313 million USDT in the first attacker wallet and 66 million in a third. The TRX moves on to five new wallets between 10:15 and 10:20 UTC on 30 October. The 18,270 BTC sit unspent in 19 addresses.</li>
</ol>
<figcaption>Figure 2: The Binance hot wallet hack in Iknaio, with one transaction for each pair of addresses. Amounts are totals per pair. Blue marks Binance wallets, red marks attacker wallets, orange marks services such as Tornado Cash, Aave and DEX pools, and a gold frame marks frozen funds.</figcaption>
</figure>
<script src="/js/pathfinder-lite-story.js" defer></script>

## Where the funds are now

On 30 October at 11:00 UTC, none of the four ETH wallets has sent a transaction. Together they hold 430,737 ETH, about 1 billion USD.

| Wallet | Holds | Received from |
|---|---|---|
| [`0x8532fa14acaf483729c449b8458aeddb900543d4`](https://app.iknaio.com/pathfinder/eth/address/0x8532fa14acaf483729c449b8458aeddb900543d4) | 197,460 ETH | the main receiver |
| [`0xc887af690e0301cd4edbbce8f8d31b4ec65b286a`](https://app.iknaio.com/pathfinder/eth/address/0xc887af690e0301cd4edbbce8f8d31b4ec65b286a) | 137,602 ETH | the USDT sale through UniswapX and 1inch, and a sale of ENA tokens |
| [`0x897c80d1a9729e94460e2bd93178bd5215158df3`](https://app.iknaio.com/pathfinder/eth/address/0x897c80d1a9729e94460e2bd93178bd5215158df3) | 78,415 ETH | the wallet chain and a side branch |
| [`0x03b0ee5d82990cff1bda48651ac3e436d1a020ea`](https://app.iknaio.com/pathfinder/eth/address/0x03b0ee5d82990cff1bda48651ac3e436d1a020ea) | 17,260 ETH | the main receiver, 30 October, 05:15 UTC |

On Bitcoin, the 18,270 BTC sit in 19 addresses of the peel chain, for example [`bc1qz8hdwv8gmml0u96dsvnzsagz6krjyzxmgxupdp`](https://app.iknaio.com/pathfinder/btc/address/bc1qz8hdwv8gmml0u96dsvnzsagz6krjyzxmgxupdp) with 1,000 BTC, and are unspent. On Tron, the attacker's TRX wallet [`TSpe5HC3PRD2svJcr1YoGszhHk2mtkyZ8A`](https://app.iknaio.com/pathfinder/trx/address/TSpe5HC3PRD2svJcr1YoGszhHk2mtkyZ8A) sent its 638.2 million TRX to five new wallets between 10:15 and 10:20 UTC on 30 October, the first movement of this TRX since the night of the hack.

## Further notes

The graph is drawn for this post and follows the layout of Pathfinder. It shows the main routes, not every transaction. Amounts are totals per pair of addresses, and small transfers (gas top-ups, dust from address-poisoning bots) are left out.

The XRP Ledger and Solana are not in Pathfinder. Their figures come from public XRP Ledger and Solana nodes. The EIP-7702 authorizations are part of a transaction field that Pathfinder does not display. Pathfinder shows the transfers they cause.

Binance has not yet published a full root cause. The figures in this post reflect the state of the blockchains on 30 October 2026 at 11:00 UTC.

This post and the tracing behind it were made with internal Iknaio tooling that is not yet part of the Iknaio subscriptions.

## References

[1] Binance (2026, October 30). [Update on the security incident](https://x.com/binance/status/2115993361517891592). Binance on X. Reported by [CyberInsider](https://cyberinsider.com/binance-security-incident-6-3-billion/).
