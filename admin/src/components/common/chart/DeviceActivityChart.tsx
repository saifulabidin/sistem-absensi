import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import deviceLogService from '../../../services/device-log.service';

interface DeviceActivityChartProps {
  startDate: string;
  endDate: string;
  limit?: number;
}

const DeviceActivityChart = ({ startDate, endDate, limit = 10 }: DeviceActivityChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        setLoading(true);
        const deviceLogs = await deviceLogService.getDeviceLogs({
          startDate,
          endDate,
          limit
        });

        // Process device usage data
        const deviceUsage: { [key: string]: { device: string, count: number } } = {};

        // Group by device name/model
        deviceLogs.forEach((log: any) => {
          const deviceName = log.device_name || 'Unknown Device';
          if (!deviceUsage[deviceName]) {
            deviceUsage[deviceName] = {
              device: deviceName,
              count: 0
            };
          }
          deviceUsage[deviceName].count++;
        });

        // Convert to array and sort by usage count
        const chartData = Object.values(deviceUsage)
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Top 10 devices

        setChartData(chartData);
        setError(null);
      } catch (err) {
        console.error('Error fetching device data for chart:', err);
        setError('Failed to load device activity data');
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [startDate, endDate, limit]);

  if (loading) return <div className="flex items-center justify-center h-full">Loading device data...</div>;
  if (error) return <div className="text-red-500 flex items-center justify-center h-full">{error}</div>;
  if (chartData.length === 0) return <div className="flex items-center justify-center h-full">No device activity data found</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 100,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="device" type="category" width={80} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Login Count" fill="#3F51B5" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DeviceActivityChart;
