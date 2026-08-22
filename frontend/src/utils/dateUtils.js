/**
 * Formats a date string to a human-readable format.
 * @param {string} dateString - The date string (e.g., '2023-01-15')
 * @returns {string} Formatted date (e.g., 'Jan 15, 2023')
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculates duration between two dates.
 * @param {string} startDate 
 * @param {string} endDate 
 * @returns {string} Duration (e.g., '1 year 2 months')
 */
export const calculateDuration = (startDate, endDate = new Date().toISOString()) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  
  if (diffInMonths < 1) return 'Less than a month';
  if (diffInMonths < 12) return `${diffInMonths} months`;
  
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;
  
  if (months === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
  return `${years} ${years === 1 ? 'year' : 'years'} ${months} ${months === 1 ? 'month' : 'months'}`;
};
