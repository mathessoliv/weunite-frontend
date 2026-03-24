import type { User } from "./user.types";

export interface Skill {
  id: number;
  name: string;
}

export interface SubscriberDetail {
  id: number;
  athlete: User;
  opportunity: Opportunity;
}

export interface CreateOpportunity {
  title: string;
  description: string;
  location: string;
  dateEnd: Date;
  skills: Skill[];
}

export interface UpdateOpportunity {
  opportunityId: number;
  title?: string;
  description?: string;
  location?: string;
  dateEnd?: Date;
  skills?: Skill[];
}

export interface Opportunity {
  id: number;
  title: string;
  description: string;
  location: string;
  dateEnd: Date;
  skills?: Skill[];
  createdAt: Date;
  updatedAt?: Date;
  company?: User;
  subscribersCount?: number;
}

export interface SavedOpportunity {
  id: number;
  opportunityId: number;
  title: string;
  description: string;
  location: string;
  dateEnd: Date;
  skills?: Skill[];
  savedAt: Date;
  company?: {
    id: number;
    name: string;
    profileImage?: string;
  };
}
