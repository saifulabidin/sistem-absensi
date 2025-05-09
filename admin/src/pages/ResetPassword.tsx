import { IoLogoReact } from 'react-icons/io5'
import ErrorTip from '../components/form/ErrorTip'
import FormGroup from '../components/form/FormGroup'
import Label from '../components/form/Label'
import { useValidator } from 'react-iii-validator'
import { useEffect, useState } from 'react'
import { ValidatorConfig } from '../config/ValidatorConfig'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import authService from '../services/auth.service'

const ResetPassword = () => {
  const Validator = useValidator(ValidatorConfig)
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  useEffect(() => {
    console.log(`log ::: page: ResetPassword`)
    Validator.initialize()
  }, [])
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(`log ::: handleSubmit`)
    setError('')
    setSuccess(false)
    
    Validator.validate()
    if (Validator.getErrorStatus()) {
      setLoading(true)
      const { email }: any = event.currentTarget.elements
      
      try {
        await authService.resetPassword(email.value)
        setSuccess(true)
      } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to reset password. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
  }
  
  return (
    <div className={`p-30 mx-auto max-w-500 w-100p flex-grow flex justify-center items-center`}>
      <div className={`w-100p rounded-8 border border-black-300 p-30`}>
        <div className={`h-150p flex justify-center items-center`}>
          <IoLogoReact size={80} />
        </div>
        <h1 className="text-24 text-center font-bold mb-20">Reset Password</h1>
        
        {success ? (
          <div className="text-center">
            <div className="mb-20 p-10 bg-green-100 border border-green-400 text-green-700 rounded-4">
              Password reset instructions have been sent to your email address.
            </div>
            <Link to="/login" className="text-theme underline">
              Return to login
            </Link>
          </div>
        ) : (
          <form className={`mt-30`} onSubmit={handleSubmit}>
            {error && (
              <div className="mb-20 p-10 bg-red-100 border border-red-400 text-red-700 rounded-4">
                {error}
              </div>
            )}
            
            <p className="mb-15">
              Enter your email address below and we'll send you instructions to reset your password.
            </p>
            
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
            
            <div className={`mt-30 flex justify-center`}>
              <Button 
                size={`large`} 
                color={`gray`} 
                type={`submit`} 
                displayText={loading ? 'Sending...' : 'Reset Password'} 
                className={`justify-center`} 
                onClick={() => setIsSubmitButtonClicked(true)} 
                disabled={loading}
              />
            </div>
            
            <div className={`mt-20 text-center`}>
              <Link to={`/login`} className={`text-theme underline`}>
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
