export type LeagueView = 'weekly' | 'global';
type Props = { view: LeagueView; onChange: (v: LeagueView) => void };
const LeagueToggle = (_props: Props) => null;
export default LeagueToggle;
