/* ============================================================
   DATA — EDIT HERE to manage your work history.
   Each entry shows only role + company + date on the page; clicking
   "View details" opens a popup with the full description + images.

   To add images / proof (certificates, screenshots) for a role:
     1. Put image files in:  assets/experience/<anything>/
     2. List their paths in the `images: [...]` array below.
   Leave `images: []` for now — the popup shows a clean placeholder.

   NOTE: this file must be loaded BEFORE js/main.js (see index.html).
   ------------------------------------------------------------------ */
var EXPERIENCE = [
  {
    role: "AI Architect",
    org: "DFM Engineering",
    date: "Jan 2026 — Present",
    product: "Agentic AI for 3D CAD Automation",
    tags: ["Agentic AI", "Architecture", "Business Analysis"],
    points: [
      "Gathered business requirements across departments and designed a comprehensive integration architecture unifying multi-platform data flows into a single admin console.",
      "Modeled end-to-end workflows and decomposed technical scope into concrete software requirements — cutting operational time by 40%.",
      "Partnered with PM and domain engineers on test scenarios, UAT, and hands-on technical support through delivery."
    ],
    images: [] // e.g. ["assets/experience/dfm/console.png"]
  },
  {
    role: "Project Manager / AI",
    org: "FPT University",
    date: "Sep 2025 — Dec 2025",
    product: "Agent Programmatic Integration Testing",
    tags: ["Project Management", "Tool-calling", "API"],
    points: [
      "Owned delivery progress and output quality; the single point of contact translating system requirements and status to stakeholders (PM, Dev, QC).",
      "Designed the tool-calling architecture and API integration flow, automating data aggregation and reducing manual-operation errors by 90%."
    ],
    images: []
  },
  {
    role: "AI Team Lead",
    org: "CEH — Vietnam Maritime Port Solutions",
    date: "Jan 2025 — Apr 2025",
    product: "Hazard Detection System",
    tags: ["Computer Vision", "Real-time", "Team Lead"],
    points: [
      "Designed a real-time image/video data-collection pipeline for safety monitoring in complex industrial environments.",
      "Surveyed the site, clarified real-world requirements, configured and trialed the system, and validated input/output accuracy before handover.",
      "Handled technical incidents to keep data collection running reliably under all conditions."
    ],
    images: []
  },
  {
    role: "AI Engineer",
    org: "University of Transport HCMC",
    date: "Apr 2024 — Apr 2025",
    product: "Traffic Sign Recognition with LoRA",
    tags: ["LoRA", "Deep Learning", "Award 🏆"],
    points: [
      "Collected, cleaned, and analyzed large datasets to optimize real-world recognition.",
      "Applied optimization techniques to push model accuracy well above baseline.",
      "🏆 2nd Prize, university-level Scientific Research competition."
    ],
    images: []
  }
];
