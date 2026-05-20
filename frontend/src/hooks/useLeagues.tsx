import { useEffect, useState } from "react";
import { LigaResponse } from "../types/league";

export const useGlobalRanking = () => {
    const [leagues, setLeagues] = useState<LigaResponse>([]);
    const mockLeagues = {
        "1": [{ "position": 1, "user_id": 7, "username": "ckoelpin", "points_weekly": 99, "league_id": 1 }],
        "2": [{ "position": 1, "user_id": 3, "username": "mentor_test", "points_weekly": 48, "league_id": 2 }],
        "3": [{ "position": 1, "user_id": 2, "username": "admin_test", "points_weekly": 24, "league_id": 3 },
        { "position": 2, "user_id": 1, "username": "superadmin_test", "points_weekly": 9, "league_id": 3 }]
    }

    useEffect(() => setLeagues(mockLeagues), []);

    return { leagues }
}