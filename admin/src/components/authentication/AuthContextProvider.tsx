import { onAuthStateChanged } from '@firebase/auth'
import { User } from 'firebase/auth'
import { useState, useEffect, createContext, useContext } from 'react'
import { getFirebaseAuth } from '../../firebase/Firebase'

type AuthContextProps = {
	user: User | null
}

export const AuthContext = createContext({} as AuthContextProps)
export const useAuthContext = () => useContext(AuthContext)

type AuthContextProviderProps = {
	children: JSX.Element
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
	const [user, setUser] = useState<User | null>(getFirebaseAuth().currentUser)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
			console.log(`log ::: AuthContextProvider / isAuthenticated: ${!!user}`)
			setUser(user)
			setIsLoading(false)
		})
		return unsubscribe
	}, [])
	return <AuthContext.Provider value={{ user }}>{!isLoading && children}</AuthContext.Provider>
}
