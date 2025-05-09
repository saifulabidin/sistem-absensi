import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import attendanceService from '../services/attendance.service';
import employeeService from '../services/employee.service';
import departmentService from '../services/department.service';
import deviceLogService from '../services/device-log.service';
import Card from '../components/common/card/Card';
import CardHeader from '../components/common/card/CardHeader';
import Divider from '../components/common/Divider';
import Dividers from '../components/common/Dividers';
import StatCard from '../components/common/StatCard';
import DateRangePicker from '../components/common/DateRangePicker';
import RecentActivity from '../components/common/activity/RecentActivity';
import AttendanceChart from '../components/common/chart/AttendanceChart';
import DepartmentDistributionChart from '../components/common/chart/DepartmentDistributionChart';
import DeviceActivityChart from '../components/common/chart/DeviceActivityChart';
import { useAuthentication } from '../components/authentication/AuthContextProvider';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
// Get first day of current month
const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
// Get last week
const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);
const lastWeekFormatted = lastWeek.toISOString().split('T')[0];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    employeeCount: 0,
    departmentCount: 0,
    todayAttendance: 0,
    monthlyAttendance: 0,
    attendanceRate: 0,
    lateCount: 0,
    deviceLogins: 0,
    absentCount: 0
  });
  
  // Date range for dashboard data
  const [dateRange, setDateRange] = useState({
    startDate: lastWeekFormatted,
    endDate: today
  });
  
  // Selected department for filtering
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<any[]>([]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [employees, departments, attendanceReport, deviceLogs] = await Promise.all([
          employeeService.getAllEmployees(),
          departmentService.getAllDepartments(),
          attendanceService.getAttendanceReport({ 
            startDate: dateRange.startDate, 
            endDate: dateRange.endDate,
            departmentId: selectedDepartment || undefined
          }),
          deviceLogService.getDeviceLogs({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          })
        ]);

        setDepartments(departments);

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
        
        // Calculate absent count (rough estimate - employees who didn't clock in today)
        const absentCount = Math.max(0, employees.length - todayAttendance);

        setStats({
          employeeCount: employees.length,
          departmentCount: departments.length,
          todayAttendance,
          monthlyAttendance: attendanceReport.logs.length,
          attendanceRate,
          lateCount,
          deviceLogins: deviceLogs.length,
          absentCount
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
  }, [dateRange.startDate, dateRange.endDate, selectedDepartment]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-full lg:max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 bg-black-800 p-4 rounded-xl shadow-theme border border-gray-800">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
              <span className="inline-block bg-gradient-to-r from-theme to-theme-light text-transparent bg-clip-text">Admin Dashboard</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage and monitor your attendance system
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-300 whitespace-nowrap">Filter by department:</span>
            <select 
              className="border border-gray-700 rounded-md px-2 py-1 md:px-3 md:py-2 bg-gray-900 text-white focus:ring-2 focus:ring-theme focus:border-theme transition-all duration-200 outline-none cursor-pointer w-full sm:w-auto"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept: any) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <DateRangePicker 
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onDateRangeChange={handleDateRangeChange}
        />

        {loading ? (
        <div className="text-center p-10 bg-black-800 rounded-lg shadow-theme border border-gray-800 my-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Animated loading spinner */}
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme"></div>
            
            {/* Animated pulse elements */}
            <div className="w-3/4 max-w-md">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
                <div className="flex justify-center space-x-4">
                  <div className="h-20 w-24 bg-gray-700 rounded"></div>
                  <div className="h-20 w-24 bg-gray-700 rounded"></div>
                  <div className="h-20 w-24 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-gray-300 font-medium">Loading dashboard data...</div>
            <div className="text-gray-400 text-sm">Please wait while we fetch your attendance insights</div>
          </div>
        </div>
      ) : error ? (
        <div className="p-10 bg-black-800 rounded-lg shadow-theme border border-red-800 my-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-900 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-theme text-white px-6 py-2 rounded-md hover:bg-theme-light focus:outline-none focus:ring-2 focus:ring-theme transition-all duration-200 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      ) : (
        <Dividers className="gap-30">
          {/* Welcome Message */}
          <Divider base={12}>
            <div className="p-6 bg-gradient-to-r from-theme to-theme-light rounded-lg shadow-theme text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-10 -mr-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -mb-8 -ml-8"></div>
              
              <div className="flex items-start">
                <div className="bg-theme shadow-theme rounded-100vh flex items-center justify-center w-36 h-36 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Welcome, {user?.name}! 👋</h2>
                  <p className="mt-2 text-gray-200">
                    Here's your attendance system overview for <span className="font-semibold text-white">{dateRange.startDate}</span> to <span className="font-semibold text-white">{dateRange.endDate}</span>
                  </p>
                  <div className="mt-4 inline-flex items-center text-sm bg-black-800 bg-opacity-50 px-3 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Last updated: {new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Divider>
          
          {/* Stats Cards Row */}
          <Divider base={12}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              <StatCard 
                title="Total Employees" 
                value={stats.employeeCount}
                priority="primary"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />

              <StatCard 
                title="Today's Attendance" 
                value={stats.todayAttendance}
                subtitle={`${stats.attendanceRate.toFixed(1)}% of employees`}
                priority="success"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />

              <StatCard 
                title="Absent Today" 
                value={stats.absentCount}
                subtitle={stats.employeeCount ? `${((stats.absentCount / stats.employeeCount) * 100).toFixed(1)}% of employees` : '0% of employees'}
                priority="danger"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />

              <StatCard 
                title="Late Arrivals" 
                value={stats.lateCount}
                subtitle="during selected period"
                priority="warning"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
          </Divider>
          
          {/* Second Row Stats and Recent Activity */}
          <Divider base={12}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 md:gap-6">
                  <StatCard 
                    title="Departments" 
                    value={stats.departmentCount}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    }
                  />

                  <StatCard 
                    title="Device Logins" 
                    value={stats.deviceLogins}
                    subtitle="during selected period"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                  
                  <StatCard 
                    title="Total Attendance" 
                    value={stats.monthlyAttendance}
                    subtitle="during selected period"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <Card className="h-full" borderTop borderTopColor="theme">
                  <CardHeader 
                    priority="primary" 
                    displayText="Recent Attendance Activity" 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    action={
                      <button className="text-xs bg-theme bg-opacity-20 hover:bg-opacity-30 text-theme px-2 py-1 rounded transition-colors">
                        View All
                      </button>
                    }
                  />
                  <div className="p-2">
                    <RecentActivity limit={10} showFilter={true} />
                  </div>
                </Card>
              </div>
            </div>
          </Divider>

          {/* Charts Row */}
          <Divider base={12}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <Card className="h-400">
                <CardHeader priority="primary" displayText="Attendance Trends" />
                <div className="p-20 h-[360px]">
                  <AttendanceChart 
                    startDate={dateRange.startDate} 
                    endDate={dateRange.endDate}
                    departmentId={selectedDepartment || undefined}
                  />
                </div>
              </Card>

              <Card className="h-400">
                <CardHeader priority="primary" displayText="Department Distribution" />
                <div className="p-20 h-[360px]">
                  <DepartmentDistributionChart />
                </div>
              </Card>
            </div>
          </Divider>
          
          {/* Device Activity Row */}
          <Divider base={12}>
            <Card className="h-400">
              <CardHeader priority="primary" displayText="Device Login Activity" />
              <div className="p-20 h-[360px]">
                <DeviceActivityChart 
                  startDate={dateRange.startDate} 
                  endDate={dateRange.endDate}
                />
              </div>
            </Card>
          </Divider>
          
          {/* Quick Actions */}
          <Divider base={12}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
              <Card hasShadow={true} className="transform hover:-translate-y-1 transition-all duration-300">
                <CardHeader priority="success" displayText="Export Attendance Report" />
                <div className="p-20">
                  <div className="bg-green-900 p-3 rounded-lg mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="mb-4 text-gray-300 text-center">Download attendance data for the selected period</p>
                  <button 
                    onClick={() => window.open(`/api/attendance/export?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}${selectedDepartment ? `&departmentId=${selectedDepartment}` : ''}&detailed=true`, '_blank')}
                    className="bg-theme text-white px-4 py-2 rounded-md hover:shadow-theme w-full flex items-center justify-center group transition-all duration-200"
                  >
                    <span>Download Excel Report</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </Card>
              
              <Card hasShadow={true} className="transform hover:-translate-y-1 transition-all duration-300">
                <CardHeader priority="primary" displayText="Device Log Export" />
                <div className="p-20">
                  <div className="bg-theme bg-opacity-30 p-3 rounded-lg mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <p className="mb-4 text-gray-300 text-center">Download device login data for analysis</p>
                  <button 
                    onClick={() => window.open(`/api/device-logs/export?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, '_blank')}
                    className="bg-theme text-white px-4 py-2 rounded-md hover:shadow-theme w-full flex items-center justify-center group transition-all duration-200"
                  >
                    <span>Export Device Logs</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </Card>
              
              <Card hasShadow={true} className="transform hover:-translate-y-1 transition-all duration-300">
                <CardHeader priority="warning" displayText="View Late Employees" />
                <div className="p-20">
                  <div className="bg-amber-900 p-3 rounded-lg mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="mb-4 text-gray-300 text-center">Check which employees have been arriving late</p>
                  <button 
                    onClick={() => navigate(`/reports/late-employees?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)}
                    className="bg-theme text-white px-4 py-2 rounded-md hover:shadow-theme w-full flex items-center justify-center group transition-all duration-200"
                  >
                    <span>View Report</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </Card>

              <Card hasShadow={true} className="transform hover:-translate-y-1 transition-all duration-300">
                <CardHeader priority="primary" displayText="Attendance Summary" />
                <div className="p-20">
                  <div className="bg-theme bg-opacity-30 p-3 rounded-lg mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="mb-4 text-gray-300 text-center">View daily attendance summary and statistics</p>
                  <button 
                    onClick={() => navigate(`/reports/attendance-summary?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)}
                    className="bg-theme text-white px-4 py-2 rounded-md hover:shadow-theme w-full flex items-center justify-center group transition-all duration-200"
                  >
                    <span>View Summary</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </Card>
            </div>
          </Divider>
        </Dividers>
        )}
      </div>
    </div>
  );
};

// Helper function to generate PDF report
const generatePdfReport = () => {
  // This would normally use a library like jsPDF or react-pdf
  alert("PDF report generation feature will be implemented in a future update");
};

export default Dashboard;
