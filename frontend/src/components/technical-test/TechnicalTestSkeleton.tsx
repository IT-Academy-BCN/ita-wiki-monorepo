const CardSkeleton = () => {
  return (
    <li
      data-testid="technical-test-card-skeleton"
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 max-w-sm min-h-[347px] animate-pulse"
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="w-7 h-7 rounded bg-gray-200" />
          <div className="w-6 h-6 rounded bg-gray-200" />
        </div>
        <div className="h-6 w-4/5 mt-2 rounded bg-gray-200" />
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />

        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-20 rounded-full border border-gray-200 bg-gray-100" />
          <div className="h-7 w-24 rounded-full border border-gray-200 bg-gray-100" />
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <div className="h-4 w-6 rounded bg-gray-200" />

          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-gray-200" />
            <div className="h-3 w-12 rounded bg-gray-200" />
          </div>

          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-gray-200" />
            <div className="h-3 w-6 rounded bg-gray-200" />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <div className="w-4 h-4 rounded-full bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </li>
  );
};

export default CardSkeleton;
