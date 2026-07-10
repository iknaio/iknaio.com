---
title: "Platform"
description: "An in-depth look at the Iknaio platform: Pathfinder, CaseConnect, QuickLock, and the API & MCP interface for automation and AI agents."

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
        image: "images/platform/quicklock.png"
        alt: "QuickLock blockchain forensics tool automating transaction tracing and detailed cryptoasset money flow reports, boosting investigation efficiency."
        text: |
          QuickLock provides a user-friendly tool that empowers investigators, even with basic cryptoasset knowledge, to perform the crucial first step of tracing victim funds to a cryptoasset exchange.

          The tool allows investigators to automatically generate comprehensive reports of these traces, speeding up the process and improving accessibility.

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
    - text: "Request a Demo"
      url: "contact/"
      style: "primary"
    - text: "View Packages"
      url: "packages/"
      style: "secondary"
---
