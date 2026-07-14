import EmployeeList from "@/modules/employees/EmployeeList";

export default function UsersPage() {
  return (
    <EmployeeList 
      title="Users" 
      description="Manage system users and roles"
      buttonText="Add User"
    />
  );
}
