import { User } from 'firebase/auth'
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

type Props = {
	user: User | null
	redirectPath?: string
}

const AuthenticatedGuard = ({ user, redirectPath = '/login' }: Props) => {
	useEffect(() => {
		console.log(`log ::: AuthenticatedGuard / user: ${user}`)
	}, [])
	return user ? <Outlet /> : <Navigate to={redirectPath} replace />
}

export default AuthenticatedGuard
