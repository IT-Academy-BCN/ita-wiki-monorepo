import type { Liga } from "../../types/league";
type Props = { rankings: Liga[] };
export const RankingsTable = ({ rankings }: Props) => (
  <p>RankingsTable — {rankings.length} registres carregats</p>
);
