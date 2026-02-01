const CodeConnectCardSkeleton = () => {
  return (
    <div className="flex flex-col border scale-95 sm:scale-100 border-gray-300 items-center w-70 sm:w-76 xl:w-82 px-6 rounded-3xl py-7 pb-10 animate-pulse">
      <div className="w-full">
        <div className="h-6 w-3/4 bg-gray-300 rounded" />
        <div className="h-4 w-24 bg-gray-300 rounded mt-2" />
      </div>

      <div className="flex w-full gap-4 mt-5">
        <div className="flex items-center gap-2">
          <div className="h-4 w-14 bg-gray-300 rounded" />
          <div className="w-7 h-7 bg-gray-300 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-14 bg-gray-300 rounded" />
          <div className="w-7 h-7 bg-gray-300 rounded" />
        </div>
      </div>

      <div className="flex w-full gap-2 mt-4">
        <div className="w-full grid grid-cols-2 gap-4 grid-rows-2 border-r-2 pr-2 border-gray-200">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="h-3 w-10 bg-gray-300 rounded mt-1" />
            </div>
          ))}
        </div>
        <div className="w-full grid grid-cols-2 gap-4 grid-rows-2 pl-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="h-3 w-10 bg-gray-300 rounded mt-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-10">
        <div className="h-4 w-20 bg-gray-300 rounded mb-2" />
      </div>

      <div className="w-full max-w-md mt-2">
        <div className="flex justify-between mb-1">
          <div className="h-3 w-14 bg-gray-300 rounded" />
          <div className="h-3 w-14 bg-gray-300 rounded" />
        </div>
        <div className="h-2 w-full bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};

export default CodeConnectCardSkeleton;
