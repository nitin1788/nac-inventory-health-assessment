---
title: "How WhatsApp Enquiries Actually Get Tracked as Conversions"
slug: "whatsapp-conversion-tracking-pharmacy"
description: "Neither Google Ads nor Meta natively tracks a WhatsApp conversation as a conversion. Here's how it's actually done, and why it matters for knowing which of your pharmacy's marketing is working."
date: "2026-09-06"
author: "Nitin Anand Consulting"
category: "Digital Marketing"
tags: ["pharmacy", "whatsapp", "analytics", "conversion tracking"]
primaryKeyword: "whatsapp conversion tracking"
secondaryKeywords: ["track whatsapp enquiries google ads", "whatsapp conversion tracking meta ads"]
featuredImage: "/blog-images/whatsapp-conversion-tracking-pharmacy/featured.webp"
imageAlt: "Branded cover graphic for How WhatsApp Enquiries Actually Get Tracked as Conversions"
---

If [WhatsApp](/blog/whatsapp-for-pharmacies-india) is where a good share of your actual customer enquiries happen, you'd expect your analytics to show that clearly. The inconvenient truth is that neither Google nor Meta tracks a WhatsApp conversation as a conversion out of the box — which means a store running ads without this set up correctly is probably crediting the wrong channel for a lot of its results, or missing that WhatsApp is working at all.

## 1. The gap that catches most setups out

Google Ads has recently started rolling out a "conversation started" conversion action for WhatsApp message assets in ads — but it's a beta feature, not available to every advertiser yet, and it only confirms that a conversation started, not what happened in it. For most pharmacies without access to that beta, there's still no reliable built-in way to connect an ad click to a WhatsApp conversation happening outside Google's own systems — you can track a click on a WhatsApp link as a conversion, but a click isn't the same as someone actually starting a conversation, and plenty of clicks go nowhere. Meta is a little further along: its Click-to-WhatsApp ad format can track when someone starts a chat directly from an ad. But that only covers people who click straight from the ad into WhatsApp — if someone browses your website first and messages you from a general WhatsApp button there, that connection back to the original ad is usually lost.

## 2. How it's actually done

A common, reliable way to close this gap is a small piece of technical setup using Google Tag Manager: a trigger fires whenever someone clicks a link pointing to `wa.me` or `web.whatsapp.com`, and that trigger is wired to a conversion tag for Google Ads or Meta. From that point on, a WhatsApp click gets counted the same way a form submission or a phone call would. For higher-accuracy setups, this can be taken a step further — capturing a unique click identifier when someone arrives from an ad, then matching it back up if that same person later messages you on WhatsApp — but the tag-based approach above is enough for most pharmacies to start seeing real numbers instead of a blind spot.

## 3. Why this is worth getting right, not just "nice to have"

Without this, a pharmacy running Google Ads or Meta Ads is making budget decisions on incomplete information — a campaign that looks like it's underperforming on paper might actually be quietly generating a steady stream of WhatsApp enquiries that simply aren't being counted anywhere. Fixing the tracking doesn't change what's happening; it just lets you see it, which is the whole point of running [Analytics & Conversion Tracking](/services/digital-marketing/analytics-conversion-tracking) in the first place.

## 4. What your website needs for this to even be possible

None of the above works if there's nothing to track in the first place. Your website needs a clearly visible, clickable WhatsApp link or button — not just a phone number listed in text — so that clicking it is the specific, trackable action the setup above can actually detect.

## 5. One more thing this doesn't cover

Tracking that someone messaged you is separate from how you handle the personal data — phone numbers, message history — that comes with it. See [Cookie Consent & DPDPA](/blog/cookie-consent-dpdpa-pharmacy-analytics-ads) for what that side of it requires.

---

If your current analytics setup can't tell you whether WhatsApp is actually working, [get in touch](/contact) and we'll fix the tracking as part of [Analytics & Conversion Tracking](/services/digital-marketing/analytics-conversion-tracking) for your store.
