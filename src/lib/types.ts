export interface Project {
  id: number;
  title: string;
  summary: string;
  category: string;
  image_url: string;
  link_url: string;
  sort_order?: number;
  published?: number;
}

export interface PostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  cover_url: string;
  author: string;
  published?: number;
  published_at: string | null;
  read_min: number;
}

export interface Post extends PostSummary {
  content: string;
}

export interface Ranked {
  label: string;
  views: number;
}

export interface Stats {
  days: number;
  series: { day: string; views: number; visitors: number }[];
  totals: { views: number; visitors: number; contacts: number; subscribers: number };
  pages: Ranked[];
  referrers: Ranked[];
  countries: Ranked[];
  devices: Ranked[];
  content: { projects: number; posts: number };
}

export interface Template {
  id: number;
  slug: string;
  name: string;
  business: string;
  kind: "web" | "app";
  summary: string;
  features: string[];
  price_from: number;
  thumb_url: string;
  demo_url: string;
  sort_order?: number;
  published?: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number | null;
}

export type TestimonialStatus = "invited" | "pending" | "approved" | "hidden";

export interface AdminTestimonial extends Testimonial {
  token: string;
  client_label: string;
  status: TestimonialStatus;
  created_at: string;
  submitted_at: string | null;
}
