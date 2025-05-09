import { User } from 'firebase/auth'
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

type Props = {
	user: User | null
	redirectPath?: string
}

const UnauthenticatedGuard = ({ user, redirectPath = '/dashboard' }: Props) => {
	useEffect(() => {
		console.log(`log ::: UnauthenticatedGuard / user: ${user}`)
	}, [])
	return user ? <Navigate to={redirectPath} replace /> : <Outlet />
}

export default UnauthenticatedGuard
