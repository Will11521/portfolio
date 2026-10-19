---
title: "POS ↔ ERP ↔ Marketplace"
kicker: "Systems integration · 2026"
summary: "Wiring a tire distributor's point-of-sale, ERPNext and Walmart storefront together, so orders, stock and tracking stop being retyped by hand."
year: 2026
status: "In production"
kind: "case"
order: 1
stack: ["ERPNext (Frappe)", "Python", "Walmart Marketplace API", "REST", "GTIN/UPC validation"]
---

## The problem

A North American tire distributor was selling through three systems that didn't talk to each other: a point-of-sale in the shop, ERPNext for the books and stock, and a Walmart Marketplace storefront. Orders, stock levels and tracking numbers moved between them by hand. Every retyped field was a chance for a wrong price, an oversold tire or a late shipment, and a catalogue built from supplier lists carried identifiers nobody had checked.

## What I built

- **One source of truth for items.** I run the ERPNext item master, purchasing, sales orders and stock, and I clean supplier lists into it in batches.
- **A catalogue that earns its listings.** GTIN/UPC checks go beyond the check digit: an identifier has to match evidence for the product before it's published, and anything unproven stays flagged for review instead of being guessed.
- **The integration.** Orders, inventory and tracking flow POS ↔ ERP ↔ marketplace, so the same fact is typed once.
- **Automation against the Walmart Marketplace API** for feeds and the reconciliation that used to be manual, with logging and recovery when a feed fails.
- **The numbers behind the price.** Margin, freight and fee analysis that pricing decisions are made from, so a floor price covers what a sale actually costs.

## Result

Orders, stock and tracking no longer get retyped between systems. Listing problems get caught before they're published rather than after a customer finds them, and pricing is set against the full cost of a sale, not the sticker price alone. The work is in daily production.

## Stack

ERPNext (Frappe) · Python · Walmart Marketplace API · REST integrations · GTIN/UPC validation
