const ResourceCardSkeleton = () => {
    return (
        <div  data-testid="resource-card-skeleton" className="flex flex-col w-full p-6 ring ring-gray-900/5 rounded-2xl shadow-md bg-gray-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-pulse">
                <div className="flex flex-col sm:flex-row gap-1">
                <div className="flex flex-col flex-1 gap-1 mt-2 sm:mt-0">
                    <div className="h-6 w-90 max-w-full rounded bg-gray-300" />
                    <div className="h-3 w-80 max-w-full mt-2 rounded bg-gray-300" />
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                    <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-gray-300" />
                        <span className="h-3 w-16 rounded bg-gray-300" />
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-gray-300" />
                        <span className="h-3 w-5 rounded bg-gray-300" />
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-gray-300" />
                        <span className="h-3 w-24 rounded bg-gray-300" />
                    </div>
                    </div>
                </div>
                </div>
                <div className="flex items-center gap-4 justify-start sm:justify-center w-20 h-20 mt-2 sm:mt-0">
                <div className="w-8 h-8 rounded bg-gray-300" />
                <div className="w-8 h-8 rounded bg-gray-300" />
                </div>
            </div>
        </div>
    )
}

export default ResourceCardSkeleton;
