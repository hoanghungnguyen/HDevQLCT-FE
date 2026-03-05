/**
 * Formats a given number into Vietnamese Dong (VND)
 * @param {number} amount
 * @returns {string} 
 */
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

/**
 * Formats an ISO Date string into a localized Vietnamese Date string
 * @param {string} dateString
 * @returns {string} Example: 25/03/2026
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
};

/**
 * Extracts month and year from a Date object or string
 * @param {Date|string} date 
 * @returns { month: number, year: number }
 */
export const getMonthYearFromDate = (date) => {
    const d = new Date(date);
    return {
        month: d.getMonth() + 1, // JavaScript months are 0-indexed
        year: d.getFullYear(),
    };
};
