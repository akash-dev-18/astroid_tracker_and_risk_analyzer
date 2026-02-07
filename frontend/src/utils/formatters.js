import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return 'Invalid Date';
  return format(date, 'MMM d, yyyy');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return 'Invalid Date';
  return format(date, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return 'Invalid Date';
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return 'N/A';
  if (typeof num !== 'number') num = parseFloat(num);
  if (isNaN(num)) return 'N/A';
  
  if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(decimals) + 'B';
  } else if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M';
  } else if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K';
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
};

export const formatDistance = (km) => {
  if (km === null || km === undefined) return 'N/A';
  const lunar = km / 384400;
  
  if (lunar < 10) {
    return `${lunar.toFixed(2)} LD`;
  } else if (km >= 1e6) {
    return `${(km / 1e6).toFixed(2)}M km`;
  }
  return `${formatNumber(km)} km`;
};

export const formatVelocity = (kmh) => {
  if (kmh === null || kmh === undefined) return 'N/A';
  return `${formatNumber(kmh, 0)} km/h`;
};

export const formatDiameter = (minKm, maxKm) => {
  if (minKm === null && maxKm === null) return 'N/A';
  
  const formatDim = (val) => {
    if (val === null || val === undefined) return '?';
    if (val < 1) return `${(val * 1000).toFixed(0)}m`;
    return `${val.toFixed(2)} km`;
  };
  
  return `${formatDim(minKm)} - ${formatDim(maxKm)}`;
};

export const getRiskInfo = (riskScore) => {
  if (!riskScore) {
    return { level: 'UNKNOWN', color: 'bg-gray-600', textColor: 'text-gray-400' };
  }
  
  const score = typeof riskScore === 'string' ? riskScore.toUpperCase() : riskScore;
  
  const riskMap = {
    'EXTREME': { level: 'EXTREME', color: 'bg-danger-600', textColor: 'text-danger-400', glow: true },
    'HIGH': { level: 'HIGH', color: 'bg-danger-500', textColor: 'text-danger-400', glow: true },
    'MODERATE': { level: 'MODERATE', color: 'bg-warning-500', textColor: 'text-warning-400', glow: false },
    'LOW': { level: 'LOW', color: 'bg-success-500', textColor: 'text-success-400', glow: false },
  };
  
  return riskMap[score] || { level: score, color: 'bg-gray-600', textColor: 'text-gray-400', glow: false };
};
