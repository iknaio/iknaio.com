---
title: "Tracing through DEXs, over Bridges, and Cross-Chain Address Clusters"
date: 2025-09-30
description: "Taking You Behind the Scenes of Our Latest Release (25.09)"
tags: []
image: "images/blog/tracing-dexs-bridges-cross-chain-clusters/cover.jpg"
posttype: "insight"
aliases: ["/blog/tracing-dexs-bridges-cross-chain-clusters/", "/news/tracing-through-dexs-over-bridges-and-cross-chain-address-clusters/"]
---

Decentralized Finance (DeFi) has evolved into a multi-blockchain ecosystem where users seamlessly swap tokens and transfer assets across networks. Decentralized exchanges (DEXs) and bridging services have become essential infrastructure, enabling everything from simple ETH-to-USDT swaps to complex cross-chain transfers.

Our latest release introduces powerful new capabilities for analyzing these complex asset flows. You can now trace transactions through DEXs and bridging services, plus leverage our new exact address clustering method to group addresses controlled by the same entity across different blockchain networks.

Here's how these new features work under the hood.

**Tracing through Decentralized Exchanges (DEXs)**

DEXs have revolutionized token trading by eliminating intermediaries like centralized exchanges. Platforms such as Uniswap and Sushi enable instant token swaps with minimal transaction costs and no KYC requirements. For a comprehensive list of DEX protocols, visit [DeFiLama](https:// defillama.com/protocols/dexs).

These exchanges operate by pooling liquidity in token pairs (like ETH/USDT) provided by staking users. When users call the "swap" function, an Automated Market Maker algorithm determines pricing dynamically. For technical details on DEX mechanics, check [this report](https://www.bis.org/publ/work1066.htm).

The challenge with tracing flows through DEXs lies in understanding each platform's unique swap execution logic. This information is embedded in smart contract logs that can span multiple contracts, making manual analysis complex and time-consuming.

Our new functionality automatically identifies swap transactions and connects input token flows with output token flows. This means you can now trace asset movements through DEXs without interruption, maintaining complete visibility into transaction paths that previously appeared to dead-end at exchange interfaces.

**Tracing over Bridges**

Blockchain bridges facilitate token transfers between different networks. Protocols like Thorchain or Symbiosis enable asset movement across Ethereum, Tron, Bitcoin, and other chains.

Bridges operate through lock-and-mint or burn-and-mint mechanisms. Tokens are either locked on the source chain while equivalent tokens are minted on the destination chain, or burned on the source chain while corresponding tokens are released on the destination chain.

Bridge transactions present unique tracing challenges since they span multiple networks with separate transaction hashes, timestamps, and protocols. No direct cryptographic link exists between source and destination transactions.

Our implementation analyzes bridging events to detect outgoing or incoming bridging actions and resolves the associated cross-chain transactions using bridge-specific identifiers. This reconstructs complete transaction paths across networks, enabling continuous asset flow analysis through bridge operations.

**Cross-Chain Address Clustering**

Address clustering identifies addresses potentially controlled by the same entity, originally developed for UTXO-based networks like Bitcoin. This technique groups related addresses based on transaction patterns, address reuse, and behavioral indicators to map common ownership across seemingly unrelated addresses.

Traditional clustering methods analyze transaction inputs, change address patterns, and other behavioral features using heuristic approaches. These rule-of-thumb techniques can produce false positives, making them suitable for generating investigative leads but requiring careful validation for forensic applications.

Our cross-chain clustering implementation analyzes public keys used to sign transactions across different blockchain networks. Unlike heuristic methods, this approach provides exact cluster identification by grouping addresses definitively derived from the same public key. This cryptographic linkage offers strong evidence of common ownership both within individual networks and across different blockchain platforms.

**Take away and outlook**

These new capabilities for DEX tracing, bridge analysis, and cross-chain address clustering provide comprehensive coverage of modern DeFi transaction flows. The functionality is fully implemented and designed for extensibility across additional DEXs, bridging services, and blockchain networks.

We prioritize coverage based on transaction volume and market significance, continuously expanding support for the most relevant protocols and networks. This targeted approach ensures maximum analytical value while maintaining system performance and accuracy.

For questions about specific protocol support or feature requests, contact us at [contact@iknaio.com](mailto:contact@iknaio.com).

