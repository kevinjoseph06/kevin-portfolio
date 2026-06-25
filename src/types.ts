export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Full-Stack' | 'AI & Web3' | 'Creative Dev' | 'Tools';
  tags: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  longDescription: string;
  features: string[];
  metrics?: { label: string; value: string }[];
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Creative/XR' | 'DevOps/Tools';
  level: string;
  ratingValue: number; // 0 to 100 for visual progress bars
  color: string; // Tailwind bg-coord or border hex
}

export interface TimelineItem {
  id: string;
  period: string;
  title: string;
  organization: string;
  role: string;
  description: string;
  bullets: string[];
  type: 'experience' | 'education' | 'achievement';
  status?: string;
  tags?: { label: string; dotColor?: string }[];
  deliverables?: {
    type: 'metrics' | 'tags';
    metrics?: { icon: string; label: string; value: string }[];
    tags?: { label: string; dotColor?: string }[];
  };
}
