import { forwardRef } from 'react';

export const Card = forwardRef(
  (
    {
      children,
      hover = false,
      glow = false,
      glowColor = 'space',
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const glowStyles = {
      space: 'shadow-space-500/20',
      danger: 'shadow-danger-500/30',
      success: 'shadow-success-500/20',
      warning: 'shadow-warning-500/20',
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`
          bg-dark-card border border-dark-border rounded-xl p-6
          transition-all duration-300 ease-out
          ${hover ? 'cursor-pointer hover:border-space-600/50 hover:shadow-xl hover:-translate-y-1' : ''}
          ${glow ? `shadow-lg ${glowStyles[glowColor]}` : ''}
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-start justify-between mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-white ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-dark-border ${className}`}>
    {children}
  </div>
);
