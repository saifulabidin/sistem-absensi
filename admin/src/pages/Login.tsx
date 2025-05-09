import { IoLogoReact } from 'react-icons/io5'
import ErrorTip from '../components/form/ErrorTip'
import FormGroup from '../components/form/FormGroup'
import Label from '../components/form/Label'
import { useValidator } from 'react-iii-validator'
import { useEffect, useState } from 'react'
import { ValidatorConfig } from '../config/ValidatorConfig'
import Button from '../components/common/Button'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AnchorButton from '../components/common/AnchorButton'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getFirebaseAuth } from '../firebase/Firebase'
import { useAuthentication } from '../components/authentication/useAuthentication'

const Login = () => {
	const Validator = useValidator(ValidatorConfig)
	const { auth } = useAuthentication()
	const navigate = useNavigate()
	const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false)
	useEffect(() => {
		console.log(`log ::: page: Login`)
		Validator.initialize()
	}, [])
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		console.log(`log ::: handleSubmit`)
		Validator.validate()
		if (Validator.getErrorStatus()) {
			const { email, password }: any = event.currentTarget.elements
			await signInWithEmailAndPassword(getFirebaseAuth(), email.value, password.value)
				.then((response) => {
					console.log(`log ::: signInWithEmailAndPassword / success`)
					navigate('/dashboard')
				})
				.catch((error) => console.log(error))
		}
	}
	return auth.user ? (
		<Navigate to='/dashboard' />
	) : (
		<div className={`p-30 mx-auto max-w-500 w-100p flex-grow flex justify-center items-center`}>
			<div className={`w-100p rounded-8 border border-black-300 p-30`}>
				<div className={`h-200p flex justify-center items-center`}>
					<IoLogoReact size={80} />
				</div>
				<form className={`mt-30`} onSubmit={handleSubmit}>
					<FormGroup>
						<Label displayText={'メールアドレス'} className={`font-bold`} asterisk={true} />
						<input
							name={`email`}
							type={`text`}
							autoComplete={`new-password`}
							className={`w-100p p-8 rounded-4 border outline-none mt-10 validate validations::required:email`}
							onChange={() => isSubmitButtonClicked && Validator.validate()}
						/>
						<ErrorTip />
					</FormGroup>
					<FormGroup className={`mt-20`}>
						<Label displayText={`パスワード`} className={`font-bold`} asterisk={true} />
						<input
							name={`password`}
							type={`password`}
							autoComplete={`new-password`}
							className={`w-100p p-8 rounded-4 border outline-none mt-10 validate validations::required`}
							onChange={() => isSubmitButtonClicked && Validator.validate()}
						/>
						<ErrorTip />
					</FormGroup>
					<div className={`mt-30 flex justify-center`}>
						<Button size={`large`} color={`gray`} type={`submit`} displayText={`ログイン`} className={`justify-center`} onClick={() => setIsSubmitButtonClicked(true)} />
					</div>
				</form>
				<div className={`mt-30 flex justify-center`}>
					<Link to={`/reset-password`} className={`underline`}>
						パスワードを忘れた方はこちら
					</Link>
				</div>
				<div className={`flex items-center mt-30`}>
					<div className={`flex-grow h-1 bg-black-300`}></div>
					<p className={`mx-20`}>or</p>
					<div className={`flex-grow h-1 bg-black-300`}></div>
				</div>
				<div className={`mt-30 flex justify-center`}>
					<AnchorButton size={`large`} color={`gray`} bordered={true} displayText={`アカウント新規作成`} className={`justify-center`} href={'/register'} />
				</div>
			</div>
		</div>
	)
}

export default Login
