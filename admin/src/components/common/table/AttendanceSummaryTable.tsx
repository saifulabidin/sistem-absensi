import { useState, useEffect } from 'react';
import attendanceService from '../../../services/attendance.service';

interface AttendanceSummaryTableProps {
  startDate: string;
  endDate: string;
  departmentId?: string;
}

interface AttendanceSummary {
  date: string;
  presentCount: number;
  lateCount: number;
  totalCount: number;
  averageWorkHours: number;
}

const AttendanceSummaryTable = ({ startDate, endDate, departmentId }: AttendanceSummaryTableProps) => {
  const [summaries, setSummaries] = useState<AttendanceSummary[]>([]);
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

        // Process data for summary table
        const summaryByDay: { [key: string]: AttendanceSummary } = {};

        // Group attendance by date
        report.logs.forEach((log: any) => {
          const date = log.clock_in.split('T')[0];
          if (!summaryByDay[date]) {
            summaryByDay[date] = {
              date,
              presentCount: 0,
              lateCount: 0,
              totalCount: 0,
              averageWorkHours: 0
            };
          }

          summaryByDay[date].totalCount += 1;
          if (log.status === 'present') {
            summaryByDay[date].presentCount += 1;
          } else if (log.status === 'late') {
            summaryByDay[date].lateCount += 1;
          }

          // Add work hours if available
          if (log.work_hours) {
            if (!summaryByDay[date].averageWorkHours) {
              summaryByDay[date].averageWorkHours = log.work_hours;
            } else {
              summaryByDay[date].averageWorkHours = 
                (summaryByDay[date].averageWorkHours + log.work_hours) / 2;
            }
          }
        });

        // Convert to array and sort by date (most recent first)
        const summaryData = Object.values(summaryByDay).sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setSummaries(summaryData);
        setError(null);
      } catch (err) {
        console.error('Error fetching attendance data for summary table:', err);
        setError('Failed to load attendance summary data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [startDate, endDate, departmentId]);

  if (loading) return <div className="text-center py-6">Loading attendance summary...</div>;
  if (error) return <div className="text-red-500 py-6">{error}</div>;
  if (summaries.length === 0) return <div className="text-center py-6">No attendance data found for the selected period</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-center">Present</th>
            <th className="py-3 px-4 text-center">Late</th>
            <th className="py-3 px-4 text-center">Total</th>
            <th className="py-3 px-4 text-center">Avg. Work Hours</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((summary) => (
            <tr key={summary.date} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                {new Date(summary.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td className="py-3 px-4 text-center text-green-600">{summary.presentCount}</td>
              <td className="py-3 px-4 text-center text-amber-600">{summary.lateCount}</td>
              <td className="py-3 px-4 text-center font-medium">{summary.totalCount}</td>
              <td className="py-3 px-4 text-center">{summary.averageWorkHours.toFixed(1)} hrs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceSummaryTable;
