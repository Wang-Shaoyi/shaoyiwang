// ============================================================
// RESEARCH PROJECTS
// To add a new project:
//   1. Copy _template.html → give it a descriptive name
//   2. Fill in the ✏️ sections
//   3. Add one entry to this array (copy an existing entry)
// Paths are relative to the site root (e.g. assets/images/…)
// ============================================================

const RESEARCH_PROJECTS = [
  {
    id: 'res-1',
    title: 'AI-Assisted UX Research',
    category: 'Research',
    categorySlug: 'research',
    featured: true,
    description: 'Exploring how large language models can accelerate qualitative user research by auto-coding interview transcripts and surfacing themes.',
    tags: ['LLM', 'UX Research', 'Python'],
    image: 'assets/images/place_holder.png',
    page: 'pages/projects/research/ai-ux-research.html',
  },
  {
    id: 'res-2',
    title: 'Embodied Cognition Study',
    category: 'Research',
    categorySlug: 'research',
    featured: false,
    description: 'A mixed-methods study on how physical gesture interfaces affect learning outcomes in children.',
    tags: ['HCI', 'Education', 'Experiment'],
    image: 'assets/images/place_holder.png',
    page: 'pages/projects/research/embodied-cognition.html',
  },
  // ── Add new research projects below ──────────────────────
];
