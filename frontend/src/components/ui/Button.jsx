import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-space-600 hover:bg-space-700 text-white shadow-lg shadow-space-600/25',
  danger: 'bg-danger-600 hover:bg-danger-700 text-white shadow-lg shadow-danger-600/25',
  success: 'bg-success-600 hover:bg-success-700 text-white shadow-lg shadow-success-600/25',
  warning: 'bg-warning-500 hover:bg-warning-600 text-black',
  outline: 'border-2 border-space-500 text-space-400 hover:bg-space-500/10',
  ghost: 'text-space-300 hover:bg-space-800/50 hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon: Icon,
      iconPosition = 'left',
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-lg
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-space-500 focus:ring-offset-2 focus:ring-offset-dark-bg
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          active:scale-95
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
        {children}
        {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
      </button>
    );
  }
);

Button.displayName = 'Button';
