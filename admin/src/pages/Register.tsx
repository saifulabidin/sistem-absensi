import Container from '../components/common/Container'
import FooterOnlyLayout from '../layouts/FooterOnlyLayout'
import { IoLogoReact } from 'react-icons/io5'
import ErrorTip from '../components/form/ErrorTip'
import FormGroup from '../components/form/FormGroup'
import Label from '../components/form/Label'
import { useValidator } from 'react-iii-validator'
import { useEffect, useState } from 'react'
import { ValidatorConfig } from '../config/ValidatorConfig'
import Button from '../components/common/Button'
import AnchorButton from '../components/common/AnchorButton'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirebaseAuth } from '../firebase/Firebase'
import firebase from '../firebase/Firebase'
import { useNavigate } from 'react-router-dom'
import { UsersFirestore } from '../firebase/firestore/UsersFirestore'
import * as AccountTypes from '../types/AccountTypes'
import { getFirestore, Timestamp } from '@firebase/firestore'

const Register = () => {
	const Validator = useValidator(ValidatorConfig)
	const [auth, setAuth] = useState(getFirebaseAuth())
	const navigate = useNavigate()
	useEffect(() => {
		Validator.initialize()
	}, [])
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		console.log(`log ::: handleSubmit`)
		Validator.validate()
		if (Validator.getErrorStatus()) {
			const { email, password, displayName }: any = event.currentTarget.elements
			await createUserWithEmailAndPassword(auth, email.value, password.value)
				.then(async (response) => {
					console.log(`log ::: createUserWithEmailAndPassword: success`)
					await auth.signOut()
					await updateProfile(response.user, {
						displayName: displayName.value,
					})
					const user: AccountTypes.Account = {
						id: response.user.uid,
						email: email.value,
						password: password.value,
						display_name: displayName.value,
						default_break_time: 1.0,
						created_at: Timestamp.fromDate(new Date()),
					}
					await UsersFirestore.setUser(user)
					navigate('/login')
				})
				.catch((error: firebase.FirebaseError) => console.log(error.code))
		}
	}
	return (
		<div className={`p-30 mx-auto max-w-500 w-100p flex-grow flex justify-center items-center`}>
			<div className={`w-100p rounded-8 border border-black-300 p-30`}>
				<div className={`h-200p flex justify-center items-center`}>
					<IoLogoReact size={80} />
				</div>
				<form className={`mt-30`} onSubmit={handleSubmit}>
					<FormGroup>
						<Label displayText={'表示名'} className={`font-bold`} asterisk={true} />
						<input name={`displayName`} type={`text`} autoComplete={`off`} className={`w-100p p-8 rounded-4 border outline-none mt-10 validate validations::required`} onChange={() => Validator.validate('displayName')} />
						<ErrorTip />
					</FormGroup>
					<FormGroup className={`mt-20`}>
						<Label displayText={'メールアドレス'} className={`font-bold`} asterisk={true} />
						<input name={`email`} type={`text`} autoComplete={`email`} className={`w-100p p-8 rounded-4 border outline-none mt-10 validate validations::required:email`} onChange={() => Validator.validate('email')} />
						<ErrorTip />
					</FormGroup>
					<FormGroup className={`mt-20`}>
						<Label displayText={`パスワード`} className={`font-bold`} asterisk={true} />
						<input name={`password`} type={`password`} autoComplete={`password`} className={`w-100p p-8 rounded-4 border outline-none mt-10 validate validations::required`} onChange={() => Validator.validate('password')} />
						<ErrorTip />
					</FormGroup>
					<FormGroup className={`mt-20`}>
						<Label displayText={`パスワード確認`} className={`font-bold`} asterisk={true} />
						<input
							name={`passwordConfirmation`}
							type={`password`}
							autoComplete={`password`}
							className={`w-100p p-8 rounded-4 border outline-none mt-10 validate validations::required:confirmation confirmationBase::password`}
							onChange={() => Validator.validate('passwordConfirmation')}
						/>
						<ErrorTip />
					</FormGroup>
					<div className={`mt-30 flex justify-center`}>
						<Button size={`large`} color={`gray`} type={`submit`} displayText={`アカウント新規作成`} className={`justify-center`} />
					</div>
				</form>
				<div className={`flex items-center mt-30`}>
					<div className={`flex-grow h-1 bg-black-300`}></div>
					<p className={`mx-20`}>or</p>
					<div className={`flex-grow h-1 bg-black-300`}></div>
				</div>
				<div className={`mt-30 flex justify-center`}>
					<AnchorButton size={`large`} color={`gray`} bordered={true} displayText={`ログイン`} className={`justify-center`} href={'/login'} />
				</div>
			</div>
		</div>
	)
}

export default Register
