const CodeConnectCardSkeleton = () => {
  return (
    <div
      data-testid="skeleton-card"
      className="flex flex-col border scale-95 sm:scale-100 border-gray-300 items-center w-70 sm:w-76 xl:w-82 px-6 rounded-3xl py-7 pb-10 animate-pulse"
    >
      <div className="w-full">
        <div className="h-6 w-3/4 bg-gray-300 rounded" />
      </div>

      <div className="w-full mt-6">
        <div className="h-6 w-16 bg-gray-300 rounded mb-4" />

        <div className="flex w-full items-center gap-4 mb-4">
          <div className="h-4 w-16 bg-gray-300 rounded" />
          <div className="w-7 h-7 bg-gray-300 rounded" />
        </div>
        <div className="w-full grid grid-cols-3 gap-2 justify-items-start mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="h-3 w-10 bg-gray-300 rounded mt-1" />
            </div>
          ))}
        </div>

        <div className="flex w-full items-center gap-4 mb-4">
          <div className="h-4 w-16 bg-gray-300 rounded" />
          <div className="w-7 h-7 bg-gray-300 rounded" />
        </div>
        <div className="w-full grid grid-cols-3 gap-2 justify-items-start">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="h-3 w-10 bg-gray-300 rounded mt-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-10">
        <div className="h-6 w-40 bg-gray-300 rounded mb-4" />
        <div className="flex justify-between mb-1">
          <div className="h-3 w-14 bg-gray-300 rounded" />
          <div className="h-3 w-14 bg-gray-300 rounded" />
        </div>
        <div className="h-2 w-full bg-gray-300 rounded-full" />
      </div>

      <div className="w-full mt-10">
        <div className="h-6 w-20 bg-gray-300 rounded mb-4" />
        <div className="h-4 w-32 bg-gray-300 rounded" />
      </div>

      <div className="w-full">
        <div className="my-5 w-full h-10 bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
};

export default CodeConnectCardSkeleton;
