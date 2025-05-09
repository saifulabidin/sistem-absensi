import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  BooleanField,
  DateInput,
  ReferenceInput,
  SelectInput,
  ExportButton,
  TopToolbar,
  FilterButton,
} from 'react-admin';
import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import { apiClient } from '@/contexts/AuthContext';

const AttendanceFilters = [
  <DateInput source="startDate" label="Start Date" alwaysOn />,
  <DateInput source="endDate" label="End Date" alwaysOn />,
  <ReferenceInput source="user_id" reference="employees" label="Employee">
    <SelectInput optionText="name" />
  </ReferenceInput>,
  <ReferenceInput source="dept_id" reference="departments" label="Department">
    <SelectInput optionText="name" />
  </ReferenceInput>,
];

const ExportReportButton = () => {
  const [exporting, setExporting] = useState(false);
  
  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Get current date range from URL params if any
      const urlParams = new URLSearchParams(window.location.search);
      const startDate = urlParams.get('startDate') || '';
      const endDate = urlParams.get('endDate') || '';
      const userId = urlParams.get('user_id') || '';
      const deptId = urlParams.get('dept_id') || '';
      
      // Build query params
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (userId) queryParams.append('userId', userId);
      if (deptId) queryParams.append('deptId', deptId);
      
      // Download report
      const response = await apiClient.get(`/attendance/export?${queryParams.toString()}`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename from response header or use default
      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch = contentDisposition ? contentDisposition.match(/filename="(.+)"/) : null;
      const filename = filenameMatch ? filenameMatch[1] : 'attendance-report.xlsx';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting attendance report.');
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <Button
      onClick={handleExport}
      startIcon={<DownloadIcon />}
      disabled={exporting}
      sx={{ marginLeft: 1 }}
    >
      {exporting ? 'Exporting...' : 'Export Report'}
    </Button>
  );
};

const AttendanceListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
    <ExportReportButton />
  </TopToolbar>
);

const StatusField = ({ record }: { record?: any }) => {
  if (!record) return null;
  
  let status = record.status || 'present';
  let color = 'default';
  
  if (status === 'late') color = 'error';
  if (status === 'present') color = 'success';
  if (status === 'absent') color = 'warning';
  
  return (
    <span style={{ 
      textTransform: 'capitalize',
      color: color === 'success' ? 'green' : (color === 'error' ? 'red' : (color === 'warning' ? 'orange' : 'inherit'))
    }}>
      {status}
    </span>
  );
};

export const AttendanceList = () => (
  <List filters={AttendanceFilters} actions={<AttendanceListActions />}>
    <Datagrid>
      <ReferenceField source="user_id" reference="employees" link={false}>
        <TextField source="name" />
      </ReferenceField>
      <DateField source="clock_in" showTime />
      <DateField source="clock_out" showTime />
      <NumberField source="work_hours" />
      <TextField source="status" render={(record) => <StatusField record={record} />} />
      <TextField source="notes" />
    </Datagrid>
  </List>
);