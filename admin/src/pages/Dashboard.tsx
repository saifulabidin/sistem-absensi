import { useEffect, useState } from 'react';
import attendanceService from '../services/attendance.service';
import employeeService from '../services/employee.service';
import departmentService from '../services/department.service';
import Card from '../components/common/card/Card';
import CardHeader from '../components/common/card/CardHeader';
import Divider from '../components/common/Divider';
import Dividers from '../components/common/Dividers';
import { useAuthentication } from '../components/authentication/AuthContextProvider';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
// Get first day of current month
const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

const Dashboard = () => {
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    employeeCount: 0,
    departmentCount: 0,
    todayAttendance: 0,
    monthlyAttendance: 0,
    attendanceRate: 0,
    lateCount: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [employees, departments, attendanceReport] = await Promise.all([
          employeeService.getAllEmployees(),
          departmentService.getAllDepartments(),
          attendanceService.getAttendanceReport({ 
            startDate: firstDayOfMonth, 
            endDate: today
          })
        ]);

        // Calculate statistics
        const todayAttendance = attendanceReport.logs.filter(
          (log: any) => log.clock_in.split('T')[0] === today
        ).length;
        
        // Simple attendance rate calculation (present vs total employee count)
        const attendanceRate = employees.length > 0 ? 
          (todayAttendance / employees.length) * 100 : 0;

        // Count late entries
        const lateCount = attendanceReport.logs.filter(
          (log: any) => log.status === 'late'
        ).length;

        setStats({
          employeeCount: employees.length,
          departmentCount: departments.length,
          todayAttendance,
          monthlyAttendance: attendanceReport.logs.length,
          attendanceRate,
          lateCount
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-24 font-bold mb-30">Welcome, {user?.name}!</h1>

      {loading ? (
        <div className="text-center p-20">Loading dashboard data...</div>
      ) : error ? (
        <div className="text-red-500 p-20">{error}</div>
      ) : (
        <Dividers className="gap-30">
          {/* Stats Cards Row */}
          <Divider base={12}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
              <Card>
                <CardHeader priority="primary" displayText="Total Employees" />
                <div className="p-20 text-center">
                  <div className="text-36 font-bold">{stats.employeeCount}</div>
                </div>
              </Card>

              <Card>
                <CardHeader priority="primary" displayText="Departments" />
                <div className="p-20 text-center">
                  <div className="text-36 font-bold">{stats.departmentCount}</div>
                </div>
              </Card>

              <Card>
                <CardHeader priority="primary" displayText="Today's Attendance" />
                <div className="p-20 text-center">
                  <div className="text-36 font-bold">{stats.todayAttendance}</div>
                  <div className="text-14 mt-8">
                    {stats.attendanceRate.toFixed(1)}% of employees
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader priority="primary" displayText="Late Arrivals" />
                <div className="p-20 text-center">
                  <div className="text-36 font-bold">{stats.lateCount}</div>
                  <div className="text-14 mt-8">this month</div>
                </div>
              </Card>
            </div>
          </Divider>

          {/* Charts Row */}
          <Divider base={12}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <Card className="h-300">
                <CardHeader priority="primary" displayText="Monthly Attendance" />
                <div className="p-20">
                  {/* You can add a chart library here like Chart.js or Recharts */}
                  <div className="flex items-center justify-center h-200">
                    <p>Monthly attendance chart will be displayed here</p>
                  </div>
                </div>
              </Card>

              <Card className="h-300">
                <CardHeader priority="primary" displayText="Department Distribution" />
                <div className="p-20">
                  <div className="flex items-center justify-center h-200">
                    <p>Department distribution chart will be displayed here</p>
                  </div>
                </div>
              </Card>
            </div>
          </Divider>
        </Dividers>
      )}
    </div>
  );
};

export default Dashboard;
