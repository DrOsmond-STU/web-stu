export type Service = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: string;
  image: string | null;
  features: string[];
  sort_order: number;
  published: boolean;
};

export type Project = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  tech: string[];
  gallery: string[];
  cover_image: string | null;
  client: string | null;
  category: string;
  year: number | null;
  repo_name: string | null;
  repo_url: string | null;
  demo_url: string | null;
  is_private: boolean;
  source: 'manual' | 'github';
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type Testimonial = {
  id: number;
  name: string;
  position: string;
  company: string;
  message: string;
  avatar: string | null;
  rating: number;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  views: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: number;
  name: string;
  position: string;
  photo: string | null;
  bio: string;
  email: string | null;
  linkedin: string | null;
  sort_order: number;
  published: boolean;
};

export type Experience = {
  id: number;
  title: string;
  field: string;
  location: string;
  client: string;
  client_address: string;
  contract_no: string;
  contract_date: string;
  contract_value: string | number;
  year: number | null;
  sort_order: number;
  published: boolean;
};

export type Client = {
  id: number;
  name: string;
  logo: string | null;
  website: string | null;
  sort_order: number;
  published: boolean;
};

export type GalleryItem = {
  id: number;
  title: string;
  caption: string;
  image: string;
  category: string;
  sort_order: number;
  published: boolean;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type MediaItem = {
  id: number;
  url: string;
  filename: string;
  mime: string;
  size: number;
  alt: string;
  created_at: string;
};

export type SettingRow = {
  key: string;
  value: string | null;
  group: string;
  label: string | null;
  type: string;
  hint: string | null;
  sort_order: number;
};

export type SettingsMap = Record<string, string>;
