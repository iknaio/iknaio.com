---
title: "Platform"
description: "An in-depth look at the Iknaio platform: Pathfinder, CaseConnect, QuickLock, the CSAM Checker, and the API & MCP interface for automation and AI agents."

hero:
  title: "Platform"
  subtitle: "Empower your investigations using the Iknaio cryptoasset analytics platform offering several productivity tools."
  image: "images/platform/hero.svg"
  alt: "Diagram of five connected nodes representing Iknaio's cryptoasset analytics platform."

tools:
  - slug: "pathfinder"
    name: "Pathfinder"
    icon: "images/platform/icons/pathfinder.svg"
    headline: "A simple yet powerful tracing tool for every investigator."
    rows:
      - layout: "text-left"
        image: "images/platform/pathfinder-1.png"
        alt: "Pathfinder dashboard showing a Bitcoin address transaction graph with cluster information."
        text: |
          Iknaio Pathfinder provides a user-friendly service to track money flows across major cryptoasset networks, including Bitcoin, Ethereum, and Tether.

          Its simple interface enables you to monitor transactions at both individual and aggregated levels, giving you a clear, comprehensive view of financial flows. You can organize your investigations by tagging addresses and highlighting critical transaction paths, helping you stay focused and efficient.

          Easily export and share investigations and tags to collaborate effectively on complex projects.
      - layout: "image-left"
        image: "images/platform/pathfinder-2.png"
        alt: "Pathfinder showing an Ethereum smart-contract transaction trace."
        text: |
          Powered by the open-source [GraphSense Dashboard](https://github.com/graphsense/graphsense-dashboard), Iknaio Pathfinder is enhanced with additional attribution tags from various sources and integrates advanced features like CaseConnect and QuickLock, offering a complete investigation toolkit.

  - slug: "caseconnect"
    name: "CaseConnect"
    icon: "images/platform/icons/caseconnect.svg"
    headline: "Collaborate with other investigators working on related cases."
    tagline: "Link, track, and consolidate cases across your organization. CaseConnect leverages collaborative intelligence by connecting related cases, ensuring coordinated efforts and improved efficiency."
    rows:
      - layout: "image-left"
        image: "images/screenshots/screenshot-caseconnect.png"
        alt: "CaseConnect investigation platform for cryptoasset cases, fostering collaboration and shared insights to improve blockchain analysis and investigative efficiency."
        text: |
          CaseConnect is designed to streamline case management and enhance collaboration within your organization. By linking case details to cryptoasset addresses, you can easily track and consolidate investigations.

          When organization-wide sharing is enabled, colleagues can view which addresses are already under investigation and collaborate, ensuring coordinated efforts and eliminating duplicated work.

  - slug: "quicklock"
    name: "QuickLock"
    icon: "images/platform/icons/quicklock.svg"
    headline: "Automatically trace and report fund flows."
    tagline: "Enable even novice investigators to generate comprehensive reports that trace funds across blockchain networks. QuickLock simplifies reporting, empowering investigators with faster, accurate results."
    rows:
      - layout: "text-left"
        image: "images/screenshots/screenshot-quicklock.png"
        alt: "QuickLock blockchain forensics tool automating transaction tracing and detailed cryptoasset money flow reports, boosting investigation efficiency."
        text: |
          QuickLock provides a user-friendly tool that empowers investigators, even with basic cryptoasset knowledge, to perform the crucial first step of tracing victim funds to a cryptoasset exchange.

          The tool allows investigators to automatically generate comprehensive reports of these traces, speeding up the process and improving accessibility.

  - slug: "csam-check"
    name: "CSAM Checker"
    icon: "images/platform/icons/csam-check.svg"
    headline: "Check an address against known CSAM attribution tags, on every network it exists on."
    tagline: "A Pathfinder plugin for CSAM casework. One address in, every supported network checked in parallel, and every hit labelled with how closely it relates to the address you asked about."
    rows:
      - layout: "text-left"
        image: "images/screenshots/screenshot-csam-check.png"
        alt: "The CSAM Checker in Iknaio Pathfinder, showing an address checked across every network it exists on with a summary above the results table."
        text: |
          Enter one address. The CSAM Checker first works out which of the supported networks that address exists on, then checks each of them in parallel against addresses tagged as related to child sexual abuse material. Results appear as each network finishes, so the first hits are on screen while the rest are still running, and the full table exports as CSV for the case file.

          Tags come from several sources, among them the Dark Web Monitor operated by [CFLW](https://cflw.com/). Every row names the source its tag came from and links back to it, so the origin of a finding is one click away.

          You do not have to start from the checker. Right-click any address in the Pathfinder graph and pick **CSAM Check** to open it on that address. Started from a node on one chain, the check still covers every network the address exists on.
      - layout: "image-left"
        image: "images/platform/csam-check-results.png"
        alt: "CSAM Checker results table with one row per match, showing the relationship, the tag concept, the tag source and a link back into Pathfinder."
        text: |
          Every hit arrives labelled with the relationship that produced it, ordered from the finding that bears most directly on the address to the one that bears least: the address itself is tagged, another address in the same cluster is tagged, a direct neighbour that sent or received funds is tagged, or an address in a cluster that exchanged funds with this cluster is tagged.

          A cluster groups addresses likely controlled by the same actor, so a same-cluster hit is a lead rather than proof. Printing the relationship on every row is what lets each finding be weighed for what it is.

          Some clusters and neighbourhoods are too large to check exhaustively in reasonable time. When that happens, the checker names which checks it performed and which it skipped, together with the figure that tripped the limit, so an incomplete check is never mistaken for a clean address.

  - slug: "api-mcp"
    name: "API & MCP"
    icon: "images/platform/icons/automator.svg"
    headline: "Automate complex workflows; build agentic pipelines that scale."
    rows:
      - layout: "text-left"
        image: "images/screenshots/screenshot-api.png"
        alt: "Iknaio REST API documentation showing endpoints for address lookups and transaction tracing."
        text: |
          The Iknaio REST API provides programmatic access to the same data that powers Pathfinder. Automate address lookups, entity attribution, and transaction tracing, and integrate blockchain intelligence directly into your existing AML, case-management, and analytics stacks.

          Through the Model Context Protocol (MCP) server, AI agents can connect to Iknaio data and tools, enabling agentic investigation pipelines that scale. Build workflows that trace funds, screen counterparties, and prepare reports — automatically.

cta:
  title: "Ready to investigate crypto money flows.<br>More efficiently?"
  actions:
    - text: "Get access"
      url: "contact/"
      style: "primary"
    - text: "View Packages"
      url: "packages/"
      style: "secondary"
---
