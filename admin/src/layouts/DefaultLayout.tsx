import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import ScrollToTop from '../libraries/ScrollToTop'
import { HiMenu } from 'react-icons/hi'

const DefaultLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	
	// Detect if we're on mobile for different sidebar behavior
	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768) // md breakpoint
		}
		
		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)
		
		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])
	
	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen)
	}
	
	return (
		<>
			<ScrollToTop />
			<div className="h-100vh w-100p relative flex">
				{/* Sidebar */}
				<Sidebar 
					isOpen={sidebarOpen} 
					toggleSidebar={toggleSidebar}
					isMobile={isMobile}
				/>
				
				{/* Main Content - Note the ml-0 md:ml-[270px] class when sidebar is open */}
				<main className={`flex-1 min-h-100vh bg-black-900 transition-all duration-300 ${
					sidebarOpen && !isMobile ? 'ml-0 md:ml-[270px]' : 'ml-0'
				}`}>
					{/* Hamburger Button - Visible on all screen sizes */}
					<div className="sticky top-0 z-20 bg-black-800 p-4 shadow-md flex items-center">
						<button 
							onClick={toggleSidebar}
							className="p-2 rounded-md hover:bg-theme hover:bg-opacity-20 transition-colors mr-4"
						>
							<HiMenu size={24} className="text-white" />
						</button>
						<h1 className="text-xl font-semibold text-theme">Attendance System</h1>
					</div>
					
					{/* Page Content */}
					<div className="p-4 md:p-6 lg:p-8">
						<Outlet />
					</div>
				</main>
			</div>
		</>
	)
}

export default DefaultLayout
