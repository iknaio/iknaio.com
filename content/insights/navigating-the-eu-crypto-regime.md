---
title: "Navigating the EU Crypto Regime"
date: 2025-07-07
description: "How Iknaio helps CASPs comply with MiCAR, AMLD6, DAC8 and the Travel Rule"
tags: []
image: "images/insights/navigating-the-eu-crypto-regime/cover.png"
posttype: "insight"
aliases: ["/blog/navigating-the-eu-crypto-regime/"]
---

The EU is rolling out a comprehensive set of rules for cryptoassets in 2024–2025. Key new laws include **MiCAR** (Markets in Crypto-Assets Regulation), the **Transfer of Funds Regulation** (TFR, or “crypto Travel Rule”), the **Sixth Anti-Money Laundering Directive (AMLD6)**, and **DAC8** (cryptoasset reporting under the amended Administrative Cooperation Directive). These build on (and overlap with) existing frameworks like PSD2 and upcoming payment regulation (PSD3/PSR). Together they impose licensing, disclosure, reporting, monitoring and risk-management obligations on exchanges, wallet providers, and institutional crypto actors. In this post, we outline the main obligations and challenges each framework brings, and show how Iknaio’s blockchain analytics tools can help meet them.

## **MiCAR: Uniform Rules for Crypto-Asset Issuers and Service Providers**

MiCAR (Regulation 2023/1114) creates an EU-wide rulebook for cryptoassets not covered by existing financial laws. It requires all **Crypto-Asset Service Providers (CASPs)** and issuers of e-money or asset-referenced tokens to obtain EU authorization. Authorized CASPs must have robust governance and risk-management procedures, including AML/CFT controls commensurate with their risks. Issuers of tokens must publish standardized whitepapers. In addition to licensing, MiCAR imposes strict disclosure and supervision rules aimed at market integrity – for example, firms must be transparent about conflicts of interest, keep detailed order-book records, and monitor transactions and wallets. MiCAR also mandates consumer protections (e.g. for stablecoins and asset-backed tokens). In short, MiCAR turns on familiar requirements (capital, compliance programs, audits and disclosures) but extends them to crypto.

**Obligations & challenges under MiCAR** include:

**Authorisation & governance:** CASPs must file for a license, disclose management structure, and demonstrate control frameworks (see MiCAR Art. 62). Firms already operating may rely on a transitional “grandfathering” period (services under prior AML regimes continue until mid-2026).

- **AML/CFT compliance:** Once authorised, CASPs must implement AML/CFT policies and internal controls. MiCAR references EU AML laws, so CASPs must follow customer due diligence, risk assessments, transaction monitoring, etc., much like banks.

- **Travel Rule:** MiCAR explicitly requires crypto transfers to carry originator and beneficiary data (in line with the Travel Rule in TFR, below). Providers must flag and investigate transfers involving self-hosted wallets or incomplete information.

- **Product requirements:** Issuers of cryptoassets (e.g. stablecoins) face new disclosure and reserve requirements. Asset-Referenced Tokens must be backed by reserve assets, and E-Money Tokens by central-bank funds, with proof-of-reserve auditing.

- **Regulatory transparency:** Firms must report incidents, cooperate with supervisors, and comply with record-keeping. The phased implementation will fill in details like whitepaper templates, governance tests, etc.

MiCAR thus creates a layered regime: CASPs will have both a MiCAR license and, once it applies, the strengthened AML regime of AMLD6 (see below). One complexity is **overlap with payment rules** (see below). In practice, compliance teams will juggle MiCAR’s fit-and-proper rules alongside enhanced AML/CFT measures and new tax reporting (DAC8).

## **AMLD6 & the Crypto Travel Rule (TFR): Strengthened AML/CFT Controls**

AMLD6 (Directive (EU) 2024/1640) is the new AML directive adopted May 2024 to overhaul the EU’s AML framework. It builds on AMLD5 by **expanding scope and enforcement**. Notably, AMLD6 requires EU-wide centralized bank account registers to include cryptoasset accounts. In practice, this means crypto firms and wallets must register accounts so that law enforcement and FIUs can identify holders and seize assets if needed. AMLD6 also tightens beneficial ownership rules and increases sanctions for non-compliance.

In parallel, Regulation (EU) 2023/1113 (the Transfer of Funds Regulation – TFR) extends AML-style controls to crypto transfers. This TFR, part of the new AML package, effectively enshrines the FATF “Travel Rule” in EU law. It **requires PSPs and CASPs to attach full originator and beneficiary information to all transfers of funds or cryptoassets**. The European Banking Authority’s new guidelines specify that payment and crypto firms must detect missing information and take action (e.g. apply enhanced due diligence, reject or suspend a transfer) if details are incomplete. For example, if a crypto transfer lacks beneficiary data, the CASP must investigate or block it, per TFR rules. These measures apply to both fiat and crypto payments, across all amounts and borders. The rules (and EBA guidelines) enter into force end-2024.

**Obligations & exemptions:**

- Under **Regulation (EU) 2023/1113**, CASPs must attach originator and beneficiary information to all crypto‑asset transfers — reflecting the EU's implementation of the FATF Travel Rule. However, the **EBA's Travel Rule Guidelines (EBA/GL/2024/11)** also define specific **exceptions** and **derogations** that CASPs may apply.

- **Low-value transfers (≤ €1,000):** Transfers below or equal to €1,000, including those involving self-hosted wallets, are **not required to be verified** — only the information must be collected. No ownership verification using technical means is needed in this bracket.

- **Linked transfers:** A set of transfers may be treated as a single event (thus benefiting from thresholds) if they share originator, beneficiary, and timeframe - based on a CASP’s risk-based detection of linked activity.

- **Payment-specific services:** Transfers intended exclusively to purchase goods or services (e.g. merchant payments where the instrument is clearly defined as payment-only) may fall under exemption rules defined in Article 2(3)(a) and (5)(b) of Regulation 2023/1113 - meaning the transfer may not trigger full travel-rule obligations if it meets defined merchant/payment use criteria.

- **Risk-based monitoring:** Both AMLD6 and the TFR emphasize risk assessments. CASPs must continually rate the ML/TF risk of customers, products and channels, including self-hosted wallet interactions. Unusual patterns trigger reporting.

- **Central registries:** Under AMLD6, EU Member States must implement national account registers that include cryptoasset accounts. These registers are to be accessible to FIUs and other authorities for the purpose of financial crime detection.

- **Enhanced supervision and penalties:** AMLD6 tasks national AML supervisors (and the new European AML Authority - AMLA) with stricter oversight of crypto firms. Firms will maybe face heavier fines for breaches.

In short, the new AML regime means CASPs must embed robust transaction monitoring, KYC and data-sharing for crypto transfers. Traditional banks have long done this for fiat, but crypto firms will have to upgrade.

## **DAC8: Crypto-Asset Reporting for Tax Transparency**

DAC8 (the 8th Directive on Administrative Cooperation, published Oct 2023) introduces an EU-wide tax reporting regime for crypto transactions. It parallels the OECD’s Crypto-Asset Reporting Framework (CARF). From 1 Jan 2026, EU **Crypto-Asset Service Providers (CASPs)** must collect detailed information on customers’ crypto transactions and report annually to tax authorities. In practice, CASPs will do KYC/due diligence on all clients (especially non-residents), record their trades and transfers in cryptoassets, and send this data to their home tax agency for exchange with other Member States. The first reports (for 2026) will be exchanged by Sept 2027.

Key points of DAC8:

- **Scope:** A broad definition of cryptoassets (building on MiCA) means most tokens – including decentralized cryptoassets, stablecoins (EMTs), and many NFTs – fall under the rules. Even non-custodial wallets may trigger reporting if services are provided (as “Reporting CASPs”).

- **Reporting duties:** CASPs must implement rigorous due diligence on clients and report all transactions of their users who are EU tax residents in other countries. The law specifies data fields (who, when, what, how much, etc.) and user IDs.

- **Purpose:** The aim is transparency for tax purposes – to track crypto income and gains across borders. It is separate from AML but similarly requires solid data management.

The main challenge is data handling. Crypto firms must build or integrate systems that match on-chain addresses to customer identities and then produce standardized reports. This overlaps with AML/CFT KYC systems, but DAC8 is driven by tax rather than crime prevention.

## **Payments Framework: PSD2/PSD3 and the Interplay with MiCA**

A key area of regulatory overlap lies between the **Markets in Crypto-Assets Regulation (MiCAR)** and the **EU payments framework**, currently governed by PSD2 and soon evolving into **PSD3/PSR**.

Under MiCAR, **Electronic Money Tokens (EMTs)** are explicitly treated as electronic money. This means issuers of EMTs must be authorised under the E-Money Directive (EMD2), and their services may fall within the scope of PSD2 - even though MiCA authorises EMT issuance itself. What remained unclear was whether a **MiCA-authorised Crypto-Asset Service Provider (CASP)** may also provide **payment services** without needing separate PSD2 authorisation.

On **10 June 2025**, the **European Banking Authority (EBA)** published its **No Action Letter** clarifying this overlap. The opinion was issued at the request of the European Commission (in December 2024) and provides both short‑term relief and long‑term direction for authorities and CASPs.

### **Key advice from the EBA No Action Letter:**

- NCAs should treat the **transfer, custody and administration of EMTs** (when provided on behalf of clients, especially via custodial wallets that enable third-party transfers) as **payment services under PSD2**.

- **Exchange services** - meaning exchanging cryptoassets for fiat or other cryptoassets, including intermediation of such exchanges - **should not** be treated as payment services and therefore **do not require PSD2 authorisation**.

- A **transitional period** is granted until **2 March 2026**, during which NCAs are **not required** to enforce PSD2 authorisation for EMT-related services meeting the defined criteria.

- The **EBA does not recommend a “no action” approach**, but rather urges competent authorities to enforce the existing legal framework to avoid gaps in consumer protection and financial supervision.

- For entities that do require authorisation after the transition period, **NCAs are advised to use streamlined procedures** - leveraging MiCA application data - to avoid duplicative processes.

- Post‑authorisation by PSD2, NCAs can **de-prioritise enforcement** of certain PSD2 provisions such as safeguarding, consumer fee disclosures, and open banking requirements; but must still enforce **strong customer authentication**, fraud reporting, and **own-funds/capital** requirements.

### **Implications for CASPs:**

- CASPs offering EMT-related services must assess whether those services fall into PSD2’s payment service definitions.

- They should **plan for potential dual authorisation** under both MiCA and PSD2 or partner with a regulated **Payment Service Provider (PSP)** - unless they can rely on the transitional relief period.

- Organisations needing PSD2 authorisation post‑March 2026 must **ensure strong compliance** with SCA, fraud reporting, and capital frameworks.

- MiCAR's framework for EMTs **does not override** PSD2 - rather, it complements it. Compliance must be ensured under both regimes where activities intersect.

- Long‑term resolution is expected in the **PSD3/PSR legislative process**, where MiCA may be amended to avoid unnecessary dual licensing or overlap.

In practice, this means compliance teams at CASPs will need to **map out their service offerings** against PSD2 categories and ensure that **consumer protection, security, fraud prevention, and capital requirements** under PSD2 are not overlooked. The EBA’s stance reinforces that cryptoassets, especially when used for payments, are **not operating in a regulatory vacuum**.

## **The Big Picture: Overlaps and Implementation Challenges**

In combination, these regulations impose a heavy compliance burden. Some overlaps and intersections:

- **AML/CFT rules:** MiCA incorporates and extends AMLD requirements, while TFR’s travel rule is a crypto-specific implementation of AMLD provisions on data sharing. All CASPs will be obliged entities under the strengthened AMLD6 rules, subject to customer due diligence, **transaction monitoring, sanctions screening**, and strict record-keeping.

- **Data and reporting:** AMLD6/TFR and DAC8 both require **gathering more customer and transaction data** – for different end goals (crime vs tax). Firms will need to reconcile these regimes: e.g. the customer identifiers used in tax reporting may overlap with KYC IDs used for AML.

- **Consumer protections:** MiCA’s investor safeguards (whitepapers, disclosure, reserve audits) echo PSD2’s and e-money rules on protecting end users and ensuring funds safety. A CASP issuing tokens that act like deposits or payments will need to implement features like segregated reserves, capital buffers, and customer complaint procedures.

Compliance systems must be integrated. **Standard transaction-monitoring solutions (rule-based alerts) are necessary but not sufficient** – crypto brings unique challenges. For example, peer-to-peer wallets and privacy coins can obscure senders/receivers, and global blockchains don’t inherently carry IP info or real names.

## **How Iknaio Supports Compliance**

Where traditional tools fall short, **Iknaio’s analytics platform** provide deeper insight into crypto transactions and counterparties. Our platform can trace flows across multiple blockchains and attach high-quality attribution tags (exchange wallets, mixer addresses, darknet markets, etc.) from diverse sources. This enriches raw blockchain data with context that KYC or standard monitoring might miss.

Key compliance needs addressed by Iknaio:

- **Counterparty risk analysis:** Iknaio clusters related addresses to identify real-world entities, but clustering has inherent limitations and uncertainties. Reliable results depend on the availability of curated input data - for instance, when a dedicated set of addresses has been verified to belong to an entity. Iknaio therefore prefers a combined approach that includes such enriched address data, alongside address-based risk assessments. This allows compliance teams to assess risk with greater confidence and transparency in source attribution. By linking on-chain transactions with off-chain intelligence (media, blockchain tags, 3rd party tag sources), our tools help spot high-risk counterparties (e.g. sanctioned entities, mixers) during onboarding and ongoing monitoring.

- **Proof-of-Funds & Source-of-Funds:** Investigators and compliance officers can use our tracing tools to verify that incoming funds originate from legitimate sources. Pathfinder’s “monitor transactions at aggregated levels” feature lets you follow a deposit’s path through the network, checking whether funds came from clean wallets or flagged actors. This supports AMLD/CFT diligence and MiCA’s requirement to understand an account’s funds.

- **Holistic transaction monitoring:** Beyond simple pattern alerts, Iknaio enables **network-level analysis**. For example, simultaneous spikes, cross-chain movements, or links to known criminal clusters can be detected. We integrate multiple data streams (blockchain, transaction metadata, 3rd party sources) so a compliance team gains a consolidated risk view. This complements – not replaces – standard monitors, filling gaps where on-chain insights are needed.

- **Proof-of-Reserves:** Exchanges and custodians can leverage on-chain transparency to prove they hold the crypto they owe. Iknaio can audit an entity’s wallet cluster to sum total balances and track reserves over time. Any discrepancy (e.g. customer deposits missing on-chain) becomes apparent. This helps satisfy MiCA’s auditing requirements for token issuers and builds trust for custodial services.

Importantly, Iknaio is **not a rule-based filter** but a suite of “deep dive” analytics. We don’t compete with AML transaction-screening vendors. Instead, we provide targeted analytics modules that fill critical blind spots - such as linking on- and off-chain data, processing large data-sets to detect suspicious patterns, and enabling a truly holistic view of counterparty and transactional risk. Our tools are built for investigators and compliance analysts: intuitive UIs for tagging, annotating and collaborating on blockchain cases. By turning raw blockchain data into actionable intelligence, Iknaio helps crypto firms meet the new EU mandates with confidence.

In addition, Iknaio’s Data analytics platform brings industrial-grade scalability and flexibility to cryptoasset analytics. Built on open-source frameworks like GraphSense, Apache Spark, and Cassandra, it supports API-driven workflows and automated analytics jobs that allow CASPs to analyze millions of transactions at scale. The platform can process on- and off-chain data simultaneously, enabling customer profiling, risk scoring, global money flow mapping, and automated goAML reporting. Its modular architecture allows clients to define custom metrics, design workflow-specific analytics pipelines, and receive results in structured formats or raw data.This flexible data science platform is particularly valuable for institutions facing fragmented data sources and high compliance workloads. With this platform, Iknaio provides a scalable, transparent, and regulator-ready solution for next-generation crypto compliance.

## **Looking Ahead**

This post has surveyed the broad outlines of the incoming EU crypto rulebook: MiCA’s market rules, new AML/CFT and travel-rule mandates, crypto tax reporting under DAC8, and the interplay with payments law.

For compliance teams and crypto firms, the message is clear: the regulatory bar is rising. Successful crypto compliance will require both robust processes and the right analytics. Iknaio’s tools are designed to fill that gap, empowering firms to navigate the complexity of blockchain compliance.

**Source References:** Authoritative EU regulatory texts and guidance have been used throughout (see citations). These frameworks are as published by European regulators and the European Commission:

[esma.europa.eu](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica#:~:text=The%20Markets%20in%20Crypto,informed%20about%20their%20associated%20risks)

[eba.europa.eu](https://www.eba.europa.eu/sites/default/files/2024-12/25bb6d67-4bd1-4e54-805c-269d9657e7fb/Preventing%20ML%20TF%20in%20the%20EU%27s%20crypto%20assets%20sector.pdf#:~:text=CASPs%2C%20issuers%20of%20asset,CASPs%20also%20have%20to%20apply)

[taxation-customs.ec.europa.eu](https://taxation-customs.ec.europa.eu/taxation/tax-transparency-cooperation/administrative-co-operation-and-mutual-assistance/directive-administrative-cooperation-dac/dac8_en#:~:text=Reporting)

[dlapiper.com](https://www.dlapiper.com/en/insights/publications/2024/12/the-new-anti-money-laundering-rules-what-you-need-to-know#:~:text=The%20AMLD6%20extends%20the%20AMLD4%27s,Commission%20by%2010%20July%202029)[eba.europa.eu](https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/anti-money-laundering-and-countering-financing-terrorism/guidelines-information-requirements-relation-transfers-funds-and-certain-crypto-assets-transfers#:~:text=The%20Guidelines%20on%20preventing%20the,a%20common%20understanding%20to%20ensure)

[eba.europa.eu](https://www.eba.europa.eu/sites/default/files/2025-06/e2958c99-a1b0-4b07-9d31-bcba0a28dbe7/Opinion%20on%20the%20interplay%20between%20PSD2%20and%20MiCA.pdf#:~:text=2,Nevertheless)

[eba.europa.eu](https://www.eba.europa.eu/sites/default/files/2025-06/e2958c99-a1b0-4b07-9d31-bcba0a28dbe7/Opinion%20on%20the%20interplay%20between%20PSD2%20and%20MiCA.pdf#:~:text=the%20legislative%20process%20of%20PSD3%2FPSR,Action%20letter%20advises%20to%20achieve)

