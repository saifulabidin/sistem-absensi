import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/card/Card'
import CardHeader from '../../components/common/card/CardHeader'
import Divider from '../../components/common/Divider'
import Dividers from '../../components/common/Dividers'
import FormGroup from '../../components/form/FormGroup'
import Label from '../../components/form/Label'
import ErrorTip from '../../components/form/ErrorTip'
import Button from '../../components/common/Button'
import { useValidator } from 'react-iii-validator'
import { ValidatorConfig } from '../../config/ValidatorConfig'
import employeeService from '../../services/employee.service'
import departmentService from '../../services/department.service'
import positionService from '../../services/position.service'

const RegisterUser = () => {
  const navigate = useNavigate()
  const Validator = useValidator(ValidatorConfig)
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAllEmployees()
        setEmployees(data)
        setFilteredEmployees(data)
      } catch (err) {
        console.error('Error fetching employees:', err)
        setError('Failed to load employees. Please try again.')
      }
    }
    
    fetchEmployees()
    Validator.initialize()
  }, [])
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredEmployees(filtered)
    } else {
      setFilteredEmployees(employees)
    }
  }, [searchQuery, employees])
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    
    Validator.validate()
    if (Validator.getErrorStatus()) {
      setLoading(true)
      try {
        const formElements = event.currentTarget.elements as any
        
        // Get selected employee ID
        const employee_id = formElements.employee_id.value
        if (!employee_id) {
          throw new Error('Please select an employee')
        }
        
        // Find the employee in the list
        const selectedEmployee = employees.find(emp => emp.id === employee_id)
        if (!selectedEmployee) {
          throw new Error('Selected employee not found')
        }
        
        // Update the employee with login credentials
        const updateData = {
          email: formElements.email.value,
          password: formElements.password.value,
        }
        
        await employeeService.updateEmployee(employee_id, updateData)
        
        setSuccess('Employee registration completed successfully!')
        
        // Reset the form
        event.currentTarget.reset()
        Validator.initialize()
        
        setTimeout(() => {
          navigate('/users')
        }, 2000)
      } catch (err: any) {
        console.error('Error registering employee:', err)
        setError(err.message || err.response?.data?.message || 'Failed to register employee. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }
  
  return (
    <Dividers className={`relative h-100p mt-minus-30 ml-minus-30`}>
      <Divider className={`max-h-[calc(100%+30px)] pt-30 pl-30`} base={12}>
        <Card>
          <CardHeader priority={'primary'} displayText={'Register User'} />
          
          <div className="mt-4 px-4">
            <p className="mb-4">
              Register an existing employee with login credentials for the attendance system mobile app.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <FormGroup className="mt-4">
                <Label displayText={'Search Employee'} className={`font-bold`} />
                <input 
                  type="text" 
                  placeholder="Search by name or email..."
                  className={`w-full p-2 rounded border outline-none mt-2`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup className="mt-4">
                <Label displayText={'Select Employee'} className={`font-bold`} asterisk={true} />
                <select 
                  name="employee_id"
                  className={`w-full p-2 rounded border outline-none mt-2 validate validations::required`}
                  onChange={() => isSubmitButtonClicked && Validator.validate('employee_id')}
                >
                  <option value="">-- Select Employee --</option>
                  {filteredEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department?.name || 'No Department'} - {emp.position?.name || 'No Position'}
                    </option>
                  ))}
                </select>
                <ErrorTip />
                <p className="text-sm text-gray-500 mt-1">
                  Select an employee from the list to register for mobile app access.
                </p>
              </FormGroup>
              
              <FormGroup className="mt-4">
                <Label displayText={'Email'} className={`font-bold`} asterisk={true} />
                <input 
                  name="email"
                  type="email" 
                  className={`w-full p-2 rounded border outline-none mt-2 validate validations::required:email`}
                  onChange={() => isSubmitButtonClicked && Validator.validate('email')}
                />
                <ErrorTip />
                <p className="text-sm text-gray-500 mt-1">
                  This email will be used to log in to the mobile application.
                </p>
              </FormGroup>
              
              <FormGroup className="mt-4">
                <Label displayText={'Password'} className={`font-bold`} asterisk={true} />
                <input 
                  name="password"
                  type="password" 
                  className={`w-full p-2 rounded border outline-none mt-2 validate validations::required`}
                  onChange={() => isSubmitButtonClicked && Validator.validate('password')}
                />
                <ErrorTip />
                <p className="text-sm text-gray-500 mt-1">
                  Password must be at least 6 characters long with a combination of letters and numbers.
                </p>
              </FormGroup>
              
              <div className="mt-6 mb-6 flex space-x-4">
                <Button 
                  size="medium"
                  color="theme"
                  type="submit"
                  displayText={loading ? "Registering..." : "Register User"}
                  className={`flex-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !loading && setIsSubmitButtonClicked(true)}
                  customAttributes={loading ? { disabled: true } : {}}
                />
                <Button 
                  size="medium"
                  color="gray"
                  type="button"
                  displayText="Cancel"
                  className="flex-1"
                  onClick={() => navigate('/users')}
                />
              </div>
            </form>
          </div>
        </Card>
      </Divider>
    </Dividers>
  )
}

export default RegisterUser
