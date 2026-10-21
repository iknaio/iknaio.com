---
title: "Activity Alerts: Get notified when funds move"
date: 2026-10-29
draft: true
description: "Watch an address in Pathfinder and get notified when it sends or receives funds: in the dashboard right away, and by email instantly or as a daily digest. Activity alerts are in beta."
tags: ["pathfinder", "alerts", "monitoring", "investigation", "product-update"]
image: "images/insights/activity-alerts/cover.png"
posttype: "news"
---

<style>
.content figcaption { font-size: .85rem; color: var(--color-dark-soft); margin-top: 8px; text-align: center; }
/* Two figures side by side at the same height: each grows with its aspect
   ratio (--ar, width / height of its image). Stacked on narrow screens. */
.content .aa-pair { display: flex; gap: 24px; align-items: flex-start; margin: 1.5rem 0; }
.content .aa-pair figure { margin: 0; min-width: 0; flex: var(--ar) 1 0; }
.content .aa-pair img { display: block; width: 100%; height: auto; }
@media (max-width: 599px) {
  .content .aa-pair { flex-direction: column; align-items: center; }
  .content .aa-pair figure { flex: none; max-width: var(--mobile-max, 100%); }
}
</style>

An investigation rarely ends when the trail goes quiet. A perpetrator's wallet
sits still for weeks, then moves the funds within minutes. A ransom address
receives a payment. Funds that waited at a collector address are finally sent
to an exchange, where they can be frozen. Until now, noticing that meant
coming back to Pathfinder and checking the address again, day after day.

**Activity alerts** do the checking for you. Watch an address in Pathfinder,
and Iknaio tells you when it sends or receives funds: in the dashboard as soon
as the transaction is seen, and by email, either right away or once a day.
Activity alerts are available in beta from today.

## Watching an address

Watching starts where you already work: in Pathfinder. Select an address and
click the bell in its details panel, or right-click the address and choose
**Watch this address**.

<div class="aa-pair">
<figure style="--ar: 1.818"><img src="/images/insights/activity-alerts/figure-1-watch.png" alt="The address details panel in Pathfinder with the bell button next to Connect to Case" loading="lazy"><figcaption>Figure 1: The bell in the address panel starts watching an address.</figcaption></figure>
<figure style="--ar: 0.781; --mobile-max: 300px"><img src="/images/insights/activity-alerts/figure-1b-context-menu.png" alt="The right-click menu of an address in Pathfinder with the entry Watch this address" loading="lazy"><figcaption>Figure 2: The same from the right-click menu.</figcaption></figure>
</div>

The alert starts from that moment. Transactions from before you watched are
not replayed: you are notified about what happens next, not about the
address's history.

## Deciding what counts

Not every transaction on an address deserves an email, so watching an address
opens a dialog where you decide what you want to hear about. Take a wallet
from a fraud case where the stolen funds, mostly stablecoins, have been
sitting for weeks. What matters is the moment they move on, and not the small
transfers that keep arriving in the meantime.

The alert name is your own note, shown in the feed and in every email. It is
filled in from the address's attribution tag when there is one, but the tag
only says who controls an address. The name is the place for what it means in
your investigation: the case number, the role of the address, the suspect it
belongs to. It stays with the alert and is not written to the address, so no
one else sees it.

For our wallet, the alert is narrowed down to outgoing transfers, only in USDT
and USDC, and only above 10,000 USD. A minimum can be set in USD or EUR, or in
the coin itself when the alert watches a single currency, and on blockchains
with tokens the alert can cover every transfer or only the tokens you pick.
Transfers with a value of zero are left out unless you ask for them: on
Ethereum-like blockchains they are mostly the contract calls behind token
transfers, which already count as the transfers themselves, and sometimes
address-poisoning spam.

<figure class="figure-center"><img src="/images/insights/activity-alerts/figure-2-dialog.png" alt="The alert dialog: the alert name Case 2026-117: cash-out wallet (suspect A), instant email, USDT and USDC only, outgoing only, above 10,000 USD" loading="lazy" style="max-width: 468px"><figcaption>Figure 3: An alert on a case wallet that reports only outgoing USDT and USDC transfers above 10,000 USD.</figcaption></figure>

Finally, the alert decides how you hear about it: an email right away, a
daily digest, or no email at all, so that the transactions only show up in
the dashboard. All of this can be changed later, and an alert can be paused,
have only its emails paused, or be removed.

## The Alerts page

All watched addresses and their transactions come together on the new
**Alerts** page in the dashboard sidebar. The list on the left shows each
watched address with its name, its blockchain, how many new transactions it
has and whether checking it works. Search and filters help once the list
grows. On the right, the feed lists the transactions, newest first; select an
address to see only its own.

<figure class="figure-center"><img src="/images/insights/activity-alerts/figure-3-alerts.png" alt="The Alerts page: watched addresses on the left, the feed of their transactions on the right" loading="lazy"><figcaption>Figure 4: The Alerts page. Watched addresses on the left, their transactions on the right.</figcaption></figure>

The badge on the sidebar entry counts the addresses with something new, not
the transactions: a burst of five hundred transfers on one address is one
thing to look at. Back in Pathfinder, a watched address with new
transactions shows them in its details panel, with a link to its feed.

Some addresses are busier than others. When an address has more
transactions a day than the feed keeps, the alert says so and suggests a
minimum value or a token filter, so the alert keeps to the transfers that
matter.

<div class="aa-pair">
<figure style="--ar: 0.909"><img src="/images/insights/activity-alerts/figure-5-pathfinder-new.png" alt="The address from Figure 1 in Pathfinder, now watched: its details panel shows the row 1 new transaction" loading="lazy"><figcaption>Figure 5: The address from Figure 1, now watched: its panel shows the new transaction, one click opens the feed.</figcaption></figure>
<figure style="--ar: 1.663; --mobile-max: 380px"><img src="/images/insights/activity-alerts/figure-6-busy.png" alt="The watched-address list with an expanded row: a warning Busy address, about 6,450 transactions a day, the feed keeps the newest 1,000" loading="lazy"><figcaption>Figure 6: The warning on a busy address in the list of watched addresses.</figcaption></figure>
</div>

## Emails

Each alert sends email in one of two rhythms. With *Instant*, an email goes
out as soon as a transaction is seen, but at most one every five minutes:
whatever arrives in between waits and goes out with the next one, so a busy
afternoon fills a few emails, not a hundred. The *Daily digest* collects
everything new into one email a day, sent at midnight in your time zone.

An email lists the most recent transactions per address, with their values,
counterparties and links straight to the address and the transaction in
Pathfinder. When there are more than it can list, it counts them and links to
the feed.

<figure class="figure-center"><img src="/images/insights/activity-alerts/figure-4-email.png" alt="An instant alert email listing four new transactions on three watched addresses" loading="lazy" style="max-width: 560px"><figcaption>Figure 7: An instant email covering four transactions on three addresses.</figcaption></figure>

## Which blockchains

Activity alerts work on all fourteen blockchains in Pathfinder: the core
blockchains Bitcoin, Bitcoin Cash, Litecoin, Zcash, Ethereum and Tron, and
the [eight new blockchains in Lite mode](/insights/pathfinder-lite/), such as
BNB Smart Chain, Arbitrum and Base, for accounts that have them. On
blockchains with tokens, alerts cover the native coin and the tokens Iknaio
supports.

## Limits of the beta

Activity alerts check watched addresses every few minutes against Iknaio's
data, so a transaction appears once Iknaio has processed its block, not the
second it is broadcast. In the beta, each user can watch up to 100 addresses,
and the feed keeps the transactions of the last 90 days, at most the newest
1,000 per address.

Alerts belong to your account: no one else sees which addresses you watch.
When an account is removed, its alerts and their history are removed with it.

## Getting access

Activity alerts are included in the Professional and Institutional plans.
If you are on another plan and would like to try them, [contact us](/contact/).
We look forward to your feedback on the beta.
