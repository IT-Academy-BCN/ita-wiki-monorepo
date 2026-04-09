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
}

export interface ApiProject {
  id: number;
  title: string;
  time_duration: string;
  language_backend: string;
  language_frontend: string;
  contributors: ApiProjectContributor[];
}

export interface ApiProjectsResponse {
  success: boolean;
  data: ApiProject[];
  message: string;
}

export interface ApiProjectResponse {
  success: boolean;
  data: ApiProject;
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
}
