---
title: "Improving Cryptoasset Investigations by Connecting Cases"
date: 2024-12-11
description: "Identify connections between cases with Iknaio CaseConnect"
tags: ["caseconnect", "investigation", "law-enforcement", "research"]
image: "images/blog/improving-cryptoasset-investigations-by-connecting-cases/cover.png"
posttype: "insight"
aliases: ["/blog/improving-cryptoasset-investigations-by-connecting-cases/"]
---

As the prevalence of cryptoasset-related crimes grows, law enforcement agencies are increasingly overwhelmed by the volume and complexity of cases. To help address this challenge, our latest research highlights a powerful approach: improving efficiency by identifying and leveraging connections between cases. This post summarizes key insights from the white paper [Increasing the Efficiency of Cryptoasset Investigations by Connecting the Cases](https://arxiv.org/abs/2311.08205) and previews the methodologies and tools developed to support this approach. Here’s how case connectivity can improve crypto investigations significantly.

**The Challenge**

Cryptoasset investigations have surged, particularly in areas like cyberfraud and sextortion spam, where criminals exploit the pseudonymity of cryptoassets. In 2022, the Bavarian Central Office for the Prosecution of Cybercrime (ZCB) faced over 1,600 fraudulent cybertrading platforms, [resulting in victim losses of over €250 million](https://www.justiz.bayern.de/presse-und-medien/pressemitteilungen/archiv/2022/72.php). With cybercrime becoming a global problem, investigations often overlap without knowledge sharing across jurisdictions, leading to duplicated efforts and prolonged case timelines.

**Key Findings**

Our study’s analysis of 34 cyberfraud and 1,793 sextortion spam cases revealed remarkable connectivity within these domains:

**41%** of cyberfraud cases and ** 96.9%** of sextortion cases could be linked, indicating shared addresses, networks, or patterns among incidents.

- Leveraging these connections saves time and resources by enabling investigators to recognize patterns and connect dots across otherwise isolated cases.

These findings underscore a major opportunity to enhance efficiency through a structured approach to case linkage.

**Methodology and Approach**

Our analysis centered on identifying commonalities within cases, such as reused addresses or collector wallets where funds accumulate. Using GraphSense - our underlying open source cryptoasset analytics platform - we developed the CaseConnect tool. This tool clusters cases based on connections at three levels:

- **Common Addresses:** Cases sharing identical cryptoasset addresses.

- **Common Entities:** Groupings of addresses controlled by the same real-world entity, detected using clustering heuristics.

- **Common Collectors:** Wallets that aggregate funds from multiple cases, typically one step away from the main perpetrator wallets.

Our clustering approach captured **93% of all sextortion cases** through basic address-matching, and by extending to entity and collector-based grouping, we linked nearly all cases effectively.

**The CaseConnect Tool**

CaseConnect enables investigators to identify connections between cases within or across organizations, with the overall goal of avoiding duplication of investigation efforts.

Here’s what makes it unique:

- **Configurable access:** Users define 'zones' to control access to case information, with each zone representing, for example, a law enforcement agency or forensic unit. Visibility can extend across zones to leverage collective intelligence.

- **Integrated Workflow:** Connections can be tagged and updated within forensic workflows, enabling faster evidence gathering and insights.

- **DPR Compliance:** The tool adheres to data minimization principles, recording only essential data for connecting cases.

Investigators can collaborate within 'zones' for secure data access, with the flexibility to share data across jurisdictions when necessary.

**Looking Ahead**

Rapidly growing case numbers and the increasing complexity of cryptoasset investigations call for a network-centric approach. By identifying case clusters, agencies can prioritize cases based on connected networks rather than isolated incidents. This method maximizes impact by allowing law enforcement to target larger crime clusters and share critical findings with other investigators worldwide.

Our findings also point to the value of applying this approach to other crime types, such as ransomware and online child exploitation. As automation and interconnected insights become central, investigative tools must advance to keep pace with the global scope of cybercrime.

**Conclusion**

Our research has shown that many investigators work on the same case without being aware of each other. Tools like CaseConnect demonstrate the potential for more effective and economically viable investigations. This case-connected approach not only strengthens investigative outcomes while lowering overall costs, but also underscores the importance of a collaborative framework for tackling global cybercrime.

By expanding this method across jurisdictions, agencies can optimize resources and better protect victims by disrupting interconnected networks of cybercriminals. We look forward to continuing our work with law enforcement and industry partners to enhance the efficiency and impact of cryptoasset investigations.

