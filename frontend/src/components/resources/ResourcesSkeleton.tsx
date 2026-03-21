const ResourceCardSkeleton = () => {
  return (
    <div
      data-testid="resource-card-skeleton"
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 max-w-sm animate-pulse"
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="w-7 h-7 rounded bg-gray-200" />
          <div className="w-6 h-6 rounded bg-gray-200" />
        </div>
        <div className="h-6 w-4/5 mt-2 rounded bg-gray-200" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-20 rounded-full border border-gray-200 bg-gray-100" />
          <div className="h-7 w-24 rounded-full border border-gray-200 bg-gray-100" />
          <div className="h-7 w-16 rounded-full border border-gray-200 bg-gray-100" />
        </div>

        <div className="flex items-center gap-4 mt-1">
          <div className="h-5 w-16 rounded bg-gray-200" />

          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gray-200" />
            <div className="h-4 w-8 rounded bg-gray-200" />
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-5 h-5 rounded-full bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCardSkeleton;
