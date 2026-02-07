const variants = {
  hazard: 'bg-danger-600 text-white',
  extreme: 'bg-danger-700 text-white animate-pulse',
  high: 'bg-danger-500 text-white',
  safe: 'bg-success-600 text-white',
  warning: 'bg-warning-500 text-black',
  moderate: 'bg-warning-500 text-black',
  info: 'bg-space-600 text-white',
  low: 'bg-success-500 text-white',
  default: 'bg-space-800 text-space-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}) => {
  const variantKey = variant.toLowerCase();
  const variantClass = variants[variantKey] || variants.default;

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full uppercase tracking-wide
        ${variantClass}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};
