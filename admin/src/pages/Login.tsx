import { IoLogoReact } from 'react-icons/io5'
import ErrorTip from '../components/form/ErrorTip'
import FormGroup from '../components/form/FormGroup'
import Label from '../components/form/Label'
import { useValidator } from 'react-iii-validator'
import { useEffect, useState } from 'react'
import { ValidatorConfig } from '../config/ValidatorConfig'
import Button from '../components/common/Button'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthentication } from '../components/authentication/AuthContextProvider'

const Login = () => {
  const Validator = useValidator(ValidatorConfig)
  const { user, login } = useAuthentication()
  const navigate = useNavigate()
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    console.log(`log ::: page: Login`)
    Validator.initialize()
  }, [])
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(`log ::: handleSubmit`)
    setError('')
    
    Validator.validate()
    if (Validator.getErrorStatus()) {
      setLoading(true)
      const { email, password }: any = event.currentTarget.elements
      
      try {
        await login(email.value, password.value)
        navigate('/dashboard')
      } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
      } finally {
        setLoading(false)
      }
    }
  }
  
  return user ? (
    <Navigate to='/dashboard' />
  ) : (
    <div className={`p-30 mx-auto max-w-500 w-100p flex-grow flex justify-center items-center`}>
      <div className={`w-100p rounded-8 border border-black-300 p-30`}>
        <div className={`h-200p flex justify-center items-center`}>
          <IoLogoReact size={80} />
        </div>
        <form className={`mt-30`} onSubmit={handleSubmit}>
          {error && (
            <div className="mb-20 p-10 bg-red-100 border border-red-400 text-red-700 rounded-4">
              {error}
            </div>
          )}
          
          <FormGroup>
            <Label displayText={'Email Address'} className={`font-bold`} asterisk={true} />
            <input
              name={`email`}
              type={`text`}
              autoComplete={`email`}
              className={`w-100p p-8 rounded-4 border outline-none mt-10 validate validations::required:email`}
              onChange={() => isSubmitButtonClicked && Validator.validate()}
            />
            <ErrorTip />
          </FormGroup>
          <FormGroup className={`mt-20`}>
            <Label displayText={`Password`} className={`font-bold`} asterisk={true} />
            <input
              name={`password`}
              type={`password`}
              autoComplete={`current-password`}
              className={`w-100p p-8 rounded-4 border outline-none mt-10 validate validations::required`}
              onChange={() => isSubmitButtonClicked && Validator.validate()}
            />
            <ErrorTip />
          </FormGroup>
          <div className={`mt-30 flex justify-center`}>
            <Button 
              size={`large`} 
              color={`gray`} 
              type={`submit`} 
              displayText={loading ? 'Logging in...' : 'Login'} 
              className={`justify-center`} 
              onClick={() => setIsSubmitButtonClicked(true)} 
              disabled={loading}
            />
          </div>
        </form>
        <div className={`mt-30 flex justify-center`}>
          <Link to={`/reset-password`} className={`underline`}>
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
