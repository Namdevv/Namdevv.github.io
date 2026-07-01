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
    tags: ["Agentic AI", "Multi-agent", "CAD Automation"],
    points: [
      "Designed an agentic AI and multi-agent system for interactive drawing generation across CAD platforms such as FreeCAD, Solid Edge, and SolidWorks.",
      "Owned system ideation and solution design, translating ambiguous engineering challenges into practical architecture, workflows, and implementation directions.",
      "Gathered business and technical requirements across departments, then decomposed them into concrete software requirements and delivery milestones.",
      "Led the project end to end, coordinating with PMs, developers, and domain engineers to ensure output quality, test coverage, UAT readiness, and hands-on technical support through delivery."
    ],
    images: ["assets/experience/dfm/DFM.png"]
  },
  {
    role: "Project Manager / AI",
    org: "FPT University",
    date: "Sep 2025 — Dec 2025",
    product: "Agent Programmatic Integration Testing",
    tags: ["SLM", "Qwen 3B", "LLM Evaluation"],
    points: [
      "Led the project delivery and output quality as the main bridge between PM, Dev, and QC teams, translating requirements into clear technical tasks and validation criteria.",
      "Designed a data extraction and distillation workflow from larger language models to build high-quality training data for a small language model focused on programmatic integration testing.",
      "Trained and refined a Qwen 3B SLM to perform task reasoning, API/tool-use planning, and structured test-generation workflows, reaching roughly 70% of the performance level of commercial LLM baselines.",
      "Applied advanced evaluation methods including LLM-as-a-judge, rubric-based scoring, and comparative model review to measure reasoning quality, output consistency, and practical usability.",
      "Designed the tool-calling architecture and API integration flow, automating data aggregation and reducing manual-operation errors by 90%."
    ],
    images: ["assets/experience/apit/agenttesting.png"]
  },
  {
    role: "AI Team Lead",
    org: "CEH — Vietnam Maritime Port Solutions",
    date: "Jan 2025 — Apr 2025",
    product: "Hazard Detection System",
    tags: ["YOLOv8", "RAG", "Real-time CV"],
    points: [
      "Led the AI team in designing a real-time hazardous-material detection system for container yard safety monitoring and automated container classification.",
      "Built the camera-feed and preprocessing pipeline for live video acquisition, frame normalization, color correction, and reliable image input under industrial conditions.",
      "Applied YOLOv8-based real-time inference to detect hazardous material signs and classify hazard groups such as flammable, corrosive, radioactive, and liquid material categories.",
      "Designed a RAG and LLM-powered classification layer that retrieved safety metadata, contextualized detection results, and supported more accurate hazard-class decisions.",
      "Integrated detection outputs with reporting and yard-operation workflows, including container logs, summary reports, routing suggestions, and database updates for operational follow-up.",
      "Surveyed the site, clarified real-world requirements, configured and trialed the system, validated input/output accuracy, and handled technical incidents through handover."
    ],
    images: ["assets/experience/ceh/CEH.png"]
  },
  {
    role: "AI Engineer",
    org: "University of Transport HCMC",
    date: "Apr 2024 — Apr 2025",
    product: "Traffic Sign Recognition with LoRA",
    tags: ["LoRA", "Stable Diffusion", "Synthetic Data"],
    points: [
      "Collected, cleaned, and analyzed traffic-sign datasets to understand class distribution, image quality, and real-world recognition challenges.",
      "Applied LoRA fine-tuning in Stable Diffusion to generate additional traffic-sign images from prompts, expanding the dataset with diverse road scenes, lighting, weather, angle, distance, and occlusion cases.",
      "Designed prompt strategies to make synthetic images realistic and useful for training, ensuring generated samples matched real-world visual conditions instead of looking purely artificial.",
      "Used the augmented dataset to improve model robustness and recognition accuracy across rare classes and difficult scenarios.",
      "Applied deep-learning optimization techniques to push recognition performance well above the baseline.",
      "🏆 2nd Prize, university-level Scientific Research competition."
    ],
    images: []
  }
];
