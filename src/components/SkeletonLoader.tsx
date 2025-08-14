import React from 'react';

const SkeletonLoader = () => {
    return (
        <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-md animate-pulse w-1/2"></div>
        </div>
    );
};

export default SkeletonLoader;
