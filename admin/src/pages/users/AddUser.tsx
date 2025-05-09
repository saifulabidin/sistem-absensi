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

const AddUser = () => {
  const navigate = useNavigate()
  const Validator = useValidator(ValidatorConfig)
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [departments, setDepartments] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [showImportForm, setShowImportForm] = useState(false)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<any>(null)
  
  // Fetch departments and positions for dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depts, pos] = await Promise.all([
          departmentService.getAllDepartments(),
          positionService.getAllPositions()
        ])
        setDepartments(depts)
        setPositions(pos)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load departments and positions. Please try again.')
      }
    }
    
    fetchData()
    Validator.initialize()
  }, [])
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    
    Validator.validate()
    if (Validator.getErrorStatus()) {
      setLoading(true)
      try {
        const formElements = event.currentTarget.elements as any
        
        const employee = {
          name: formElements.name.value,
          email: formElements.email.value,
          password: formElements.password.value,
          role: formElements.role.value,
          position_id: formElements.position_id.value || undefined,
          dept_id: formElements.dept_id.value || undefined
        }
        
        await employeeService.createEmployee(employee)
        setSuccess('Employee added successfully!')
        
        // Reset the form
        event.currentTarget.reset()
        Validator.initialize()
        
        setTimeout(() => {
          navigate('/users')
        }, 2000)
      } catch (err: any) {
        console.error('Error adding employee:', err)
        setError(err.response?.data?.message || 'Failed to add employee. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setExcelFile(files[0])
    }
  }
  
  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!excelFile) {
      setError('Please select an Excel file to import')
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(null)
    setImportResult(null)
    
    try {
      const result = await employeeService.importEmployees(excelFile)
      setImportResult(result)
      setSuccess(`Successfully imported ${result.successful.length} employees!`)
    } catch (err: any) {
      console.error('Error importing employees:', err)
      setError(err.response?.data?.message || 'Failed to import employees. Please check your file format.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDownloadTemplate = async () => {
    try {
      const blob = await employeeService.exportEmployees('excel')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'employees-template.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading template:', err)
      setError('Failed to download template. Please try again.')
    }
  }
  
  const toggleImportForm = () => {
    setShowImportForm(!showImportForm)
    setError(null)
    setSuccess(null)
    setImportResult(null)
  }
  
  return (
    <Dividers className={`relative h-100p mt-minus-30 ml-minus-30`}>
      <Divider className={`max-h-[calc(100%+30px)] pt-30 pl-30`} base={12}>
        <Card>
          <CardHeader priority={'primary'} displayText={showImportForm ? 'Import Employees' : 'Add Employee'} />
          
          <div className="mt-4 mb-6 flex justify-end space-x-4">
            <Button 
              size="small"
              color={showImportForm ? "theme" : "gray"}
              type="button"
              displayText="Manual Input"
              onClick={() => setShowImportForm(false)}
            />
            <Button 
              size="small"
              color={!showImportForm ? "theme" : "gray"}
              type="button"
              displayText="Import from Excel"
              onClick={() => setShowImportForm(true)}
            />
          </div>
          
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
          
          {!showImportForm ? (
            // Manual input form
            <form onSubmit={handleSubmit} className="px-4">
              <FormGroup>
                <Label displayText={'Name'} className={`font-bold`} asterisk={true} />
                <input 
                  name="name"
                  type="text" 
                  className={`w-full p-2 rounded border outline-none mt-2 validate validations::required`}
                  onChange={() => isSubmitButtonClicked && Validator.validate('name')}
                />
                <ErrorTip />
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
                  Password must be at least 6 characters for employees.
                </p>
              </FormGroup>
              
              <FormGroup className="mt-4">
                <Label displayText={'Role'} className={`font-bold`} asterisk={true} />
                <select 
                  name="role"
                  className={`w-full p-2 rounded border outline-none mt-2`}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </FormGroup>
              
              <FormGroup className="mt-4">
                <Label displayText={'Department'} className={`font-bold`} />
                <select 
                  name="dept_id"
                  className={`w-full p-2 rounded border outline-none mt-2`}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </FormGroup>
              
              <FormGroup className="mt-4">
                <Label displayText={'Position'} className={`font-bold`} />
                <select 
                  name="position_id"
                  className={`w-full p-2 rounded border outline-none mt-2`}
                >
                  <option value="">-- Select Position --</option>
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.id}>{pos.name}</option>
                  ))}
                </select>
              </FormGroup>
              
              <div className="mt-6 mb-6 flex space-x-4">
                <Button 
                  size="medium"
                  color="theme"
                  type="submit"
                  displayText={loading ? "Adding..." : "Add Employee"}
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
          ) : (
            // Import form
            <div className="px-4">
              <form onSubmit={handleImport}>
                <div className="mb-4">
                  <p className="mb-2">Upload an Excel file with employee data.</p>
                  <p className="text-sm text-gray-500 mb-4">
                    The file should have the following columns: Name, Email, Password, Role, Position ID, Department ID.
                  </p>
                  
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      className="border border-gray-300 p-2 rounded w-full"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-6 mb-6">
                  <Button 
                    size="medium"
                    color="theme"
                    type="submit"
                    displayText={loading ? "Importing..." : "Import Employees"}
                    className={`flex-1 ${(loading || !excelFile) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {}}
                    customAttributes={(loading || !excelFile) ? { disabled: true } : {}}
                  />
                  <Button 
                    size="medium"
                    color="gray"
                    type="button"
                    displayText="Download Template"
                    className="flex-1"
                    onClick={handleDownloadTemplate}
                  />
                </div>
              </form>
              
              {importResult && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-bold text-lg mb-2">Import Results</h3>
                  {importResult.successful && importResult.successful.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-green-600">Successfully imported {importResult.successful.length} employees</h4>
                    </div>
                  )}
                  
                  {importResult.errors && importResult.errors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-red-600">Failed to import {importResult.errors.length} employees</h4>
                      <ul className="list-disc pl-5 mt-2 text-sm">
                        {importResult.errors.slice(0, 5).map((error: any, index: number) => (
                          <li key={index} className="mb-1">
                            Row {error.row}: {error.error}
                          </li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li>... and {importResult.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>
      </Divider>
    </Dividers>
  )
}

export default AddUser
