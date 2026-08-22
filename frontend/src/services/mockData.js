/**
 * Complete Domain Intelligence & Investigation Scenarios
 * Tools integrated:
 * 1. Web Search API
 * 2. Research/Paper API
 *
 * Capabilities:
 * - Dynamic Tool Selection
 * - Tool Reasoning
 * - Sequential Tool Calling
 * - Evidence Sufficiency Check
 * - Contradiction-Triggered Re-search
 */

export const EXAMPLE_PROMPTS = [
  {
    id: "nvidia-cv",
    title: "NVIDIA Vision & On-Device Architecture",
    prompt: "Monitor NVIDIA's recent AI research and identify threats to our computer vision product.",
    domain: "Computer Vision & Accelerators",
  },
  {
    id: "agent-trends",
    title: "AI Agent Frameworks & Multi-Tool Autonomy",
    prompt: "Find recent research trends in AI agents and identify potential opportunities.",
    domain: "Autonomous Agents & LLM Systems",
  },
  {
    id: "apple-qualcomm",
    title: "Apple ML vs. Qualcomm On-Device Silicon",
    prompt: "Compare recent research activity between Apple ML Research and Qualcomm AI.",
    domain: "Edge Silicon & Quantization",
  },
  {
    id: "solid-state",
    title: "Solid-State Battery Breakthroughs",
    prompt: "Track solid-state battery electrolyte breakthroughs and patent disputes by QuantumScape and CATL.",
    domain: "Energy Storage & Clean Tech",
  },
];

export const RESEARCH_PRESETS = [
  {
    id: "preset-edge-ai",
    title: "Multimodal Edge Vision & On-Device AI Architecture",
    objective: "Track recent developments in low-latency multimodal vision-language models for edge silicon and identify competitor patent filings and architectural threats.",
    domain: "Artificial Intelligence & Edge Compute",
    competitors: ["Qualcomm AI", "Apple ML Research", "Google DeepMind", "Meta Reality Labs", "Tenstorrent"],
    sources: ["Web Search API (Tech & Filings)", "Research/Paper API (ArXiv cs.CV, cs.LG)"],
    timeframe: "Last 30 Days",
  },
  {
    id: "preset-solid-state",
    title: "Solid-State Battery Chemistry & Silicon Anodes",
    objective: "Monitor patent disputes, solid-state electrolyte breakthroughs, and competitor manufacturing scale-up milestones by CATL, QuantumScape, and Toyota.",
    domain: "Energy Storage & Clean Tech",
    competitors: ["QuantumScape", "CATL", "Toyota R&D", "Solid Power", "BYD Central Research"],
    sources: ["Web Search API (Trade & SEC)", "Research/Paper API (Electrochimica & Nature)"],
    timeframe: "Last 60 Days",
  },
  {
    id: "preset-post-quantum",
    title: "Post-Quantum Cryptography & Lattice Hardware",
    objective: "Detect emerging lattice-based post-quantum cryptographic accelerator designs, standardization compliance, and competitor proprietary hardware implementations.",
    domain: "Cybersecurity & Quantum Computing",
    competitors: ["IBM Quantum", "SandboxAQ", "PQShield", "Intel Labs", "QuSecure"],
    sources: ["Web Search API (NIST & News)", "Research/Paper API (IACR & IEEE)"],
    timeframe: "Last 90 Days",
  },
  {
    id: "preset-ai-pharma",
    title: "AI-Driven Molecular Conformation & Oncology Therapeutics",
    objective: "Identify competitor biopharma pipelines leveraging diffusion-based de novo protein binders and allosteric small-molecule candidate patents.",
    domain: "Biotechnology & Computational Drug Discovery",
    competitors: ["Recursion Pharma", "Isomorphic Labs", "Insilico Medicine", "Relay Therapeutics", "Schrodinger"],
    sources: ["Web Search API (Clinical Trials)", "Research/Paper API (bioRxiv / ChemRxiv)"],
    timeframe: "Last 30 Days",
  }
];

export const MOCK_TOOL_ACTIVITIES = [
  {
    id: "tool-1",
    tool: "Web Search API",
    status: "Completed",
    purpose: "Current competitor filings and industry releases",
    query: "NVIDIA OR Apple ML on-device vision transformer patent filing 2026",
    sourcesFound: 6,
    durationMs: 420,
    timestamp: "13:38:02",
  },
  {
    id: "tool-2",
    tool: "Research/Paper API",
    status: "Completed",
    purpose: "Verify academic peer-reviewed claims and benchmarks",
    query: "arxiv:cs.CV '1-bit vision transformer' OR 'unified neural memory'",
    papersFound: 4,
    durationMs: 680,
    timestamp: "13:38:05",
  },
  {
    id: "tool-3",
    tool: "Web Search API",
    status: "Re-search Triggered",
    reason: "Contradictory evidence detected between marketing claim (60 FPS) and independent benchmark (18 FPS)",
    query: "MLCommons benchmark 'Tenstorrent Wormhole' continuous context throughput",
    sourcesFound: 3,
    durationMs: 510,
    timestamp: "13:38:08",
  },
  {
    id: "tool-4",
    tool: "Research/Paper API",
    status: "Completed",
    purpose: "Cross-corroborate shared KV-cache speculative decoding performance bounds",
    query: "arxiv:cs.LG 'shared KV' speculative decoding latency speedup",
    papersFound: 3,
    durationMs: 590,
    timestamp: "13:38:11",
  },
];

export const MOCK_SAFE_AGENT_ACTIVITIES = [
  {
    id: "act-1",
    status: "completed",
    text: "Understanding research objective and extracting entity vectors...",
    detail: "Identified target organizations, key technologies, and intelligence horizon.",
    timestamp: "13:38:01",
  },
  {
    id: "act-2",
    status: "completed",
    text: "Creating autonomous investigation plan...",
    detail: "Determined query vectors across Web Search and Research/Paper APIs.",
    timestamp: "13:38:02",
  },
  {
    id: "act-3",
    status: "completed",
    text: "Selecting Web Search API for current competitor disclosures...",
    detail: "Gathered 6 external news items and official patent grants.",
    timestamp: "13:38:04",
  },
  {
    id: "act-4",
    status: "completed",
    text: "Checking evidence sufficiency...",
    detail: "Preliminary web signals require peer-reviewed academic validation.",
    timestamp: "13:38:06",
  },
  {
    id: "act-5",
    status: "completed",
    text: "Selecting Research/Paper API to verify research preprints...",
    detail: "Retrieved 4 ArXiv papers covering 1-bit quantization and speculative decoding.",
    timestamp: "13:38:08",
  },
  {
    id: "act-6",
    status: "warning",
    text: "Contradiction detected in performance claims; performing verification search...",
    detail: "Marketing release claims 60 FPS while independent benchmarks report 18.4 FPS under continuous load.",
    timestamp: "13:38:10",
  },
  {
    id: "act-7",
    status: "completed",
    text: "Cross-checking corroboration across 4 independent sources...",
    detail: "Evidence strength evaluated as STRONGLY SUPPORTED for core architectural shift.",
    timestamp: "13:38:12",
  },
  {
    id: "act-8",
    status: "completed",
    text: "Intelligence Brief synthesized: WHAT → WHY → SO WHAT ready.",
    detail: "Formulated strategic actions, opportunity-threat classifications, and audit ledger.",
    timestamp: "13:38:14",
  },
];

export const PRIMARY_INTELLIGENCE_BRIEF = {
  id: "brief-001",
  title: "Competitor Patented 1-Bit Weight Kernel & Shared-KV Speculative Standard Emerged",
  priority: "HIGH",
  classification: "THREAT & OPPORTUNITY",
  evidenceStrength: "STRONGLY SUPPORTED",
  confidenceCategory: "High Confidence",
  confidenceScore: 0.93,
  sourcesCount: 5,
  papersCount: 3,
  webCount: 2,
  crossSourceAgreement: "92% Agreement across ArXiv & USPTO",
  contradictionStatus: "Reconciled (Disputed marketing claim isolated)",
  
  what: "Apple ML Research published patent US20260189921A detailing a 1-bit quantization kernel on unified neural memory at 0.82W, while 4 independent research labs converged on shared KV-cache speculative decoding achieving 3.1x latency speedups.",
  why: "The 1-bit kernel bypasses conventional DRAM memory bandwidth bottlenecks, allowing models to operate at 4.2x faster token generation. Concurrently, shared KV-cache speculative decoding is rendering older independent draft-model architectures obsolete.",
  soWhat: "Audit our Q3 on-device roadmap against Apple's patent claims immediately to avoid IP infringement. Adopt shared-KV low-rank speculative draft heads into our core inference engine before competitor SDKs freeze in October.",
  
  recommendedAction: "1. File provisional counter-patent on asynchronous lookup table caching. 2. Implement shared-KV speculative decoding in v2.4 release.",
  
  contradiction: {
    detected: true,
    title: "Tenstorrent 60 FPS Marketing Claim vs MLCommons Benchmark at 18.4 FPS",
    claim: "Competitor marketing collateral claims continuous 60 FPS video token processing on Wormhole cards.",
    sourceA: {
      name: "Tenstorrent Product Press Release",
      type: "Web Source (Vendor Marketing)",
      snippet: "Delivering continuous 60 FPS dense video segmentation and multi-turn reasoning on dual Wormhole PCIe cards.",
      url: "https://tenstorrent.com/news/wormhole-multimodal-60fps",
      verification: "Partially Supported (Omits full 2K context load)"
    },
    sourceB: {
      name: "MLCommons Inference Issue #1492",
      type: "Research Benchmark (Independent)",
      snippet: "Independent reproduction reveals throughput collapses to 18.4 FPS when continuous bidirectional visual attention exceeds 2,048 tokens.",
      url: "https://github.com/mlcommons/inference/issues/1492",
      verification: "Empirically Verified"
    },
    agentAction: "Contradiction-triggered re-search executed via Web Search API. Confirmed marketing benchmark omitted continuous context attention penalty.",
    finalStatus: "Resolved: Verified benchmark throughput is 18.4 FPS under sustained real-world load."
  },

  evidenceItems: [
    {
      id: "ev-1",
      title: "Ultra-Low Power Matrix Vector Processing on Unified Neural Architecture",
      sourceType: "Research Paper / Patent",
      publisher: "USPTO (US20260189921A)",
      publishedDate: "2026-08-19",
      url: "https://patents.google.com/patent/US20260189921A1/en",
      summary: "Patents specialized 1.58-bit quantized weights evaluated asynchronously directly inside unified neural memory buffers at 0.82W dynamic power.",
      relevance: "Critical",
      verificationStatus: "Supported by Patent Grant"
    },
    {
      id: "ev-2",
      title: "Hardware-Aware 1-Bit Vision Transformers for Embedded Silicon",
      sourceType: "Research Paper",
      publisher: "ArXiv cs.CV (ArXiv:2608.09812)",
      publishedDate: "2026-08-15",
      url: "https://arxiv.org/abs/2608.09812",
      summary: "Empirical proof of 88.4% top-1 accuracy on ImageNet utilizing 420mW dynamic package power on M4 silicon.",
      relevance: "High",
      verificationStatus: "Corroborated by Peer Review"
    },
    {
      id: "ev-3",
      title: "Shared-State Speculation for Edge Multimodal Processing",
      sourceType: "Research Paper",
      publisher: "ArXiv cs.LG (ArXiv:2608.11024)",
      publishedDate: "2026-08-18",
      url: "https://arxiv.org/abs/2608.11024",
      summary: "Draft model shares 75% of parent transformer KV attention keys, cutting DRAM memory overhead by 68% and boosting latency 3.1x.",
      relevance: "High",
      verificationStatus: "Corroborated across 4 Labs"
    },
    {
      id: "ev-4",
      title: "The Battle for On-Device Vision Tokens & Silicon Roadmaps",
      sourceType: "Web Source",
      publisher: "SemiAnalysis",
      publishedDate: "2026-08-20",
      url: "https://semianalysis.com/apple-1bit-edge-silicon",
      summary: "Industry analysis confirming OEM tape-out and sampling of dedicated 1-bit NPU silicon.",
      relevance: "Medium",
      verificationStatus: "Supported by Supply Chain"
    },
    {
      id: "ev-5",
      title: "Wormhole Context Saturation Benchmark Reproducibility Report",
      sourceType: "Web Source / Code Benchmark",
      publisher: "MLCommons GitHub",
      publishedDate: "2026-08-20",
      url: "https://github.com/mlcommons/inference/issues/1492",
      summary: "Identifies 18.4 FPS actual ceiling under continuous visual context saturation.",
      relevance: "High",
      verificationStatus: "Empirically Verified"
    }
  ]
};

export const INITIAL_INTELLIGENCE_ITEMS = [
  {
    id: "intel-101",
    title: "Competitor Patented 1-Bit Weight Activation Kernel for Sub-1W Vision-Language Inference",
    priority: "CRITICAL",
    category: "THREAT",
    competitor: "Apple ML Research",
    timestamp: "2026-08-21T14:30:00Z",
    confidence: "High",
    confidenceScore: 0.94,
    verificationState: "NEEDS_REVIEW",
    verificationReason: "Patent filing directly overlaps with our internal Q3 EdgeLLM roadmap, but contradicting claims exist regarding memory bandwidth requirements.",
    what: "Apple ML Research published patent US20260189921A detailing a specialized ternary/1-bit quantization kernel operating directly on unified neural memory at 0.82 Watts.",
    why: "This breakthrough bypasses conventional memory bandwidth bottlenecks on mobile chips, achieving 4.2x faster token-generation than our current edge deployment benchmark.",
    soWhat: "Evaluate patent claim breadth with legal counsel immediately. Shift our Q4 acceleration sprint toward asynchronous lookup-table caching to preserve latency superiority.",
    evidenceCount: 4,
    sourcesCount: 3,
    sources: [
      {
        id: "src-1",
        title: "US Patent App US20260189921A: Ultra-Low Power Matrix Vector Processing on Unified Neural Architecture",
        type: "Patent",
        publisher: "USPTO",
        date: "2026-08-19",
        url: "https://patents.google.com/patent/US20260189921A1/en",
        snippet: "A computational pipeline comprising 1.58-bit quantized weights processed via asynchronous memory buffers without intermediate decompression.",
        selectionRationale: "Matches core target vector for on-device edge model inference acceleration."
      },
      {
        id: "src-2",
        title: "ArXiv:2608.09812: Hardware-Aware 1-Bit Vision Transformers for Embedded Silicon",
        type: "Research Paper",
        publisher: "ArXiv cs.CV",
        date: "2026-08-15",
        url: "https://arxiv.org/abs/2608.09812",
        snippet: "Demonstrated 88.4% top-1 accuracy on ImageNet-1k utilizing only 420mW dynamic package power on M4 silicon.",
        selectionRationale: "Independent peer verification of Apple research author group."
      },
      {
        id: "src-3",
        title: "SemiAnalysis Deep Dive: The Battle for On-Device Vision Tokens",
        type: "Industry Analysis",
        publisher: "SemiAnalysis",
        date: "2026-08-20",
        url: "https://semianalysis.com/apple-1bit-edge-silicon",
        snippet: "Commercial sampling of dedicated NPU silicon expected ahead of developer conference.",
        selectionRationale: "Third-party market validation and manufacturing roadmap correlation."
      }
    ],
    crossCheckStatus: "2 Patents + 1 ArXiv Paper confirm architecture. Discrepancy on thermal throttle threshold.",
    impact: "High competitive pressure on consumer edge devices.",
    recommendedAction: "Audit patent claims 1-14 against our pending filing PCT/US2026/0491."
  },
  {
    id: "intel-102",
    title: "Emerging Weak Signal: Low-Rank Speculative Decoding Adopted Across 4 Isolated Research Labs",
    priority: "HIGH",
    category: "TREND",
    competitor: "Multiple (Qualcomm, Tenstorrent, Meta)",
    timestamp: "2026-08-22T08:15:00Z",
    confidence: "High",
    confidenceScore: 0.91,
    verificationState: "VERIFIED",
    verifiedBy: "Senior Principal Researcher",
    verifiedAt: "2026-08-22T09:45:00Z",
    what: "Four non-affiliated research publications within 12 days converged on utilizing low-rank draft models with shared KV-cache states for 3.1x speculative decoding speedups.",
    why: "Indicates an industry-wide inflection point where traditional multi-model speculative decoding is being abandoned due to DRAM memory transfer overheads.",
    soWhat: "Integrate shared-KV low-rank draft heads into our open-source release to establish market leadership before competitor SDKs freeze in October.",
    evidenceCount: 5,
    sourcesCount: 4,
    sources: [
      {
        id: "src-4",
        title: "ArXiv:2608.11024: Shared-State Speculation for Edge Multimodal Processing",
        type: "Research Paper",
        publisher: "ArXiv cs.LG",
        date: "2026-08-18",
        url: "https://arxiv.org/abs/2608.11024",
        snippet: "Draft model shares 75% of parent transformer KV attention keys, cutting memory overhead by 68%.",
        selectionRationale: "Direct mathematical proof of latency reduction."
      },
      {
        id: "src-5",
        title: "Qualcomm AI Research Technical Note: Speculative Inference on Snapdragon NPU",
        type: "Tech Report",
        publisher: "Qualcomm Developer Network",
        date: "2026-08-16",
        url: "https://developer.qualcomm.com/docs/ai-speculative-decoding",
        snippet: "Hardware support for low-rank speculative tokens confirmed in upcoming firmware.",
        selectionRationale: "Confirms tier-1 silicon vendor commitment."
      }
    ],
    crossCheckStatus: "4 independent ArXiv preprints corroborate mathematical bounds.",
    impact: "Industry transition to shared-KV speculative architectures.",
    recommendedAction: "Refactor speculative decoding pipeline to implement shared KV projection layers."
  },
  {
    id: "intel-103",
    title: "Contradiction Flagged: Tenstorrent Claims 60 FPS Video Reasoning vs Independent Benchmark at 18 FPS",
    priority: "HIGH",
    category: "CONTRADICTION",
    competitor: "Tenstorrent",
    timestamp: "2026-08-21T22:10:00Z",
    confidence: "Medium",
    confidenceScore: 0.72,
    verificationState: "NEEDS_REVIEW",
    verificationReason: "Marketing claims contradict independent reproducibility metrics on GitHub test harness.",
    what: "Tenstorrent press release asserts real-time 60 FPS multimodal video token parsing on their Wormhole PCIe cards, while MLPerf Community benchmarks demonstrate only 18.4 FPS under continuous context loads.",
    why: "The discrepancy originates from omitting bidirectional visual attention layers during marketing benchmark passes.",
    soWhat: "Publish our transparent, verified benchmark suite showing continuous context performance. Position our engine as the only sustained real-time solution.",
    evidenceCount: 3,
    sourcesCount: 2,
    sources: [
      {
        id: "src-6",
        title: "Tenstorrent Press Release: Breakthrough Real-Time Multimodal Video Intelligence",
        type: "Press Release",
        publisher: "Tenstorrent Newsroom",
        date: "2026-08-18",
        url: "https://tenstorrent.com/news/wormhole-multimodal-60fps",
        snippet: "Delivering continuous 60fps dense video segmentation and multi-turn conversational reasoning on dual Wormhole cards.",
        selectionRationale: "Official competitor product performance claim."
      },
      {
        id: "src-7",
        title: "MLCommons Discussion #1492: Wormhole Context Saturation Benchmark Reproducibility",
        type: "Technical Discussion",
        publisher: "GitHub / MLCommons",
        date: "2026-08-20",
        url: "https://github.com/mlcommons/inference/issues/1492",
        snippet: "Independent reproduction reveals throughput degrades to 18.4 FPS once context length exceeds 2,048 visual tokens.",
        selectionRationale: "Empirical developer verification testing."
      }
    ],
    crossCheckStatus: "Conflict unresolved. Marketing claim does not hold under full attention saturation.",
    impact: "Potential marketing vulnerability for competitor.",
    recommendedAction: "Publish reproducible 4K context benchmark paper demonstrating our stable 45 FPS pipeline."
  },
  {
    id: "intel-104",
    title: "Research Gap & Opportunity: Zero Competitor Patents in On-Device Optical Flow Fusion for Spatial Audio",
    priority: "MEDIUM",
    category: "RESEARCH GAP",
    competitor: "Market Opportunity (White Space)",
    timestamp: "2026-08-22T04:20:00Z",
    confidence: "High",
    confidenceScore: 0.89,
    verificationState: "VERIFIED",
    verifiedBy: "Strategy Lead",
    verifiedAt: "2026-08-22T07:10:00Z",
    what: "Cross-source patent landscape search across USPTO, EPO, and CNIPA shows less than 3 total filings combining event-camera optical flow with binaural spatial audio embeddings.",
    why: "Competitors are preoccupied with pure vision LLMs, leaving a massive commercial gap for wearable AR glasses where thermal and audio budgets are severely constrained.",
    soWhat: "File a provisional patent covering lightweight event-camera optical flow audio spatialization and build a live demo for upcoming partner summit.",
    evidenceCount: 4,
    sourcesCount: 3,
    sources: [
      {
        id: "src-8",
        title: "WIPO Patent Landscape: Event-Camera Multimodal Fusion (2024-2026)",
        type: "Patent Search Report",
        publisher: "WIPO IP Analytics",
        date: "2026-08-10",
        url: "https://patentscope.wipo.int/search/en/result.jsf",
        snippet: "Only 2 provisional applications detected in classification G06V20/20 regarding neuromorphic optical audio fusion.",
        selectionRationale: "Authoritative patent classification density audit."
      },
      {
        id: "src-9",
        title: "IEEE Transactions on Multimedia: Neuromorphic Vision for Next-Gen Wearables",
        type: "Journal Article",
        publisher: "IEEE",
        date: "2026-07-28",
        url: "https://ieeexplore.ieee.org/document/1059942",
        snippet: "Identifies sensor fusion as open frontier with unresolved power budget constraints.",
        selectionRationale: "Academic validation of unexplored white space."
      }
    ],
    crossCheckStatus: "Verified against 3 major patent registries (USPTO, EPO, CNIPA).",
    impact: "Uncontested intellectual property opportunity in AR/VR wearables.",
    recommendedAction: "Draft provisional patent application around temporal event-audio alignment matrix."
  },
  {
    id: "intel-105",
    title: "Competitor Move: Google DeepMind Open-Sources Sliced Spatial Attention Framework",
    priority: "MEDIUM",
    category: "COMPETITOR MOVE",
    competitor: "Google DeepMind",
    timestamp: "2026-08-21T19:00:00Z",
    confidence: "High",
    confidenceScore: 0.96,
    verificationState: "VERIFIED",
    verifiedBy: "Lead ML Architect",
    verifiedAt: "2026-08-21T20:30:00Z",
    what: "Google DeepMind released the 'SpatialSlice' library on GitHub with Apache 2.0 licensing, enabling high-resolution 4K image tiling without positional encoding distortion.",
    why: "Commoditizes high-resolution image pre-processing and removes a former proprietary moat held by specialized medical imaging startups.",
    soWhat: "Adopt SpatialSlice into our data ingestion pipeline immediately to eliminate 200 hours of internal engineering maintenance.",
    evidenceCount: 3,
    sourcesCount: 2,
    sources: [
      {
        id: "src-10",
        title: "GitHub Repository: google-deepmind/spatial-slice",
        type: "Code Release",
        publisher: "GitHub",
        date: "2026-08-21",
        url: "https://github.com/google-deepmind/spatial-slice",
        snippet: "Apache-2.0 implementation of adaptive spatial tiling and positional embedding preservation for vision transformers.",
        selectionRationale: "Direct repository release and license confirmation."
      }
    ],
    crossCheckStatus: "Direct verified GitHub release with passing test coverage.",
    impact: "Reduces proprietary edge in standard tile processing, elevates importance of custom quantization.",
    recommendedAction: "Deprecate internal tile slicer and merge Apache 2.0 SpatialSlice modules into pipeline."
  }
];

export const CONTRADICTION_ITEMS = [
  {
    id: "contra-201",
    title: "Tenstorrent Real-Time Video Frame Throughput vs Independent Benchmark",
    status: "REQUIRES_HUMAN_AUDIT",
    urgency: "HIGH",
    detectedAt: "2026-08-21T22:10:00Z",
    conflictDescription: "Competitor published marketing collateral claiming 60 FPS continuous reasoning. Community benchmarks report performance collapses to 18.4 FPS under standard 2K context loads.",
    sourceA: {
      name: "Tenstorrent Newsroom & Product Spec Sheet",
      type: "Vendor Publication",
      date: "2026-08-18",
      claim: "Wormhole Dual-Card PCIe achieves continuous 60 FPS multimodal video token ingestion with zero latency degradation.",
      url: "https://tenstorrent.com/news/wormhole-multimodal-60fps",
      credibility: "Vendor Marketing (Potential Bias)",
      confidenceScore: 0.65
    },
    sourceB: {
      name: "MLCommons & Independent Benchmark Harness (v4.1)",
      type: "Empirical Reproduction",
      date: "2026-08-20",
      claim: "Hardware achieves max 18.4 FPS when full bidirectional visual attention matrix is retained over 2,048 context tokens.",
      url: "https://github.com/mlcommons/inference/issues/1492",
      credibility: "Independent Developer Reproduction",
      confidenceScore: 0.92
    },
    reconciliationRecommendation: "Accept Source B empirical benchmark as grounded reality. Leverage the marketing delta in our upcoming technical whitepaper.",
    verificationState: "NEEDS_REVIEW"
  },
  {
    id: "contra-202",
    title: "Solid-State Dendrite Suppression Claims: QuantumScape vs Academic Peer Review",
    status: "REQUIRES_HUMAN_AUDIT",
    urgency: "CRITICAL",
    detectedAt: "2026-08-20T16:45:00Z",
    conflictDescription: "QuantumScape patent claims zero dendrite formation across 1,000 cycles at 4C fast charge. Independent university replication noted micro-shorting at 3.2C under sub-zero temperatures.",
    sourceA: {
      name: "QuantumScape US Patent Grant US11942810B2",
      type: "Patent Grant",
      date: "2026-08-01",
      claim: "Ceramic separator prevents lithium dendrite penetration across >1000 fast-charge cycles at 25°C.",
      url: "https://patents.google.com/patent/US11942810B2/en",
      credibility: "Granted Patent Claims",
      confidenceScore: 0.88
    },
    sourceB: {
      name: "Journal of Power Sources Peer Review Preprint",
      type: "Academic Review",
      date: "2026-08-14",
      claim: "Separator exhibits micro-fractures and localized impedance spikes when tested below 0°C at 3C charging rates.",
      url: "https://doi.org/10.1016/j.jpowsour.2026.2341",
      credibility: "Independent Academic Lab",
      confidenceScore: 0.89
    },
    reconciliationRecommendation: "Dendrite suppression holds at room temperature (25°C), but thermal envelope under 0°C remains an unaddressed failure mode.",
    verificationState: "NEEDS_REVIEW"
  }
];

export const EMERGING_SIGNALS = [
  {
    id: "sig-301",
    title: "Hardware-Aware Shared KV-Cache Low-Rank Speculative Decoding",
    signalStrength: "RAPIDLY GROWING",
    strengthScore: 88,
    detectionDate: "2026-08-22",
    velocity: "+140% weekly citation frequency",
    observations: {
      researchPapers: 4,
      patents: 2,
      industryArticles: 2,
      codeRepositories: 3
    },
    whyItMatters: "Repeated independent activity across Qualcomm, Meta AI, and Stanford indicates an architectural shift that renders traditional speculative decoding engines obsolete within 6 months.",
    strategicPlaybook: "Port our attention kernels to support low-rank key-value projection sharing. Benchmark on edge NPUs before competitor launch.",
    clusterTags: ["Speculative Decoding", "KV Cache", "Edge NPU", "Latency Optimization"]
  },
  {
    id: "sig-302",
    title: "Post-Training Ternary Weight Quantization Without Re-training Loss",
    signalStrength: "EARLY EMERGENCE",
    strengthScore: 68,
    detectionDate: "2026-08-21",
    velocity: "+65% weekly mention volume",
    observations: {
      researchPapers: 3,
      patents: 1,
      industryArticles: 1,
      codeRepositories: 2
    },
    whyItMatters: "Enables converting 8B parameter models into 1.6GB payloads runnable entirely inside smartphone SRAM without thermal throttling.",
    strategicPlaybook: "Initiate pilot evaluation on our internal 7B model weights to verify perplexity preservation.",
    clusterTags: ["Ternary Quantization", "SRAM Execution", "Weight Compression", "On-Device LLM"]
  },
  {
    id: "sig-303",
    title: "Neuromorphic Event-Vision Multimodal Alignment",
    signalStrength: "WEAK REPEATED SIGNAL",
    strengthScore: 52,
    detectionDate: "2026-08-19",
    velocity: "+35% weekly discovery frequency",
    observations: {
      researchPapers: 2,
      patents: 1,
      industryArticles: 0,
      codeRepositories: 1
    },
    whyItMatters: "Signals early exploration of micro-second temporal resolution sensors for robotic surgery and high-speed drone navigation.",
    strategicPlaybook: "Monitor incoming ArXiv preprints in cs.RO and cs.CV for early silicon tape-out confirmations.",
    clusterTags: ["Neuromorphic", "Event Cameras", "Robotics Vision", "Temporal Alignment"]
  }
];

export const RESEARCH_GAPS = [
  {
    id: "gap-401",
    title: "Zero-Latency Optical Flow & Spatial Audio Fusion for Wearable AR",
    commercialPotential: "VERY HIGH",
    gapScore: 92,
    researchDensity: "LOW (2 Papers in 2026)",
    patentDensity: "VERY LOW (1 WIPO Filing)",
    competitorActivity: "MODERATE (Apple & Meta in adjacent domains)",
    opportunityDescription: "While visual LLMs and spatial audio have matured independently, combining continuous low-power neuromorphic optical flow with binaural head-tracking is completely uncontested in patent filings.",
    suggestedAction: "File provisional patent on 'Continuous Temporal Frame-Free Audio Spatialization' and develop reference SDK.",
    timeWindow: "Estimated 90-120 days before competitor IP filings saturate category."
  },
  {
    id: "gap-402",
    title: "Privacy-Preserving On-Device Synthetic Medical Image Augmentation",
    commercialPotential: "HIGH",
    gapScore: 84,
    researchDensity: "MODERATE (8 Papers)",
    patentDensity: "LOW (3 Patents)",
    competitorActivity: "LOW (Competitors focused on cloud EHR APIs)",
    opportunityDescription: "Hospitals refuse cloud uploading of MRI/CT scans. An on-premise local diffusion pipeline that augments rare pathology training sets without outbound telemetry has severe enterprise demand.",
    suggestedAction: "Package local containerized diffusion pipeline for hospital PACS integration pilots.",
    timeWindow: "6-8 months before major MedTech vendors roll out native PACS plugins."
  }
];

export const COMPETITORS_DATA = [
  {
    id: "comp-apple",
    name: "Apple ML Research",
    tagline: "Consumer Hardware & On-Device Neural Engines",
    threatLevel: "CRITICAL",
    focusAreas: ["Unified Memory NPU", "1-Bit Quantization", "Spatial Audio", "CoreML 5"],
    recentActivityCount: 14,
    patentsCount: 8,
    papersCount: 6,
    timeline: [
      {
        id: "ev-1",
        date: "2026-08-19",
        type: "Patent Filing",
        title: "US20260189921A: 1-Bit Weight Activation Kernel on Unified Memory",
        impact: "Direct overlap with our low-latency edge roadmap.",
        badge: "CRITICAL THREAT"
      },
      {
        id: "ev-2",
        date: "2026-08-15",
        type: "Research Paper",
        title: "ArXiv:2608.09812: 88.4% Top-1 Accuracy on 420mW Mobile Silicon",
        impact: "Validated power envelope benchmark on M4 chips.",
        badge: "BENCHMARK"
      },
      {
        id: "ev-3",
        date: "2026-08-02",
        type: "Product Release",
        title: "CoreML Edge SDK v5.2 Developer Preview with Speculative Heads",
        impact: "Enables third-party iOS apps to run 4B models locally.",
        badge: "MARKET MOVE"
      }
    ]
  },
  {
    id: "comp-qualcomm",
    name: "Qualcomm AI Research",
    tagline: "Mobile & Automotive Snapdragon Silicon",
    threatLevel: "HIGH",
    focusAreas: ["Hexagon NPU", "Speculative Decoding", "Automotive Vision", "Llama Edge"],
    recentActivityCount: 11,
    patentsCount: 5,
    papersCount: 6,
    timeline: [
      {
        id: "ev-4",
        date: "2026-08-16",
        type: "Technical Report",
        title: "Shared-State Speculative Decoding Architecture on Snapdragon NPU",
        impact: "Establishes OEM hardware acceleration standards for Android devices.",
        badge: "TECH SHIFT"
      },
      {
        id: "ev-5",
        date: "2026-08-08",
        type: "Patent Filing",
        title: "EP4192084A1: Asynchronous Vision-Language Token Slicing on DSP Array",
        impact: "Covers hardware tile dispatching for 4K video feeds.",
        badge: "PATENT FILED"
      }
    ]
  },
  {
    id: "comp-tenstorrent",
    name: "Tenstorrent",
    tagline: "RISC-V High-Performance AI Accelerators",
    threatLevel: "MEDIUM",
    focusAreas: ["RISC-V Ascalon", "Wormhole PCIe", "Open Source TT-Metal", "Video AI"],
    recentActivityCount: 8,
    patentsCount: 3,
    papersCount: 5,
    timeline: [
      {
        id: "ev-6",
        date: "2026-08-18",
        type: "Press Announcement",
        title: "Wormhole Multimodal 60 FPS Real-Time Benchmark Announcement",
        impact: "Disputed by independent MLCommons testers (observed 18.4 FPS under 2K context).",
        badge: "CONTRADICTION"
      },
      {
        id: "ev-7",
        date: "2026-07-29",
        type: "Open Source Code",
        title: "TT-Metalium v0.54 Kernel Compiler Release for Vision Models",
        impact: "Lowers friction for running open models on RISC-V cards.",
        badge: "OPEN SOURCE"
      }
    ]
  },
  {
    id: "comp-deepmind",
    name: "Google DeepMind",
    tagline: "Frontier Foundation Models & Algorithmic Discovery",
    threatLevel: "HIGH",
    focusAreas: ["Gemini Vision", "SpatialSlice", "TPU v6e", "AlphaFold 3"],
    recentActivityCount: 19,
    patentsCount: 9,
    papersCount: 10,
    timeline: [
      {
        id: "ev-8",
        date: "2026-08-21",
        type: "Open Source Code",
        title: "SpatialSlice: High-Resolution Tiling without Positional Distortion",
        impact: "Commoditizes image pre-processing pipelines with Apache 2.0 license.",
        badge: "OPPORTUNITY"
      },
      {
        id: "ev-9",
        date: "2026-08-11",
        type: "Research Paper",
        title: "ArXiv:2608.06411: Continuous Video Latent Stream Reasoning",
        impact: "Theoretical architecture for zero-delay stream monitoring.",
        badge: "FRONTIER PAPER"
      }
    ]
  }
];

export const EVIDENCE_GRAPH_DATA = {
  nodes: [
    {
      id: "node-apple",
      label: "Apple ML Research",
      type: "competitor",
      group: "Competitor",
      confidence: 0.98,
      details: "Tier-1 consumer hardware manufacturer actively patenting 1-bit neural kernels.",
      x: 220,
      y: 180,
    },
    {
      id: "node-pat-apple",
      label: "Patent US20260189921A",
      type: "patent",
      group: "Patent",
      confidence: 0.95,
      details: "1-Bit Matrix-Vector Processing on Unified Neural Architecture at 0.82 Watts.",
      x: 420,
      y: 120,
    },
    {
      id: "node-paper-1bit",
      label: "ArXiv:2608.09812 (1-Bit ViT)",
      type: "research",
      group: "Research Paper",
      confidence: 0.93,
      details: "Hardware-Aware 1-Bit Vision Transformers demonstrating 88.4% top-1 ImageNet.",
      x: 460,
      y: 280,
    },
    {
      id: "node-tech-quant",
      label: "Ternary / 1-Bit Weight Activation",
      type: "technology",
      group: "Technology",
      confidence: 0.96,
      details: "Architecture level quantization bypassing memory bandwidth wall.",
      x: 640,
      y: 190,
    },
    {
      id: "node-intel-threat",
      label: "Threat: EdgeLLM Overlap",
      type: "insight",
      group: "Intelligence",
      priority: "CRITICAL",
      confidence: 0.94,
      details: "Direct competitive threat to our Q3 on-device inference speed superiority.",
      x: 820,
      y: 140,
    },
    {
      id: "node-qualcomm",
      label: "Qualcomm AI Research",
      type: "competitor",
      group: "Competitor",
      confidence: 0.95,
      details: "Leading mobile SoC silicon designer integrating low-rank speculative heads.",
      x: 240,
      y: 420,
    },
    {
      id: "node-paper-spec",
      label: "ArXiv:2608.11024 (Shared-KV)",
      type: "research",
      group: "Research Paper",
      confidence: 0.91,
      details: "Shared-State Speculation for Edge Multimodal Processing.",
      x: 450,
      y: 450,
    },
    {
      id: "node-tech-spec",
      label: "Shared-KV Speculative Decoding",
      type: "technology",
      group: "Technology",
      confidence: 0.92,
      details: "Low-rank draft head utilizing existing attention keys to avoid DRAM fetch.",
      x: 670,
      y: 400,
    },
    {
      id: "node-intel-signal",
      label: "Trend: 3.1x Speculation Standard",
      type: "insight",
      group: "Intelligence",
      priority: "HIGH",
      confidence: 0.91,
      details: "Cross-industry migration from independent draft models to shared KV heads.",
      x: 850,
      y: 360,
    },
    {
      id: "node-gap-ar",
      label: "Research Gap: Event-Audio Fusion",
      type: "opportunity",
      group: "White Space",
      priority: "HIGH",
      confidence: 0.89,
      details: "Uncontested IP whitespace in event-camera optical flow spatial audio for AR.",
      x: 740,
      y: 560,
    },
    {
      id: "node-tenstorrent",
      label: "Tenstorrent Wormhole",
      type: "product",
      group: "Product",
      confidence: 0.72,
      details: "RISC-V accelerator card with disputed 60 FPS marketing claim.",
      x: 310,
      y: 600,
    },
    {
      id: "node-contra-fps",
      label: "Contradiction: 60 FPS vs 18 FPS",
      type: "contradiction",
      group: "Contradiction",
      priority: "HIGH",
      confidence: 0.72,
      details: "Marketing claim contradicts empirical MLCommons continuous context test.",
      x: 540,
      y: 630,
    }
  ],
  edges: [
    { source: "node-apple", target: "node-pat-apple", label: "filed_patent", type: "filing" },
    { source: "node-apple", target: "node-paper-1bit", label: "published", type: "publication" },
    { source: "node-pat-apple", target: "node-tech-quant", label: "protects_method", type: "protection" },
    { source: "node-paper-1bit", target: "node-tech-quant", label: "validates", type: "evidence" },
    { source: "node-tech-quant", target: "node-intel-threat", label: "triggers_alert", type: "intelligence" },
    
    { source: "node-qualcomm", target: "node-paper-spec", label: "co_authored", type: "publication" },
    { source: "node-paper-spec", target: "node-tech-spec", label: "proves_speedup", type: "evidence" },
    { source: "node-tech-spec", target: "node-intel-signal", label: "converges_into", type: "intelligence" },
    
    { source: "node-tenstorrent", target: "node-contra-fps", label: "marketing_claim", type: "claim" },
    { source: "node-paper-spec", target: "node-gap-ar", label: "exposes_unexplored_gap", type: "gap" },
    { source: "node-tech-quant", target: "node-tech-spec", label: "orthogonal_to", type: "relation" }
  ]
};
