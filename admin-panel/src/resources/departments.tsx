import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  required,
  EditButton,
  DeleteButton,
  DateField
} from 'react-admin';

export const DepartmentList = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const DepartmentEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
    </SimpleForm>
  </Edit>
);

export const DepartmentCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
    </SimpleForm>
  </Create>
);