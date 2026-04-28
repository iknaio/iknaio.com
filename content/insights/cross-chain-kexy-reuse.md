---
title: "Cross-Chain Key Reuse: How Public Keys Link Addresses Across Chains"
date: 2026-02-18
description: "New Research Reveals Widespread Key Reuse Between UTXO and Account-Based Cryptocurrencies"
tags: []
image: "images/blog/cross-chain-kexy-reuse/cover.png"
posttype: "insight"
aliases: ["/blog/cross-chain-kexy-reuse/", "/insights/cross-chain-key-reuse/", "/blog/cross-chain-key-reuse/"]
---

## The Privacy Assumption That Doesn't Hold

Different blockchains use different address formats. A Bitcoin address looks nothing like an Ethereum address. This leads many users — and even some investigators — to assume that activity on one chain is effectively invisible from another. A new paper by members of our research team shows that this assumption is flawed.

The study, [Reuse of Public Keys Across UTXO and Account-Based Cryptocurrencies](https://arxiv.org/abs/2601.19500) (Stütz, Stifter, Dragaschnig, Haslhofer, Judmayer, 2026), demonstrates that the same cryptographic keys are used extensively and actively across multiple blockchain networks, even when those networks employ seemingly incompatible address formats.

![](/images/blog/cross-chain-kexy-reuse/figure-1.png)

## Why Address Matching Alone Is Not Enough

Previous research on cross-chain address reuse relied on direct address matching or basic format conversion. This works well among UTXO-based cryptocurrencies that share the same address encoding (e.g., Bitcoin, Litecoin, Zcash) or among EVM-compatible chains where addresses are identical by design (e.g., Ethereum and Tron).

However, the address formats of Bitcoin and Ethereum, the two most widely used blockchain designs, are not compatible at the address level, even though both rely on the same elliptic curve (secp256k1) and digital signature scheme (ECDSA). A Bitcoin P2PKH address is a Base58Check encoding of a RIPEMD-160(SHA-256(public key)) hash, while an Ethereum address is derived from a Keccak-256 hash of the same public key. The resulting strings share no visible similarity, yet they can be controlled by the same entity.

The key insight of the paper is to look deeper: instead of comparing addresses, the authors extract and compare the underlying public keys directly. This allows the identification of cross-chain key reuse even between fundamentally different blockchain architectures.

## Key Findings

The study analyzed six major cryptocurrency networks: **Bitcoin, Ethereum, Litecoin, Dogecoin, Zcash, and Tron**. Public keys were extracted from all transaction types where they are exposed on-chain (e.g., transaction inputs in UTXO systems and transaction signatures in account-based systems).

The results are significant:

**Over 1.6 million public keys** were found to be reused across at least two of the analyzed networks.

- Key reuse is not a historical artifact, it remains an **active and ongoing phenomenon**.

- The most frequent overlaps occur among UTXO-based chains (Bitcoin, Litecoin, Dogecoin, Zcash), which is expected due to their shared codebase heritage. However, substantial reuse also occurs **between UTXO and account-based systems**, notably between Bitcoin and Ethereum — a pairing that prior address-matching methods could not detect.

- Even a single reused key creates a deterministic link: if the same public key appears on Bitcoin and Ethereum, all addresses derivable from that key on both chains are provably controlled by the same entity.

![](/images/blog/cross-chain-kexy-reuse/figure-2.png)

## From Key Reuse to Cross-Chain Clustering

Beyond quantifying reuse, the paper introduces a novel cross-chain clustering method. The approach works as follows:

- **Extract public keys** from transaction signatures across all analyzed networks.

- **Identify reused keys** by computing set intersections across networks.

- **Derive all possible addresses** from each reused key for every supported network.

- **Transfer clustering information** across chains: if a set of Bitcoin addresses has been grouped into a cluster via the multi-input heuristic, and one of the public keys in that cluster also maps to an Ethereum address, then that Ethereum address can be assigned to the same cluster.

This method does not rely on heuristics for the cross-chain link itself. The connection between addresses on different chains is cryptographically exact — it is based on proof of knowledge of the same private key.

Using this technique, the authors were able to cluster **497,289 Ethereum addresses into 62,681 clusters** and **305,019 Tron addresses into 19,242 clusters**, by transferring Bitcoin's multi-input clustering across the chain boundary.

![](/images/blog/cross-chain-kexy-reuse/figure-3.png)

## How This Is Implemented in Iknaio

The methods described in this paper are not theoretical — they form the basis for Iknaio's cross-chain address clustering capabilities, available since our [Release 25.09](../tracing-dexs-bridges-cross-chain-clusters/).

In Iknaio's platform, cross-chain clustering works as follows:

**Public key extraction and matching.** GraphSense, the open-source analytics engine behind Iknaio, extracts public keys from all supported UTXO and account-based ledgers (currently Bitcoin, Bitcoin Cash, Litecoin, Zcash, Ethereum, and Tron). These keys are systematically compared across networks to identify instances of reuse.

**Exact cross-chain clusters.** When the same public key is found on multiple networks, Iknaio derives all associated addresses and groups them into a cross-chain cluster. Unlike heuristic-based approaches, this clustering is deterministic: it is grounded in the cryptographic fact that only the holder of the corresponding private key could have signed transactions on both chains.

**Investigative workflow integration.** In Pathfinder, Iknaio's tracing interface, investigators can see cross-chain cluster information directly when examining an address. If an address on one network is linked to addresses on other networks via shared keys, these connections are surfaced automatically. This allows investigators to follow leads across chain boundaries without manual key extraction or format conversion.

**Combining methods for comprehensive coverage.** Cross-chain key-based clustering complements Iknaio's other cross-chain capabilities, including tracing through decentralized exchanges (DEXs) and bridge protocols. Together, these methods provide investigators with a comprehensive view of entity activity across the multi-chain ecosystem.

![](/images/blog/cross-chain-kexy-reuse/figure-4.png)

## Implications for Investigators and Compliance

The findings have direct practical relevance:

- **For law enforcement and forensic investigators:** Cross-chain key reuse provides a reliable, evidence-grade link between addresses on different networks. Because the link is based on cryptographic identity rather than behavioral heuristics, it carries strong evidential weight — an important consideration when presenting findings in legal proceedings.

- **For compliance teams at VASPs and financial institutions:** Understanding that users may control addresses across multiple chains under the same cryptographic identity is essential for accurate risk assessment. A wallet flagged on one network may have previously undetected exposure on another.

- **For privacy-conscious users:** The research serves as a reminder that reusing keys across chains significantly weakens pseudonymity. Users who value privacy should avoid using the same key material on multiple networks.

## Read the Full Paper

The complete study is available as an open-access preprint:

Stütz, R., Stifter, N., Dragaschnig, M., Haslhofer, B., & Judmayer, A. (2026). *Reuse of Public Keys Across UTXO and Account-Based Cryptocurrencies.* arXiv preprint. [https://arxiv.org/abs/2601.19500](https://arxiv.org/abs/2601.19500)

To explore cross-chain address clustering in practice, [try Iknaio's platform](/contact/) or contact us at [contact@iknaio.com](mailto:contact@iknaio.com).

