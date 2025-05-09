import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthenticatedGuard from './components/authentication/AuthenticatedGuard'
import UnauthenticatedGuard from './components/authentication/UnauthenticatedGuard'
import DefaultLayout from './layouts/DefaultLayout'
import FooterOnlyLayout from './layouts/FooterOnlyLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import UsersIndex from './pages/users/UsersIndex'
import ResetPassword from './pages/ResetPassword'

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<UnauthenticatedGuard />}>
          <Route element={<FooterOnlyLayout />}>
            <Route path='/' element={<Navigate to='login' />} />
            <Route path='login' element={<Login />} />
            <Route path='reset-password' element={<ResetPassword />} />
          </Route>
        </Route>
        
        {/* Protected Routes */}
        <Route element={<AuthenticatedGuard />}>
          <Route element={<DefaultLayout />}>
            <Route path='/' element={<Navigate to='dashboard' />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='users' element={<UsersIndex />} />
          </Route>
        </Route>
        
        {/* 404 Page */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routers
