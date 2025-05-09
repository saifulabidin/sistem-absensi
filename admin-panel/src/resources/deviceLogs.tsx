import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  DateInput,
  ReferenceInput,
  SelectInput,
  ExportButton,
  TopToolbar,
  FilterButton,
} from 'react-admin';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';
import { apiClient } from '@/contexts/AuthContext';

const DeviceLogFilters = [
  <DateInput source="startDate" label="Start Date" alwaysOn />,
  <DateInput source="endDate" label="End Date" alwaysOn />,
  <ReferenceInput source="user_id" reference="employees" label="Employee">
    <SelectInput optionText="name" />
  </ReferenceInput>,
];

const ExportDeviceLogsButton = () => {
  const [exporting, setExporting] = useState(false);
  
  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Get current filters from URL params if any
      const urlParams = new URLSearchParams(window.location.search);
      const startDate = urlParams.get('startDate') || '';
      const endDate = urlParams.get('endDate') || '';
      const userId = urlParams.get('user_id') || '';
      
      // Build query params
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (userId) queryParams.append('userId', userId);
      
      // Download report
      const response = await apiClient.get(`/device-logs/export?${queryParams.toString()}`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename from response header or use default
      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch = contentDisposition ? contentDisposition.match(/filename="(.+)"/) : null;
      const filename = filenameMatch ? filenameMatch[1] : 'device-logs.xlsx';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting device logs.');
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
      {exporting ? 'Exporting...' : 'Export Logs'}
    </Button>
  );
};

const DeviceLogListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
    <ExportDeviceLogsButton />
  </TopToolbar>
);

export const DeviceLogList = () => (
  <List filters={DeviceLogFilters} actions={<DeviceLogListActions />}>
    <Datagrid>
      <ReferenceField source="user_id" reference="employees" link={false}>
        <TextField source="name" />
      </ReferenceField>
      <TextField source="device_id" />
      <TextField source="device_name" />
      <TextField source="device_model" />
      <DateField source="login_time" showTime />
      <DateField source="logout_time" showTime />
      <TextField source="ip_address" />
    </Datagrid>
  </List>
);