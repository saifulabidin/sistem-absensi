import { Card, CardContent, CardHeader } from '@mui/material';
import { Title } from 'react-admin';

const Dashboard = () => (
  <>
    <Title title="Dashboard" />
    <Card sx={{ marginTop: 2 }}>
      <CardHeader title="Welcome to the Attendance System Admin Panel" />
      <CardContent>
        <p>Manage employees, departments, positions, and monitor attendance from this central dashboard.</p>
      </CardContent>
    </Card>
    <div style={{ display: 'flex', marginTop: '1em', gap: '1em' }}>
      <Card sx={{ flex: 1 }}>
        <CardHeader title="Attendance Today" />
        <CardContent>
          <p>Track today's attendance status</p>
        </CardContent>
      </Card>
      <Card sx={{ flex: 1 }}>
        <CardHeader title="Recent Device Logins" />
        <CardContent>
          <p>Monitor recent login activities</p>
        </CardContent>
      </Card>
      <Card sx={{ flex: 1 }}>
        <CardHeader title="Employee Status" />
        <CardContent>
          <p>View employee status summary</p>
        </CardContent>
      </Card>
    </div>
  </>
);

export default Dashboard;