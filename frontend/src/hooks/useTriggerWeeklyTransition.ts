import { useState } from "react";

type UseTriggerWeeklyTransition = {
  triggerWeeklyTransition: () => Promise<void>;
};

type UseTriggerWeeklyTransitionReturn = {
  trigger: () => Promise<void>;
  error: string | null;
  isLoading: boolean;
};

export const useTriggerWeeklyTransition = ({
  triggerWeeklyTransition,
}: UseTriggerWeeklyTransition): UseTriggerWeeklyTransitionReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const trigger = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await triggerWeeklyTransition();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { trigger, error, isLoading };
};
