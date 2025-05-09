import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import CssBaseline from '@mui/material/CssBaseline';

import authProvider from './authProvider';
import dataProvider from './dataProvider';
import { Dashboard } from './dashboard';
import { EmployeeList, EmployeeEdit, EmployeeCreate } from './resources/employees';
import { DepartmentList, DepartmentEdit, DepartmentCreate } from './resources/departments';
import { PositionList, PositionEdit, PositionCreate } from './resources/positions';
import { AttendanceList, AttendanceShow } from './resources/attendance';
import { DeviceLogList } from './resources/deviceLogs';

import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DevicesIcon from '@mui/icons-material/Devices';

const App = () => (
    <BrowserRouter>
        <Admin 
            authProvider={authProvider}
            dataProvider={dataProvider}
            dashboard={Dashboard}
            title="Attendance System Admin"
        >
            <CssBaseline />
            <Resource 
                name="employees" 
                list={EmployeeList}
                edit={EmployeeEdit}
                create={EmployeeCreate}
                icon={PeopleIcon}
            />
            <Resource 
                name="departments" 
                list={DepartmentList}
                edit={DepartmentEdit}
                create={DepartmentCreate}
                icon={BusinessIcon}
            />
            <Resource 
                name="positions" 
                list={PositionList}
                edit={PositionEdit}
                create={PositionCreate}
                icon={WorkIcon}
            />
            <Resource 
                name="attendance" 
                list={AttendanceList}
                show={AttendanceShow}
                icon={EventNoteIcon}
            />
            <Resource 
                name="device-logs" 
                list={DeviceLogList}
                icon={DevicesIcon}
            />
        </Admin>
    </BrowserRouter>
);

export default App;
