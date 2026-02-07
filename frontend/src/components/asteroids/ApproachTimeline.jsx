import { formatDate, formatDistance, formatVelocity } from '../../utils/formatters';

export const ApproachTimeline = ({ approaches }) => {
  if (!approaches || approaches.length === 0) {
    return (
      <div className="text-center py-8 text-space-400">
        No close approach data available
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const getTimelineStatus = (approachDate) => {
    const date = approachDate.split('T')[0];
    if (date < today) return 'past';
    if (date === today) return 'today';
    return 'future';
  };

  const statusStyles = {
    past: 'bg-space-700 border-space-600',
    today: 'bg-danger-600 border-danger-500 animate-pulse',
    future: 'bg-space-600 border-space-500',
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-space-600 via-space-500 to-space-700" />

      <div className="space-y-6">
        {approaches.map((approach, index) => {
          const status = getTimelineStatus(approach.approach_date);
          return (
            <div key={approach.id || index} className="relative flex items-start gap-4 pl-10">
              <div
                className={`absolute left-2 w-4 h-4 rounded-full border-2 ${statusStyles[status]}`}
              />

              <div className="flex-1 bg-dark-card border border-dark-border rounded-lg p-4 hover:border-space-600/50 transition-colors">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                  <span className={`text-sm font-semibold ${status === 'today' ? 'text-danger-400' : 'text-white'}`}>
                    {formatDate(approach.approach_date)}
                    {status === 'today' && ' (TODAY!)'}
                  </span>
                  {approach.orbiting_body && (
                    <span className="text-xs px-2 py-0.5 bg-space-800 text-space-400 rounded">
                      {approach.orbiting_body}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-space-500 text-xs">Miss Distance</p>
                    <p className="text-space-200">{formatDistance(approach.miss_distance_km)}</p>
                  </div>
                  <div>
                    <p className="text-space-500 text-xs">Velocity</p>
                    <p className="text-space-200">{formatVelocity(approach.velocity_kmh)}</p>
                  </div>
                  {approach.miss_distance_lunar && (
                    <div>
                      <p className="text-space-500 text-xs">Lunar Distance</p>
                      <p className="text-space-200">{approach.miss_distance_lunar.toFixed(2)} LD</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
