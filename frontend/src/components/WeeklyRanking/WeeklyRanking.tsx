import { useEffect, useState } from "react";
import { getLeagueRanking } from "../../services/leagueService";
import type { Liga } from "../../types/league";
import { StandingsTable } from "../leagues/StandingsTable";

export const WeeklyRanking = () => {
    const [data, setData] = useState<Liga[]>([]);
    useEffect(() => {
        getLeagueRanking()
            .then(setData)
            .catch(() => { });
    }, []);

    return (
        <section>
            <h1>Lliga setmanal</h1>
            <StandingsTable standings={data} />
        </section>
    )
}