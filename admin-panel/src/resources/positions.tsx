import {
  List,
  Datagrid,
  TextField,
  NumberField,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  Create,
  required,
  EditButton,
  DeleteButton,
  DateField
} from 'react-admin';

export const PositionList = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <NumberField source="level" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const PositionEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <NumberInput source="level" min={1} max={10} validate={required()} />
    </SimpleForm>
  </Edit>
);

export const PositionCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <NumberInput source="level" min={1} max={10} defaultValue={1} validate={required()} />
    </SimpleForm>
  </Create>
);