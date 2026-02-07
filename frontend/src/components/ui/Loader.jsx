export const Loader = ({ type = 'spinner', size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  if (type === 'orbit') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className={`relative ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'}`}>
          <div className="absolute inset-0 rounded-full border-2 border-space-600/30" />
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '1.5s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-space-500 rounded-full shadow-lg shadow-space-500/50" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-space-400 to-space-600 rounded-full" />
        </div>
        {text && <p className="text-space-400 text-sm">{text}</p>}
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-space-500 rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`
          ${sizes[size]} border-2 border-space-600 border-t-space-400
          rounded-full animate-spin
        `}
      />
      {text && <p className="text-space-400 text-sm">{text}</p>}
    </div>
  );
};

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded w-3/4',
    circle: 'w-10 h-10 rounded-full',
    card: 'h-48 rounded-xl',
    button: 'h-10 w-24 rounded-lg',
  };

  return (
    <div className={`skeleton bg-dark-hover ${variants[variant]} ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
    <div className="flex justify-between items-start">
      <Skeleton variant="title" />
      <Skeleton className="w-16 h-5" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-full" />
      <Skeleton className="w-3/4" />
      <Skeleton className="w-1/2" />
    </div>
    <div className="flex gap-2 pt-2">
      <Skeleton variant="button" />
      <Skeleton variant="button" />
    </div>
  </div>
);

export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader type="orbit" size="lg" text={text} />
  </div>
);
