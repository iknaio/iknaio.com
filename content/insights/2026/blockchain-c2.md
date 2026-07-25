---
title: "Tracing Blockchain-Controlled Malware: Joining Forces with VMRay"
date: 2026-03-24
description: "A joint investigation by VMRay and Iknaio demonstrates how combining dynamic malware analysis with cross-chain blockchain forensics can identify the individuals behind sophisticated cyber threats."
tags: ["malware", "cross-chain", "investigation", "partnership"]
posttype: "insight"
aliases: ["/blog/blockchain-c2/"]
image: "images/insights/blockchain-c2/cover.png"
---

Threat actors are constantly evolving their tactics. One increasingly observed technique involves abusing public blockchains, specifically the Binance Smart Chain (BSC), as Command-and-Control (C2) infrastructure for malware operations. By hosting malicious code on-chain, attackers can circumvent traditional blocking mechanisms: smart contracts cannot simply be taken down like a conventional web server.

In a recent joint investigation, **VMRay** and **Iknaio Cryptoasset Analytics** collaborated to analyze a specific malware sample leveraging this technique, sometimes referred to as *EtherHiding*. We traced the associated cryptocurrency flows across multiple blockchain networks, uncovering leads that could help law enforcement identify the perpetrators.

## How VMRay Discovered the Malware

VMRay's Labs team continuously analyzes new malware samples to identify emerging techniques. During routine analysis, they identified a sample from URLhaus that was distributed via a URL hosted on infrastructure belonging to a UK-based company (since taken down). What made this sample stand out: it used a public blockchain as its C2 channel, a technique that is difficult to disrupt because blockchain data is immutable and globally accessible.

VMRay's dynamic analysis revealed the malware's behavior in detail: upon execution, it reached out to a smart contract deployed on the BSC network to retrieve C2 instructions. The sandbox captured the exact contract interaction, including the ABI function call the malware used to fetch its command payload. This level of visibility is something that static analysis alone would not provide.

![VMRay sandbox network capture showing the malware's JSON-RPC eth_call request to a smart contract on the BSC Testnet](/images/insights/blockchain-c2/figure-1.png)

The threat actor deployed this contract and periodically invoked its `update` function to push new encoded command sequences. Notably, the contract was deployed on the BSC Testnet, a testing environment where gas fees are paid with freely available testnet BNB rather than real tokens. This means that on the BSC side, there is no direct financial trail from gas payments. However, the operational infrastructure behind the contract still required real funding elsewhere, and that is where the money trail begins.

## From BSC to Ethereum: A Cross-Chain Investigation

This is where Iknaio's blockchain analytics expertise came in. VMRay reached out to Iknaio to help trace who was behind the blockchain transactions funding this operation.

Starting from the smart contract address VMRay identified, Iknaio worked backwards through the on-chain transaction history. Using GraphSense, Iknaio's open-source cryptoasset analytics platform, the team applied address clustering heuristics and cross-chain resolution techniques that go well beyond what a manual block explorer lookup can achieve. This automated analysis traced the contract creator, identified the address that funded the deployment, and detected that the same cryptographic key pair had been used on another blockchain network.

By pivoting the investigation to the Ethereum mainnet, Iknaio uncovered a trail of real-value transactions connected to the same entity. These were transactions that the BSC Testnet alone would never have revealed.

## Following the Money on Ethereum

On the Ethereum chain, Iknaio's analysis revealed that the funding address had received funds from another address with direct connections to a well-known cryptocurrency exchange. The investigation showed that this address both received funds from and sent funds to exchange-controlled addresses. Additional on-chain activity suggested the purchase of BNB tokens, likely used to fund the C2 operations on BSC.

![Ethereum transaction graph linking the suspect address to the funding address and exchange-tagged addresses](/images/insights/blockchain-c2/figure-2.png)

Regulated exchanges operating under Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations are required to collect personally identifiable information on their users. These exchange connections therefore represent potential investigative leads. It is worth noting, however, that KYC processes are not infallible: accounts may have been opened with stolen or fabricated identity documents, and the level of verification varies between exchanges and jurisdictions. Obtaining actual user data also requires formal legal process, which can involve cross-border cooperation and significant lead times. Nonetheless, the identified exchange interactions provide law enforcement with a concrete starting point for further investigation.

## Why This Matters

This case illustrates several important trends in the threat landscape:

- **Blockchain as C2 infrastructure is a growing technique.** Recent reports from major security researchers document threat actors increasingly hiding malicious payloads in smart contracts.

- **Cross-chain analysis is essential.** Investigators who limit their scope to a single blockchain risk missing critical connections. Address reuse across chains with compatible address schemes (Ethereum, BSC, Polygon, Arbitrum, and others) is common and exploitable for forensic purposes.

- **Collaboration between malware analysts and blockchain investigators closes the gap.** VMRay's sandbox captured the live interaction between the malware and the smart contract, revealing the exact contract address, function calls, and encoded payloads that a static analysis would miss. Iknaio then took that on-chain footprint and applied cross-chain clustering and tracing techniques to follow the money to exchange-linked addresses on another chain. Neither could have achieved this result alone.

## Conclusion

The convergence of malware operations and blockchain technology creates new challenges for defenders, but also new opportunities. When threat actors interact with public blockchains, they leave permanent, transparent records of their financial activity. By combining malware analysis with cross-chain blockchain forensics, investigators can turn the attackers' own infrastructure against them.

This joint investigation demonstrates how the combination of dynamic malware analysis and cryptoasset tracing can produce leads that bring law enforcement closer to identifying the individuals behind sophisticated cyber threats.
