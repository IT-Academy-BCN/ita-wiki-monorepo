interface LeagueNotificationModalProps {
  direction: "up" | "down";
  leagueName: string;
  onDismiss: () => void;
}

export const LeagueNotificationModal = ({
  direction,
  leagueName,
  onDismiss,
}: LeagueNotificationModalProps) => {
  const isUp = direction === "up";

  const title = isUp ? "Felicitats!" : "Atenció";

  const icon = isUp ? "🎉" : "📉";
  const message = isUp
    ? "El teu esforç ha donat fruits! Has pujat a la lliga "
    : "Aquesta setmana no ha estat la millor. Has baixat a la lliga ";

  const content = (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="text-4xl">{icon}</div>
      <p className="text-gray-700 text-lg">
        {message}
        <strong className="text-black font-bold">{leagueName}</strong>.
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[90%] sm:w-[50%] md:w-[35%] min-h-[35%] relative">
        <div className="flex flex-col justify-center items-center w-full mt-10">
          <h2 className="text-[1.7rem] text-black font-extrabold mb-10">
            {title}
          </h2>
          {content}
          <div className="mt-8 flex justify-center w-full">
            <button
              onClick={onDismiss}
              className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors w-full sm:w-auto cursor-pointer"
            >
              D'acord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
