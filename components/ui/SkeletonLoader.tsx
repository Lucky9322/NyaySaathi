// Skeleton loading components — light mode
export function SkeletonLine({ width = 'w-full', height = 'h-3' }: { width?: string; height?: string }) {
  return <div className={`skeleton ${width} ${height}`} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-lg p-4 space-y-3 ${className}`}
      style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <SkeletonLine width="w-2/3" height="h-3.5" />
      <SkeletonLine width="w-full" height="h-2.5" />
      <SkeletonLine width="w-4/5" height="h-2.5" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div
      className="rounded-lg p-4 space-y-2"
      style={{ background: '#ffffff', border: '1px solid #e8eaed' }}
    >
      <SkeletonLine width="w-1/2" height="h-2" />
      <SkeletonLine width="w-3/4" height="h-6" />
      <SkeletonLine width="w-1/3" height="h-2" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="grid lg:grid-cols-[1fr_288px] gap-6 lg:gap-8 animate-pulse">
      {/* Main column */}
      <div className="space-y-8">
        {/* Greeting */}
        <div className="space-y-2">
          <SkeletonLine width="w-32" height="h-2.5" />
          <SkeletonLine width="w-64" height="h-8" />
          <SkeletonLine width="w-96" height="h-3" />
          {/* CTA block */}
          <div
            className="h-16 rounded-lg mt-4"
            style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }}
          />
          <div
            className="h-10 rounded-md"
            style={{ background: '#fefce8', border: '1px solid #fef08a' }}
          />
        </div>
        {/* Quick Actions */}
        <div className="space-y-3">
          <SkeletonLine width="w-28" height="h-2.5" />
          <div className="grid sm:grid-cols-2 gap-3">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
        {/* Recent chats */}
        <div className="space-y-3">
          <SkeletonLine width="w-40" height="h-2.5" />
          {[1,2,3].map(i => (
            <div
              key={i}
              className="h-14 rounded-lg"
              style={{ background: '#ffffff', border: '1px solid #e8eaed' }}
            />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <SkeletonStatCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export default SkeletonDashboard;
