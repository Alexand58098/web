export type Category = string;

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Structured text with markdown-like headings, quotes, and takeaways
  coverImage: string;
  category: Category;
  tags: string[];
  author: Author;
  publishedAt: string;
  readTime: number; // in minutes
  views: number;
  likes: number;
  featured?: boolean;
  comments: Comment[];
}

export type ReadingTheme = 'light' | 'sepia' | 'dark';
export type ReadingFontSize = 'sm' | 'md' | 'lg' | 'xl';
export type ReadingFontFamily = 'arabic-modern' | 'arabic-traditional' | 'arabic-sans';

export interface ReadingPreferences {
  theme: ReadingTheme;
  fontSize: ReadingFontSize;
  fontFamily: ReadingFontFamily;
}

export interface AnnouncementBanner {
  enabled: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteSlogan: string;
  siteDescription: string;
  announcement: AnnouncementBanner;
  footerText: string;
  enableComments: boolean;
  enableAudioReader: boolean;
  allowPublicSubmissions?: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export type AdminTab = 'overview' | 'articles' | 'categories' | 'comments' | 'subscribers' | 'settings';

