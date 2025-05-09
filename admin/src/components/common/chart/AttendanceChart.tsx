import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import attendanceService from '../../../services/attendance.service';

interface AttendanceChartProps {
  startDate: string;
  endDate: string;
  departmentId?: string;
}

const AttendanceChart = ({ startDate, endDate, departmentId }: AttendanceChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const report = await attendanceService.getAttendanceReport({
          startDate,
          endDate,
          departmentId
        });

        // Process data for chart
        const attendanceByDay: { [key: string]: any } = {};

        // Group attendance by date
        report.logs.forEach((log: any) => {
          const date = log.clock_in.split('T')[0];
          if (!attendanceByDay[date]) {
            attendanceByDay[date] = {
              date,
              present: 0,
              late: 0,
              total: 0
            };
          }

          attendanceByDay[date].total += 1;
          if (log.status === 'present') {
            attendanceByDay[date].present += 1;
          } else if (log.status === 'late') {
            attendanceByDay[date].late += 1;
          }
        });

        // Convert to array and sort by date
        const chartData = Object.values(attendanceByDay).sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setChartData(chartData);
        setError(null);
      } catch (err) {
        console.error('Error fetching attendance data for chart:', err);
        setError('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [startDate, endDate, departmentId]);

  if (loading) return <div className="flex items-center justify-center h-full">Loading chart data...</div>;
  if (error) return <div className="text-red-500 flex items-center justify-center h-full">{error}</div>;
  if (chartData.length === 0) return <div className="flex items-center justify-center h-full">No attendance data found</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="present" 
          name="On Time" 
          stroke="#4CAF50" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          type="monotone" 
          dataKey="late" 
          name="Late" 
          stroke="#FF9800" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          type="monotone" 
          dataKey="total" 
          name="Total" 
          stroke="#2196F3" 
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
