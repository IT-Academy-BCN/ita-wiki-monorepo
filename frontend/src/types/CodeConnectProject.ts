export type CodeConnectProject = {
  success: boolean;
  data: CodeConnectProjectData;
  message: string;
};

type CodeConnectProjectData = {
  title: string;
  time_duration: string;
  language_backend: string;
  language_frontend: string;
  contributors: CodeConnectProjectDataContributor[];
};

export type CodeConnectProjectDataContributor = {
  name: string;
  programming_role: string;
};

export type CreateCodeConnectPayload = {
  title: string;
  time_duration: string;
  language_backend: string;
  language_frontend: string;
};
