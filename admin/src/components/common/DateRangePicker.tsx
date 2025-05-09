import { useState } from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const DateRangePicker = ({ startDate, endDate, onDateRangeChange }: DateRangePickerProps) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  const handleApply = () => {
    onDateRangeChange(localStartDate, localEndDate);
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date();
    start.setDate(start.getDate() - days);
    const startStr = start.toISOString().split('T')[0];
    
    setLocalStartDate(startStr);
    setLocalEndDate(end);
    onDateRangeChange(startStr, end);
  };

  return (
    <div className="bg-black-800 p-3 sm:p-4 rounded-xl shadow-theme border border-gray-800 mb-4 md:mb-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:justify-between">
        {/* Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm text-gray-300 font-medium whitespace-nowrap">From:</span>
            <input
              type="date"
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-sm focus:ring-2 focus:ring-theme focus:border-theme transition-all duration-200 outline-none"
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
              max={localEndDate}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm text-gray-300 font-medium whitespace-nowrap">To:</span>
            <input
              type="date"
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-sm focus:ring-2 focus:ring-theme focus:border-theme transition-all duration-200 outline-none"
              value={localEndDate}
              onChange={(e) => setLocalEndDate(e.target.value)}
              min={localStartDate}
            />
          </div>
          <button
            className="sm:w-auto bg-theme hover:bg-theme-dark text-black font-medium px-4 py-2 rounded-md transition-all duration-200 text-sm flex items-center justify-center"
            onClick={handleApply}
          >
            <span>Apply</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
        
        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-2 lg:ml-4">
          <button
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded transition-colors duration-200 border border-gray-700"
            onClick={() => handleQuickSelect(7)}
          >
            Last 7 days
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded transition-colors duration-200 border border-gray-700"
            onClick={() => handleQuickSelect(30)}
          >
            Last 30 days
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded transition-colors duration-200 border border-gray-700"
            onClick={() => handleQuickSelect(90)}
          >
            Last 3 months
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
