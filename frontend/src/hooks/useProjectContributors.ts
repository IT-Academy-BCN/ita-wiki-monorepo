import { ApiProjectContributor } from "../types/codeConnectTypes";

export const useProjectContributors = (
  contributors: ApiProjectContributor[] = [],
) => {
  const getTeamByRole = (role: string) => {
    const roleMembers = contributors
      .filter((c) =>
        c.programming_role.toLowerCase().includes(role.toLowerCase()),
      )
      .slice(0, 3);

    const members = roleMembers.map((member) => ({
      name: member.name,
      avatar: `https://ui-avatars.com/api/?name=${member.name}&background=b91879&color=fff&rounded=true`,
    }));

    const emptySlots = 3 - members.length;

    return { members, emptySlots };
  };

  return { getTeamByRole };
};
