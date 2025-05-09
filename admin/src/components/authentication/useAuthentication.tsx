import { useContext } from 'react'
import { AuthContext } from './AuthContextProvider'

export const useAuthentication = () => {
	const auth = useContext(AuthContext)
	return { auth: auth, isAuthenticated: auth.user != null }
}
