import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import departmentService from '../../../services/department.service';
import employeeService from '../../../services/employee.service';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

interface DepartmentChartProps {
  className?: string;
}

const DepartmentDistributionChart = ({ className }: DepartmentChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setLoading(true);
        const [departments, employees] = await Promise.all([
          departmentService.getAllDepartments(),
          employeeService.getAllEmployees()
        ]);

        // Count employees by department
        const departmentCounts: { [key: string]: number } = {};
        const departmentMap: { [key: string]: string } = {};
        
        // Create map of department IDs to names
        departments.forEach((dept: any) => {
          departmentMap[dept.id] = dept.name;
          departmentCounts[dept.id] = 0;
        });
        
        // Count employees in each department
        employees.forEach((emp: any) => {
          if (emp.dept_id && departmentCounts[emp.dept_id] !== undefined) {
            departmentCounts[emp.dept_id]++;
          }
        });
        
        // Convert to chart data format
        const chartData = Object.entries(departmentCounts)
          .map(([deptId, count]) => ({
            name: departmentMap[deptId] || 'Unknown',
            value: count,
            deptId
          }))
          .filter(item => item.value > 0); // Remove empty departments
        
        setChartData(chartData);
        setError(null);
      } catch (err) {
        console.error('Error fetching department data for chart:', err);
        setError('Failed to load department distribution data');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full">Loading chart data...</div>;
  if (error) return <div className="text-red-500 flex items-center justify-center h-full">{error}</div>;
  if (chartData.length === 0) return <div className="flex items-center justify-center h-full">No department data found</div>;

  const renderLabel = (entry: any) => `${entry.name}: ${entry.value}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={renderLabel}
          outerRadius={80}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value} employees`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DepartmentDistributionChart;
