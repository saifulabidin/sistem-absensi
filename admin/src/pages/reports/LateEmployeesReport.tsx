import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import attendanceService from '../../services/attendance.service';
import Card from '../../components/common/card/Card';
import CardHeader from '../../components/common/card/CardHeader';
import DateRangePicker from '../../components/common/DateRangePicker';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
// Get last week
const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);
const lastWeekFormatted = lastWeek.toISOString().split('T')[0];

interface LateEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  lateCount: number;
  lateDates: string[];
}

const LateEmployeesReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [startDate, setStartDate] = useState(queryParams.get('startDate') || lastWeekFormatted);
  const [endDate, setEndDate] = useState(queryParams.get('endDate') || today);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lateEmployees, setLateEmployees] = useState<LateEmployee[]>([]);

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    const fetchLateEmployees = async () => {
      try {
        setLoading(true);
        
        // Get attendance logs for the period
        const attendanceReport = await attendanceService.getAttendanceReport({
          startDate,
          endDate
        });
        
        // Group by employee and count late occurrences
        const employeeMap: { [key: string]: LateEmployee } = {};
        
        attendanceReport.logs.forEach((log: any) => {
          if (log.status === 'late' && log.user) {
            const userId = log.user.id;
            const date = log.clock_in.split('T')[0];
            
            if (!employeeMap[userId]) {
              employeeMap[userId] = {
                id: userId,
                name: log.user.name,
                email: log.user.email,
                department: log.user.department?.name || 'N/A',
                lateCount: 0,
                lateDates: []
              };
            }
            
            employeeMap[userId].lateCount++;
            employeeMap[userId].lateDates.push(date);
          }
        });
        
        // Convert to array and sort by late count (highest first)
        const lateEmployeesList = Object.values(employeeMap).sort(
          (a, b) => b.lateCount - a.lateCount
        );
        
        setLateEmployees(lateEmployeesList);
        setError(null);
      } catch (err) {
        console.error('Error fetching late employees:', err);
        setError('Failed to load late employees data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLateEmployees();
  }, [startDate, endDate]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-24 font-bold">Late Employees Report</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>
      
      <div className="mb-6">
        <DateRangePicker 
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
      
      {loading ? (
        <div className="text-center p-20">Loading report data...</div>
      ) : error ? (
        <div className="text-red-500 p-20">{error}</div>
      ) : (
        <Card>
          <CardHeader priority="warning" displayText={`Late Employees (${lateEmployees.length})`} />
          <div className="p-4">
            {lateEmployees.length === 0 ? (
              <div className="text-center py-8">
                No late employees found for the selected period
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left">Employee Name</th>
                      <th className="py-3 px-4 text-left">Department</th>
                      <th className="py-3 px-4 text-center">Late Count</th>
                      <th className="py-3 px-4 text-left">Dates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lateEmployees.map((employee) => (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>{employee.name}</div>
                          <div className="text-gray-500 text-sm">{employee.email}</div>
                        </td>
                        <td className="py-3 px-4">{employee.department}</td>
                        <td className="py-3 px-4 text-center font-bold text-amber-600">{employee.lateCount}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {employee.lateDates.map((date, index) => (
                              <span 
                                key={`${employee.id}-${date}-${index}`}
                                className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded"
                              >
                                {new Date(date).toLocaleDateString()}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LateEmployeesReport;
