import { IoMdLogOut } from 'react-icons/io'
import { RiUserFill } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthentication } from '../authentication/useAuthentication'
import { SidebarConfig } from '../../config/SidebarConfig'

type Props = {
  className?: string
}

const Sidebar = ({ className }: Props) => {
  const { user, logout } = useAuthentication()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    console.log(`log ::: handleLogout`)
    logout()
    navigate('/login')
  }
  
  return (
    <nav className={`${className ?? ''} bg-black-800 h-100vh w-320 ml-minus-320 xl:ml-0 duration-300 flex flex-col text-12`}>
      <div className={`flex items-center p-35`}>
        <div className={`bg-theme shadow-theme rounded-100vh flex items-center justify-center w-36 h-36`}>
          <RiUserFill size={24} />
        </div>
        <div className={`ml-15`}>
          <p>{user?.name || 'User'}</p>
          <p>{user?.email || 'No email'}</p>
          <p className="text-theme text-10 mt-2">{user?.role?.toUpperCase()}</p>
        </div>
      </div>
      <div className={`flex-grow p-20 overflow-y-scroll`}>
        <ul>
          {SidebarConfig.map((category, categoryIndex) => (
            <li key={categoryIndex} className={categoryIndex ? 'mt-30' : ''}>
              <p className={`text-black-500 px-15`}>{category.categoryName}</p>
              <ul className={`mt-10`}>
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link to={item.path} className={`p-15 flex items-center rounded-8 hover:bg-theme hover:shadow-theme duration-300`}>
                      {item.icon}
                      <p className={`pl-10`}>{item.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className={`mt-30`}>
            <p className={`text-black-500 px-15`}>Others</p>
            <ul className={`mt-10`}>
              <li className={`p-15 flex items-center rounded-8 hover:bg-theme hover:shadow-theme duration-300 cursor-pointer`} onClick={handleLogout}>
                <IoMdLogOut size={16} />
                <p className={`pl-10`}>Logout</p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Sidebar
