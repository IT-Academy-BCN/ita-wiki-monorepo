import type { Liga } from "../../../types/league";
type Props = { standings: Liga[] };
export const StandingsTable = ({ standings }: Props) => (
  <p>StandingsTable — {standings.length} registres carregats</p>
);
