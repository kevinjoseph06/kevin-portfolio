import { Project, Skill, TimelineItem } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'zenith-engine',
    title: 'Zenith Web Algorithmic Studio',
    description: 'An interactive web browser platform for compiling and visualizing advanced data structures, search indexes, and custom sorting networks.',
    category: 'Creative Dev',
    tags: ['React', 'TypeScript', 'Data Structures', 'Performance Design'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    githubUrl: 'https://github.com/kevinjoseph06/zenith-engine',
    liveUrl: 'https://zenith-engine.example.com',
    longDescription: 'Zenith Visualizer represents structural routing and sorting algorithms in an elegant, interactive canvas. It bridges complex system logic with modern presentation by mapping execution steps into beautiful responsive visual queues.',
    features: [
      'Interactive structural visualization of Heap Sort, Quick Sort, and Dijkstra pathfinders',
      'State-driven step animation with customizable tracking speeds and execution stack tracers',
      'Big-O complexity metrics and heap/stack pointers updated in real-time during run execution',
      'Tactile data stream visualizations using premium transitions and high-performance UI components'
    ],
    metrics: [
      { label: 'Complexity', value: 'O(N log N)' },
      { label: 'Sample Payload', value: '1.2k values' },
      { label: 'Performance', value: '60fps Smooth' }
    ]
  },
  {
    id: 'codex-ai',
    title: 'Codex AI Assistant',
    description: 'An intelligent code assistant using server-side Gemini LLMs to analyze code structures and explain compilation diagnostics in real-time.',
    category: 'AI & Web3',
    tags: ['Gemini API', 'Express.js', 'React', 'Syntax parsing'],
    imageUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=800',
    githubUrl: 'https://github.com/kevinjoseph06/codex-orchestrator',
    liveUrl: 'https://codex-ai.example.com',
    longDescription: 'An automated web companion for student developers. Codex AI integrates the Gemini API server-side to help users dissect confusing compiler logs, auto-generate standard unit tests, and trace complex call-stacks.',
    features: [
      'Multi-agent task decomposition to generate structured code breakdowns',
      'Interactive diagnostic logs parser extracting error traces with syntax trees',
      'Isolated browser sandbox simulating light compilation runs securely',
      'Responsive telemetry dashboard highlighting code complexity and token counts'
    ],
    metrics: [
      { label: 'Parser Speed', value: 'Avg 40ms' },
      { label: 'Analysis Time', value: 'Avg 2s' },
      { label: 'Accuracy', value: '98.4%' }
    ]
  },
  {
    id: 'nexus-os',
    title: 'Nexus Student Workspace',
    description: 'An interactive web-based windowing workspace replicating key operating system and file explorer behaviors.',
    category: 'Tools',
    tags: ['React 19', 'Tailwind v4', 'Web Workers', 'Local Storage DB'],
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800',
    githubUrl: 'https://github.com/kevinjoseph06/nexus-spatial-os',
    liveUrl: 'https://nexus-os.example.com',
    longDescription: 'Nexus is an experimental web dashboard replicating classic operating system structures (virtual file records, concurrent processes) inside a responsive layout. Built to explore web worker threads and persistent state sync.',
    features: [
      'Multi-threaded system simulations executing tasks via separate browser Web Workers',
      'Custom directories explorer with local storage synchronization for student notes',
      'In-browser workspace custom key shortcuts and interactive drag-and-drop windows',
      'Performance tracking displays showing active threads and memory allocations'
    ],
    metrics: [
      { label: 'Thread Count', value: '4 Workers' },
      { label: 'Buffer Rate', value: '0.12s' },
      { label: 'Process Cap', value: 'Unlimited' }
    ]
  },
  {
    id: 'hyperion-ledger',
    title: 'Hyperion Database Board',
    description: 'A real-time database query visualizer mapping schema indices, execution plans, and transaction chains with interactive nodes.',
    category: 'Full-Stack',
    tags: ['Node.js', 'PostgreSQL', 'D3.js', 'Recharts'],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
    githubUrl: 'https://github.com/kevinjoseph06/hyperion-ledger',
    liveUrl: 'https://hyperion.example.com',
    longDescription: 'An interactive analytical dashboard designed to visualize relational database explain plans, lock hierarchies, and network topologies, helping student developers optimize query index speeds.',
    features: [
      'Visual execution maps resolving Nested Loop, Sequential, and Index scans',
      'Dynamic physics-based force layouts demonstrating relational schema connectors and nodes',
      'Custom sandbox SQL buffer simulating table statistics overlays and index impacts',
      'Responsive historical query load indicators rendered via interactive Recharts'
    ],
    metrics: [
      { label: 'Parse latency', value: '< 2ms' },
      { label: 'Node Latency', value: '< 5ms' },
      { label: 'Sim Volume', value: '15k /sec' }
    ]
  }
];

export const SKILLS: Skill[] = [
  // Frontend
  { name: 'React 19 / Vite', category: 'Frontend', level: 'Expert', ratingValue: 95, color: '#06b6d4' },
  { name: 'TypeScript', category: 'Frontend', level: 'Expert', ratingValue: 92, color: '#3178c6' },
  { name: 'Tailwind CSS v4', category: 'Frontend', level: 'Expert', ratingValue: 94, color: '#38bdf8' },
  { name: 'CSS Layouts & UX', category: 'Frontend', level: 'Expert', ratingValue: 90, color: '#f97316' },
  // Backend
  { name: 'Node.js / Express', category: 'Backend', level: 'Expert', ratingValue: 90, color: '#22c55e' },
  { name: 'SQL / PostgreSQL', category: 'Backend', level: 'Advanced', ratingValue: 86, color: '#334155' },
  { name: 'REST & GraphQL APIs', category: 'Backend', level: 'Advanced', ratingValue: 88, color: '#a855f7' },

  // DevOps/Tools
  { name: 'Git & GitHub Workflows', category: 'DevOps/Tools', level: 'Expert', ratingValue: 92, color: '#ffb618' },
  { name: 'Docker / Sandboxing', category: 'DevOps/Tools', level: 'Intermediate', ratingValue: 75, color: '#2563eb' },
  { name: 'CI/CD & Cloud Deployment', category: 'DevOps/Tools', level: 'Advanced', ratingValue: 82, color: '#14b8a6' }
];

export const TIMELINE: TimelineItem[] = [
  {
    id: 'exp-3',
    period: '2025 - Present',
    title: 'Freelance Web Developer',
    organization: 'Digital Space Labs',
    role: 'Building bespoke full-stack applications & layout models',
    bullets: [
      'Formulated and customized lightweight single-page applications and dashboards for small-to-medium business sites.',
      'Crafted high-fidelity custom CSS templates, implementing lightweight interactive sliders and scroll-triggers to optimize fluid loading behaviors on legacy mobile devices.',
      'Configured local and persistent database state-saving handlers via standard browser cookies and local client vectors.'
    ],
    description: 'Produced lightweight custom templates, clean branding sites, and custom data visualizers directly to clients wishing to establish modern online presences.',
    type: 'experience',
    status: 'Active',
    tags: [
      { label: 'Next.js', dotColor: 'bg-cyan-400' },
      { label: 'Tailwind CSS', dotColor: 'bg-cyan-400' },
      { label: 'TypeScript', dotColor: 'bg-cyan-400' },
      { label: 'Framer Motion' },
      { label: 'Data Visualization' }
    ],
    deliverables: {
      type: 'metrics',
      metrics: [
        { icon: 'globe', value: '12+', label: 'Websites' },
        { icon: 'sliders', value: '20+', label: 'Projects' },
        { icon: 'users', value: '15+', label: 'Clients' },
        { icon: 'chart', value: '99%', label: 'Satisfaction' }
      ]
    }
  },
  {
    id: 'edu-1',
    period: '2025 - 2029',
    title: 'B.Tech in Computer Science & Engineering',
    organization: 'Vellore Institute of Technology (VIT), India',
    role: 'Core focus on DBMS, Software Architecture, and Graph Algorithms',
    bullets: [
      'Maintained excellent academic standing across core subjects including Data Structures & Algorithms, Object-Oriented Software Design, Operating Systems, and DBMS.',
      'Active developer lead inside the campus Open Source community, building high-contrast registration tools and interactive landing resources.'
    ],
    description: 'Acquiring theoretical computer engineering foundations alongside hands-on full-stack engineering skills, linking relational systems and modular browser design.',
    type: 'education',
    status: 'In Progress',
    deliverables: {
      type: 'tags',
      tags: [
        { label: 'Data Structures', dotColor: 'bg-purple-500' },
        { label: 'DBMS', dotColor: 'bg-purple-500' },
        { label: 'Algorithms', dotColor: 'bg-purple-500' },
        { label: 'Software Architecture', dotColor: 'bg-purple-500' }
      ]
    }
  }
];
