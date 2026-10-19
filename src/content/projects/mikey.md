---
title: "Mikey, the desk owl"
kicker: "Hardware + AI · 2026"
summary: "A desk pet with a face: an ESP32 robot owl with glowing eyes on a round screen, instant reflexes, and Claude for a brain."
year: 2026
status: "Building"
kind: "case"
order: 2
stack: ["ESP32-S3", "Claude API", "Python CAD (manifold3d, trimesh)", "3D printing", "three.js"]
---

## The problem

"I build things that think" had been my line for a year, and everything behind it lived in a browser tab. I wanted a thinking thing you can put on a desk: one that feels alive in the first second and feels like *someone* after a week.

## What I built

- **A body designed in code.** The owl's shell is a faceted "cut stone" egg with a copper octagon face, a hexagonal brow jewel for the camera and a hexagonal plinth. It's generated in Python with manifold3d, so every part comes out watertight.
- **75 automated design checks** run on every change: board fits, cable clearance, wall thickness, support traps, stability. Each check is proven by planting a fault and watching it fail, because I get one chance to print it right.
- **Reflexes that never wait on the network.** The face board (a round 1.85″ screen with a motion sensor) is designed to blink, follow you, get dizzy when shaken, go soft when petted and fall asleep on its own, all on the board itself.
- **A brain through Claude** (planned) for seeing, talking and remembering across days, with moods that drift over days rather than seconds.
- **Guardrails in code, not in a prompt.** Mikey never looks at a screen, never stores photos, and has a spending budget enforced before every API call. A prompt is a suggestion, not a constraint.

## Result

Body v2 passes 75/75 checks. The boards go on order at the end of October; after that come the first print and the first boot. Meanwhile his little brother lives on this site: click the owl on the dock.

## Stack

ESP32-S3 · Claude API · Python CAD (manifold3d, trimesh) · 3D printing · three.js
