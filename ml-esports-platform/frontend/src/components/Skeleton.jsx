import React from 'react'

export function Skeleton({ className = '', variant = 'rectangular', ...props }) {
  const baseClass = "bg-white/5 border border-white/5 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
  
  let variantClass = ""
  switch (variant) {
    case 'circular':
      variantClass = "rounded-full"
      break
    case 'text':
      variantClass = "rounded h-4"
      break
    default:
      variantClass = "rounded-2xl"
  }

  return (
    <div className={`${baseClass} ${variantClass} ${className}`} {...props} />
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-16 pb-32 w-full animate-pulse">
      <header className="relative py-20 px-10 rounded-[4rem] overflow-hidden glass border border-white/5">
         <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <Skeleton variant="circular" className="w-32 h-32" />
            <div className="space-y-4 w-full max-w-md">
               <Skeleton variant="text" className="w-3/4 h-12" />
               <div className="flex gap-3">
                  <Skeleton variant="rectangular" className="w-24 h-6 rounded-full" />
                  <Skeleton variant="rectangular" className="w-24 h-6 rounded-full" />
               </div>
            </div>
         </div>
      </header>
      <div className="flex justify-center gap-4">
         <Skeleton variant="rectangular" className="w-32 h-10" />
         <Skeleton variant="rectangular" className="w-32 h-10" />
      </div>
      <div className="grid lg:grid-cols-2 gap-10">
         <Skeleton variant="rectangular" className="h-[400px]" />
         <div className="space-y-6">
            <Skeleton variant="rectangular" className="h-20" />
            <Skeleton variant="rectangular" className="h-20" />
            <Skeleton variant="rectangular" className="h-20" />
         </div>
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 6, height = "h-48" }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" className={`w-full ${height} rounded-[3rem]`} />
      ))}
    </div>
  )
}

export function HeaderSkeleton() {
  return (
    <div className="space-y-8 w-full animate-pulse">
      <Skeleton variant="rectangular" className="w-full h-64 rounded-[4rem]" />
      <div className="flex justify-center gap-4">
         <Skeleton variant="rectangular" className="w-24 h-8" />
         <Skeleton variant="rectangular" className="w-24 h-8" />
         <Skeleton variant="rectangular" className="w-24 h-8" />
      </div>
    </div>
  )
}
