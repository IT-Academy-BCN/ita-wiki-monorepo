import { FC, ReactNode, SVGProps } from "react";
import { categories } from "./data/categories";
import { resourceTypes } from "./data/resourceTypes";

export type Category = (typeof categories)[number];
export type ResourceType = (typeof resourceTypes)[number];

export type TypUserRole =
  | "student"
  | "mentor"
  | "admin"
  | "superadmin"
  | "anonymous";

export type TypChildren = {
  children?: ReactNode;
};

export interface IntUser {
  id: number;
  github_user_name: string | null;
  github_id: number;
  name: string;
  email: string;
  password: string;
  role?: TypUserRole;
  photoURL?: string;
}

export interface IntResource {
  id?: number;
  github_id: number;
  title: string;
  description: string;
  url: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  category: Category;
  type: ResourceType;
  like_count?: number;
  bookmark_count?: number;
  comment_count?: number;
  tags?: string[] | Tag[];
}

export interface IntCodeConnect {
  title: string;
  description: string;
  techsFront: string[];
  techsBack: string[];
  ownerRole: string;
  numberDevsFront: number;
  numberDevsBack: number;
  time: number;
  unitTime: string;
  deadline: "" | string;
}

export type TypTechnologyResource =
  | "All"
  | "Node"
  | "React"
  | "Angular"
  | "JavaScript"
  | "Java"
  | "PHP"
  | "Data Science"
  | "BBDD";

export type SortOption = "recent" | "oldest" | "year" | "likes";

export interface Bookmark {
  id: number;
  github_id: number;
  resource_id: number;
  created_at: string;
  updated_at: string;
}
export interface Message {
  message: string;
}

export interface IntBookmarkElement {
  id: number;
  github_id: number;
  title: string;
  description: string;
  url: string;
  created_at: string;
}

export interface Like {
  id: number;
  github_id: number;
  resource_id: number;
  created_at: string;
  updated_at: string;
}

export interface TagsByCategory {
  [category: string]: {
    [tagName: string]: number;
  };
}

export interface TagsIdsByCategory {
  [category: string]: number[];
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export type SvgIcon = FC<SVGProps<SVGSVGElement>>;

export type FormatDocumentCategory =
  | "bold"
  | "italic"
  | "underline"
  | "align-left"
  | "align-center"
  | "ordered-list"
  | "unordered-list";
