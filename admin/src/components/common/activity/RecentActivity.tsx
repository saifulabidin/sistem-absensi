import { useEffect, useState } from 'react';
import attendanceService from '../../../services/attendance.service';

interface RecentActivityProps {
  limit?: number;
  showFilter?: boolean;
}

const RecentActivity = ({ limit = 5, showFilter = true }: RecentActivityProps) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const logs = await attendanceService.getAttendanceLogs({ limit });
        setActivities(logs);
        setFilteredActivities(logs);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent activity:', err);
        setError('Failed to load recent activities');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [limit]);
  
  // Filter activities when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredActivities(activities);
      return;
    }
    
    const filtered = activities.filter(activity => 
      (activity.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActivities(filtered);
  }, [searchTerm, activities]);

  if (loading) return <div className="text-center py-4 text-gray-300">Loading recent activities...</div>;
  if (error) return <div className="text-red-400 py-4">{error}</div>;
  if (activities.length === 0) return <div className="text-center py-4 text-gray-300">No recent activities found</div>;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <span className="bg-green-900 text-green-400 text-xs px-2 py-1 rounded">On Time</span>;
      case 'late':
        return <span className="bg-amber-900 text-amber-400 text-xs px-2 py-1 rounded">Late</span>;
      case 'absent':
        return <span className="bg-red-900 text-red-400 text-xs px-2 py-1 rounded">Absent</span>;
      default:
        return <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">{status}</span>;
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {showFilter && (
        <div className="mb-3 relative">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-theme focus:border-transparent transition-all duration-200 outline-none"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-3 top-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      )}
      
      <div className="overflow-y-auto max-h-[350px] custom-scrollbar">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-4 text-gray-400">No matching activities found</div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {filteredActivities.map((activity, index) => (
              <li key={activity.id} className={`py-3 px-2 hover:bg-gray-800 hover:border-l-2 hover:border-theme transition-all duration-200 rounded-md cursor-pointer ${index === 0 ? 'relative bg-gray-800 bg-opacity-50' : ''}`}>
                {index === 0 && <div className="absolute -inset-0.5 bg-theme bg-opacity-20 rounded-lg blur-sm group-hover:blur"></div>}
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between group">
                  <div className="mb-2 sm:mb-0">
                    <div className="font-medium text-theme group-hover:text-theme-light transition-colors duration-200">
                      {activity.user?.name || 'Unknown User'}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-400 mt-1">
                      <span>{new Date(activity.clock_in).toLocaleDateString()}</span>
                      <span className="hidden sm:inline">·</span>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-start sm:items-end justify-between sm:text-right">
                    <div className="text-xs sm:text-sm text-gray-300 mr-3 sm:mr-0">
                      In: <span className="font-medium text-white">{formatTime(activity.clock_in)}</span>
                    </div>
                    {activity.clock_out && (
                      <div className="text-xs sm:text-sm text-gray-300">
                        Out: <span className="font-medium text-white">{formatTime(activity.clock_out)}</span>
                      </div>
                    )}
                    {activity.work_hours !== null && (
                      <div className="text-xs text-gray-400 group-hover:text-theme-light transition-colors duration-200">
                        {activity.work_hours} hours
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
