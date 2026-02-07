import { useState } from 'react';
import { Filter, X, Calendar, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Select } from '../ui/Input';
import { SORT_OPTIONS } from '../../utils/constants';

export const AsteroidFilters = ({ filters, onFilterChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4">
      <div className="lg:hidden flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          icon={isOpen ? X : Filter}
        >
          {isOpen ? 'Close' : 'Open'}
        </Button>
      </div>

      <AnimatePresence>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          className={`lg:!h-auto lg:!opacity-100 overflow-hidden ${!isOpen ? 'lg:overflow-visible' : ''}`}
        >
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-space-300 mb-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.start_date || ''}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  className="w-full h-10 px-3 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:border-space-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={filters.end_date || ''}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                  className="w-full h-10 px-3 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:border-space-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    handleChange('start_date', today);
                    handleChange('end_date', today);
                  }}
                  className="px-2 py-1 text-xs bg-space-800 text-space-300 rounded hover:bg-space-700 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    handleChange('start_date', today);
                    handleChange('end_date', nextWeek);
                  }}
                  className="px-2 py-1 text-xs bg-space-800 text-space-300 rounded hover:bg-space-700 transition-colors"
                >
                  This Week
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-space-300 mb-2 block">
                Hazard Status
              </label>
              <div className="flex gap-2">
                {[
                  { value: '', label: 'All' },
                  { value: 'true', label: 'Hazardous' },
                  { value: 'false', label: 'Safe' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange('is_hazardous', option.value === '' ? null : option.value === 'true')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      (filters.is_hazardous === null && option.value === '') ||
                      (filters.is_hazardous === true && option.value === 'true') ||
                      (filters.is_hazardous === false && option.value === 'false')
                        ? 'bg-space-600 border-space-500 text-white'
                        : 'bg-dark-bg border-dark-border text-space-400 hover:border-space-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-space-300 mb-2 block">
                Min Diameter (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={filters.min_diameter || ''}
                onChange={(e) => handleChange('min_diameter', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="0.0"
                className="w-full h-10 px-3 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:border-space-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-space-300 mb-2">
                <ArrowUpDown className="w-4 h-4" />
                Sort By
              </label>
              <Select
                options={SORT_OPTIONS}
                value={filters.sort_by || 'approach_date'}
                onChange={(e) => handleChange('sort_by', e.target.value)}
              />
            </div>

            <Button variant="outline" className="w-full" onClick={onReset}>
              Reset Filters
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
