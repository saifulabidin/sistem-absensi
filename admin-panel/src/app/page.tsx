'use client';

import { Admin, Resource } from 'react-admin';
import authProvider from '@/providers/authProvider';
import dataProvider from '@/providers/dataProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Import resource components
// We'll create these next
import { EmployeeList, EmployeeEdit, EmployeeCreate } from '@/resources/employees';
import { DepartmentList, DepartmentEdit, DepartmentCreate } from '@/resources/departments';
import { PositionList, PositionEdit, PositionCreate } from '@/resources/positions';
import { AttendanceList } from '@/resources/attendance';
import { DeviceLogList } from '@/resources/deviceLogs';

// Icons (we'll use placeholder for now)
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DevicesIcon from '@mui/icons-material/Devices';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      dashboard={Dashboard}
      title="Attendance System | Admin Panel"
    >
      <Resource
        name="employees"
        list={EmployeeList}
        edit={EmployeeEdit}
        create={EmployeeCreate}
        icon={PersonIcon}
        options={{ label: 'Employees' }}
      />
      <Resource
        name="departments"
        list={DepartmentList}
        edit={DepartmentEdit}
        create={DepartmentCreate}
        icon={BusinessIcon}
        options={{ label: 'Departments' }}
      />
      <Resource
        name="positions"
        list={PositionList}
        edit={PositionEdit}
        create={PositionCreate}
        icon={GroupsIcon}
        options={{ label: 'Positions' }}
      />
      <Resource
        name="attendance"
        list={AttendanceList}
        icon={AccessTimeIcon}
        options={{ label: 'Attendance' }}
      />
      <Resource
        name="device-logs"
        list={DeviceLogList}
        icon={DevicesIcon}
        options={{ label: 'Device Logs' }}
      />
    </Admin>
  );
}
