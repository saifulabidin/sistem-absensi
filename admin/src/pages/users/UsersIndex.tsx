import { useEffect, useState } from 'react'
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Card from '../../components/common/card/Card'
import CardHeader from '../../components/common/card/CardHeader'
import Divider from '../../components/common/Divider'
import Dividers from '../../components/common/Dividers'
import employeeService, { Employee } from '../../services/employee.service'
import Button from '../../components/common/Button'

const UsersIndex = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const data = await employeeService.getAllEmployees()
      setEmployees(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError('Failed to load employees. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id)
        // Refresh the list after deletion
        fetchEmployees()
      } catch (err) {
        console.error('Error deleting employee:', err)
        setError('Failed to delete employee. Please try again.')
      }
    }
  }

  return (
    <Dividers className={`relative h-100p mt-minus-30 ml-minus-30`}>
      <Divider className={`max-h-[calc(100%+30px)] pt-30 pl-30`} base={8}>
        <Card className={`overflow-y-scroll max-h-100p`}>
          <div className="flex justify-between items-center">
            <CardHeader priority={'primary'} displayText={'Employees'} />
            <Link to="/users/add">
              <Button size="small" color="theme" displayText="Add Employee" />
            </Link>
          </div>
          
          {loading ? (
            <div className="p-20 text-center">Loading employees...</div>
          ) : error ? (
            <div className="p-20 text-red-500 text-center">{error}</div>
          ) : (
            <table className={`w-100p mt-20`}>
              <thead>
                <tr className="text-left border-b border-black-300">
                  <th className="py-10 px-15">Name</th>
                  <th className="py-10 px-15">Email</th>
                  <th className="py-10 px-15">Role</th>
                  <th className="py-10 px-15">Department</th>
                  <th className="py-10 px-15">Position</th>
                  <th className="py-10 px-15 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-black-300">
                      <td className="py-10 px-15">{employee.name}</td>
                      <td className="py-10 px-15">{employee.email}</td>
                      <td className="py-10 px-15">{employee.role}</td>
                      <td className="py-10 px-15">{employee.department?.name || '-'}</td>
                      <td className="py-10 px-15">{employee.position?.name || '-'}</td>
                      <td className="py-10 px-15 text-right">
                        <div className="flex justify-end">
                          <Link to={`/users/edit/${employee.id}`} className="p-8 rounded-8 hover:bg-theme hover:shadow-theme duration-300">
                            <RiEdit2Line size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(employee.id)} 
                            className="p-8 rounded-8 hover:bg-red-500 hover:text-white duration-300 ml-5"
                          >
                            <RiDeleteBin6Line size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </Card>
      </Divider>
      <Divider className={`pt-30 pl-30`} base={4}>
        <Card>
          <CardHeader priority={'primary'} displayText={'Filtering'} />
          {/* Add filtering options here */}
        </Card>
      </Divider>
    </Dividers>
  )
}

export default UsersIndex
