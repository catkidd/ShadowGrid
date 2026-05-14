const ProductSkeleton = () => {
    return (
        <div className="group relative rounded-2xl overflow-hidden glass-card border border-white/5 bg-charcoal/30">
            {/* Image Skeleton */}
            <div className="relative aspect-square sm:aspect-[4/5] bg-white/5 animate-pulse">
                {/* Optional subtle gradient to make it look nicer */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
            </div>

            {/* Content Skeleton */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-charcoal via-charcoal/90 to-transparent">
                <div className="flex justify-between items-end gap-4">
                    <div className="flex-1 w-full">
                        {/* Brand/Category line */}
                        <div className="h-3 w-1/3 bg-white/10 rounded animate-pulse mb-2" />
                        {/* Title line */}
                        <div className="h-5 sm:h-6 w-3/4 bg-white/20 rounded animate-pulse mb-1" />
                    </div>
                    {/* Price tag */}
                    <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
