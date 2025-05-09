import { IoMdLogOut } from 'react-icons/io'
import { RiUserFill } from 'react-icons/ri'
import { HiX } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthentication } from '../authentication/useAuthentication'
import { SidebarConfig } from '../../config/SidebarConfig'

type Props = {
  className?: string,
  isOpen?: boolean,
  toggleSidebar?: () => void,
  isMobile?: boolean
}

const Sidebar = ({ className, isOpen, toggleSidebar, isMobile = false }: Props) => {
  const { user, logout } = useAuthentication()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    console.log(`log ::: handleLogout`)
    if (toggleSidebar) {
      toggleSidebar() // Close the sidebar
    }
    logout()
    navigate('/login')
  }
  
  // Different styling for mobile vs desktop sidebar
  const mobileClasses = {
    visibility: isOpen ? 'ml-0' : 'ml-minus-320', // Full coverage on mobile
    width: 'w-320'
  }
  
  const desktopClasses = {
    visibility: isOpen ? 'ml-0' : 'ml-minus-270', // Partial width on desktop
    width: 'w-270' // Slightly narrower width on desktop
  }
  
  // Apply the appropriate classes based on device
  const responsiveClasses = isMobile ? mobileClasses : desktopClasses
  
  return (
    <>
      {/* Overlay - only show on mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    
      <nav className={`${className ?? ''} bg-black-800 h-100vh ${responsiveClasses.width} ${responsiveClasses.visibility} fixed z-40 duration-300 flex flex-col text-12 shadow-xl`}>
        <div className="flex items-center justify-between p-4 md:p-5">
          {/* User Profile */}
          <div className="flex items-center">
            <div className="bg-theme shadow-theme rounded-100vh flex items-center justify-center w-8 h-8 md:w-9 md:h-9">
              <RiUserFill size={20} />
            </div>
            <div className="ml-3">
              <p className="font-medium text-xs md:text-sm">{user?.name || 'User'}</p>
              <p className="text-gray-400 text-xs">{user?.email || 'No email'}</p>
              <p className="text-theme text-10 mt-1">{user?.role?.toUpperCase()}</p>
            </div>
          </div>
          
          {/* Close button - Visible for all screen sizes */}
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 rounded-full hover:bg-theme hover:bg-opacity-20 transition-colors"
          >
            <HiX size={20} className="text-white" />
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="flex-grow p-3 md:p-4 overflow-y-auto custom-scrollbar">
          <ul>
            {SidebarConfig.map((category, categoryIndex) => (
              <li key={categoryIndex} className={categoryIndex ? 'mt-5 md:mt-6' : ''}>
                <p className="text-gray-500 px-2 md:px-3 text-xs uppercase font-medium">{category.categoryName}</p>
                <ul className="mt-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link 
                        to={item.path} 
                        className="p-2 md:p-3 flex items-center rounded hover:bg-theme hover:shadow-theme duration-300 group"
                        onClick={toggleSidebar}
                      >
                        <div className="text-gray-400 group-hover:text-white">{item.icon}</div>
                        <p className="pl-2 text-xs md:text-sm group-hover:text-white">{item.name}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="mt-5 md:mt-6">
              <p className="text-gray-500 px-2 md:px-3 text-xs uppercase font-medium">Others</p>
              <ul className="mt-2">
                <li className="p-2 md:p-3 flex items-center rounded hover:bg-theme hover:shadow-theme duration-300 cursor-pointer group" onClick={handleLogout}>
                  <IoMdLogOut size={16} className="text-gray-400 group-hover:text-white" />
                  <p className="pl-2 text-xs md:text-sm group-hover:text-white">Logout</p>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Sidebar
