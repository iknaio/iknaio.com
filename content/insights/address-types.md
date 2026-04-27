---
title: "Bitcoin Address Types"
date: 2026-04-14
description: "Bitcoin address types, what they tell an investigator, and how Iknaio uses them."
tags: []
image: "images/blog/address-types/cover.png"
posttype: "insight"
aliases: ["/blog/address-types/"]
---

## Why different address types

Over the years, Bitcoin introduced new address formats to lower fees, improve privacy, and support features like multisignature wallets. Most of these formats produce addresses that start with different characters, making them easy to tell apart at a glance.

The first few characters of a Bitcoin address are a fingerprint. They reveal the earliest point in time the wallet could have been created, what software might have generated it, and what privacy trade-offs were accepted. For an investigator, those characters are a data point worth reading.

## The address types

**P2PKH (Legacy)** addresses start with `1`. This is the original format from 2009. Spending from these addresses costs the most in fees. In recent blocks, P2PKH still accounts for roughly 10-20% of outputs, though its share continues to decline. A `1`-address active today is either very old or deliberately legacy.

**P2SH (Script Hash)** addresses start with `3`. This format can contain different kinds of spending rules behind a single hash. It is what makes multisig wallets and wrapped segwit possible. "Wrapped segwit" means a newer segwit transaction packed inside the older `3`-format, which allowed wallets that had not yet upgraded to still interact with segwit recipients. This type was the standard for exchange wallets and custodial services from roughly 2015 to 2020.

**P2WPKH (Native SegWit)** addresses start with `bc1q` and are 42 characters long. This format restructured how transaction data is stored, reducing fees by 30-40% compared to legacy addresses. It is the default for most modern wallets (Electrum, BlueWallet, Sparrow, hardware wallets) and the most common address type in recent blocks.

**P2WSH (SegWit Script Hash)** addresses also start with `bc1q` but are 62 characters long. This is the native segwit version of P2SH, used primarily for multisig setups. The only way to tell P2WPKH and P2WSH apart from the address alone is the length.

**P2TR (Taproot)** addresses start with `bc1p`. Taproot is the newest format, activated in November 2021. Its key innovation is that a simple single-signature spend looks identical on-chain to a complex multisig or smart contract spend. For investigators this is significant: Taproot makes it harder to distinguish transaction types by looking at the address alone. Adoption has been growing steadily since activation.

## Quick reference

| Starts with       | Type                       | Introduced | Typical use today                   |
|-------------------|----------------------------|------------|-------------------------------------|
| (none)            | P2PK                       | 2009       | Satoshi-era coinbase outputs        |
| `1`               | P2PKH (Legacy)             | 2009       | Older wallets, some exchanges       |
| `3`               | P2SH (Script Hash)         | 2012       | Multisig, wrapped segwit, custodial |
| `bc1q` (42 chars) | P2WPKH (Native SegWit)     | 2017       | Most modern wallets                 |
| `bc1q` (62 chars) | P2WSH (SegWit Script Hash) | 2017       | Native segwit multisig              |
| `bc1p`            | P2TR (Taproot)             | 2021       | Growing default                     |
| (none)            | OP_RETURN                  | 2014       | Data markers, protocol identifiers  |


## Special output types

Two output types appear in transactions but do not use standard addresses:

**P2PK (Pay to Public Key)** stores a raw public key directly in the transaction output. This is the format used in the earliest Bitcoin blocks, including Satoshi's own coinbase rewards. Those coins (estimated at over 1 million BTC) are still unspent. Iknaio resolves P2PK outputs to their equivalent legacy address (by hashing the public key) so they can be clustered and searched like any other address.

**OP_RETURN** outputs embed arbitrary data and cannot be spent. They carry zero value and exist purely as data markers. Common examples include Whirlpool CoinJoin preparation transactions and timestamping services. For an investigator, an OP_RETURN in a transaction can help identify the protocol or service that created it.

## How they evolved on-chain

The chart below shows how the distribution of address types changed over time, based on a sample of roughly 21,000 transactions from the Iknaio database.

![](/images/blog/address-types/figure-1.png)

Legacy addresses dominate through the early years, P2SH grows steadily from around 2015, native segwit takes over from 2017-2018 onward, and Taproot appears after late 2021.

## How Iknaio uses address types

Pathfinder stores the address type of every input and output. The most direct use is in **change address detection**: one of our change heuristics checks whether an output uses the same address type as the inputs. Wallets typically send change back using the same format they already use. If all inputs start with `3` and one output also starts with `3` while the other starts with `bc1q`, that mismatch is a signal pointing to the `3`-output as change.

## Looking ahead

As Taproot adoption continues to grow, more transactions will look structurally identical on-chain regardless of the spending conditions behind them. That is good for user privacy, but it means investigators will increasingly need to rely on other signals beyond address type alone. The mix of old and new formats in a single transaction will remain informative for a long time, though, since the Bitcoin ecosystem moves slowly and legacy addresses will stay in circulation for years to come. Understanding what each format tells is a small investment that pays off in every investigation.

