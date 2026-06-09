import type { ReactNode } from "react";

export type ProgrammingRole = "Frontend Developer" | "Backend Developer";

export interface ProjectParticipant {
  name: string;
  avatar: string;
}

export interface ProjectSideInfo {
  tech: string;
  logo: string;
  positions: number;
  participants: ProjectParticipant[];
}

export interface Project {
  id: number;
  title: string;
  duration: string;
  frontend: ProjectSideInfo;
  backend: ProjectSideInfo;
  startDate: string;
  endDate: string;
}

export interface ApiProjectContributor {
  name: string;
  programming_role: ProgrammingRole;
  avatar_url: string | null;
}

export interface ApiProjectData {
  id: number;
  user_id: number;
  contributors: ApiProjectContributor[];
  description?: string;
  language_backend: string;
  language_frontend: string;
  roadmap?: { task: string; done: boolean }[];
  time_duration: string;
  title: string;
  status?: "active" | "completed";
}

export interface ApiContributor {
  id: number;
  user_id: number;
  programming_role: string;
  status: "pending" | "accepted" | "rejected";
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ApiProjectsResponse {
  success: boolean;
  data: ApiProjectData[];
  message: string;
}

export interface ApiProjectResponse {
  success: boolean;
  data: ApiProjectData;
  message: string;
}

export interface UseProjectsState {
  projects: Project[];
  isLoading: boolean;
  errorMessage: string | null;
}

export interface CodeConnectError {
  message: string;
  status?: number;
  code?: string;
}

export interface PendingSlot {
  area: "frontend" | "backend";
  index: number;
  role: ProgrammingRole;
}

export interface ProjectCardProps {
  project: Project;
  onClick?: (id: number) => void;
}

export interface TeamRowProps {
  members: ProjectParticipant[];
  emptySlots: number;
  slotIndexOffset?: number;
  onEmptySlotClick?: (slotIndex: number) => void;
}

export interface ProjectTeamProps {
  logoFront?: string;
  logoBack?: string;
  contributors?: ApiProjectContributor[];
  timeDuration?: string;
}

export interface ProgressBarProps {
  title: string;
  startDate: string;
  endDate: string;
}

export interface ProjectButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
}
