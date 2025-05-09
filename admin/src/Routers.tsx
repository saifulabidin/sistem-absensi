import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AuthenticatedGuard from './components/authentication/AuthenticatedGuard'
import UnauthenticatedGuard from './components/authentication/UnauthenticatedGuard'
import { useAuthentication } from './components/authentication/useAuthentication'
import DefaultLayout from './layouts/DefaultLayout'
import FooterOnlyLayout from './layouts/FooterOnlyLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import UsersIndex from './pages/users/UsersIndex'

const Routers = () => {
	const { auth } = useAuthentication()
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<UnauthenticatedGuard user={auth.user} />}>
					<Route element={<FooterOnlyLayout />}>
						<Route path='/' element={<Navigate to='login' />} />
						<Route path='login' element={<Login />} />
						<Route path='register' element={<Register />} />
					</Route>
				</Route>
				<Route element={<AuthenticatedGuard user={auth.user} />}>
					<Route element={<DefaultLayout />}>
						<Route path={'/'} element={<Navigate to='dashboard' />} />
						<Route path={'dashboard'} element={<Dashboard />} />
						<Route path={'users'} element={<UsersIndex />} />
					</Route>
				</Route>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}

export default Routers
