import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/card/Card';
import CardHeader from '../../components/common/card/CardHeader';
import DateRangePicker from '../../components/common/DateRangePicker';
import AttendanceSummaryTable from '../../components/common/table/AttendanceSummaryTable';
import departmentService from '../../services/department.service';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
// Get first day of current month
const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

const AttendanceSummaryReport = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<any[]>([]);

  // Load departments on component mount
  useState(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await departmentService.getAllDepartments();
        setDepartments(departments);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    
    fetchDepartments();
  });

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleDownloadExcel = () => {
    const url = `/api/attendance/export?startDate=${startDate}&endDate=${endDate}${selectedDepartment ? `&departmentId=${selectedDepartment}` : ''}&detailed=true`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-24 font-bold">Attendance Summary Report</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <DateRangePicker 
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
        />
        
        <div className="flex items-center ml-auto">
          <span className="mr-2">Department:</span>
          <select 
            className="border rounded px-3 py-2"
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
      
      <Card className="mb-6">
        <CardHeader priority="primary" displayText="Daily Attendance Summary" />
        <div className="p-4">
          <AttendanceSummaryTable 
            startDate={startDate}
            endDate={endDate}
            departmentId={selectedDepartment || undefined}
          />
        </div>
      </Card>
      
      <div className="text-right">
        <button 
          onClick={handleDownloadExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Download Excel Report
        </button>
      </div>
    </div>
  );
};

export default AttendanceSummaryReport;
