import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const variants = {
  success: {
    bg: 'bg-success-600/20 border-success-600/50',
    icon: CheckCircle,
    iconColor: 'text-success-400',
  },
  error: {
    bg: 'bg-danger-600/20 border-danger-600/50',
    icon: XCircle,
    iconColor: 'text-danger-400',
  },
  warning: {
    bg: 'bg-warning-500/20 border-warning-500/50',
    icon: AlertTriangle,
    iconColor: 'text-warning-400',
  },
  info: {
    bg: 'bg-space-600/20 border-space-600/50',
    icon: Info,
    iconColor: 'text-space-400',
  },
};

export const Alert = ({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
}) => {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border
        ${config.bg}
        ${className}
      `}
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium text-white mb-1">{title}</p>}
        <div className="text-sm text-space-200">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-space-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  const config = variants[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl
              ${config.bg}
            `}
          >
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
            <span className="text-white">{message}</span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-space-400 hover:text-white transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
