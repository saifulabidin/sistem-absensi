import {
  List,
  Datagrid,
  TextField,
  EmailField,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  Create,
  useRecordContext,
  required,
  email,
  Show,
  SimpleShowLayout,
  ReferenceField,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  ExportButton,
  TopToolbar,
  FilterButton,
  CreateButton,
  downloadCSV
} from 'react-admin';
import { Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState } from 'react';
import { apiClient } from '@/contexts/AuthContext';

const EmployeeFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <ReferenceInput source="dept_id" label="Department" reference="departments" />,
  <ReferenceInput source="position_id" label="Position" reference="positions" />,
];

const ImportButton = () => {
  const [importing, setImporting] = useState(false);
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      await apiClient.post('/employees/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing employees. Please check file format.');
    } finally {
      setImporting(false);
    }
  };
  
  return (
    <Button
      component="label"
      startIcon={<UploadFileIcon />}
      disabled={importing}
      sx={{ marginLeft: 1 }}
    >
      {importing ? 'Importing...' : 'Import'}
      <input
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={handleImport}
      />
    </Button>
  );
};

const EmployeeListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
    <ImportButton />
  </TopToolbar>
);

export const EmployeeList = () => (
  <List actions={<EmployeeListActions />} filters={EmployeeFilters}>
    <Datagrid>
      <TextField source="name" />
      <EmailField source="email" />
      <ReferenceField source="dept_id" reference="departments" link={false}>
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="position_id" reference="positions" link={false}>
        <TextField source="name" />
      </ReferenceField>
      <DateField source="created_at" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const EmployeeEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <EmailField source="email" validate={[required(), email()]} fullWidth />
      <ReferenceInput source="dept_id" reference="departments">
        <SelectInput optionText="name" validate={required()} fullWidth />
      </ReferenceInput>
      <ReferenceInput source="position_id" reference="positions">
        <SelectInput optionText="name" validate={required()} fullWidth />
      </ReferenceInput>
      <SelectInput
        source="role"
        choices={[
          { id: 'admin', name: 'Admin' },
          { id: 'employee', name: 'Employee' },
        ]}
        validate={required()}
        fullWidth
      />
    </SimpleForm>
  </Edit>
);

export const EmployeeCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput source="email" validate={[required(), email()]} fullWidth />
      <TextInput source="password" type="password" validate={required()} fullWidth />
      <ReferenceInput source="dept_id" reference="departments">
        <SelectInput optionText="name" validate={required()} fullWidth />
      </ReferenceInput>
      <ReferenceInput source="position_id" reference="positions">
        <SelectInput optionText="name" validate={required()} fullWidth />
      </ReferenceInput>
      <SelectInput
        source="role"
        choices={[
          { id: 'admin', name: 'Admin' },
          { id: 'employee', name: 'Employee' },
        ]}
        validate={required()}
        defaultValue="employee"
        fullWidth
      />
    </SimpleForm>
  </Create>
);