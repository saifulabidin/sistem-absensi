import { BsFillGridFill } from 'react-icons/bs'
import { RiSettings5Fill, RiTimer2Line } from 'react-icons/ri'
import { CgAddR } from 'react-icons/cg'
import { FaStickyNote } from 'react-icons/fa'
import { HiUserGroup } from 'react-icons/hi'

export const SidebarConfig = [
	{
		categoryName: 'Overview',
		items: [
			{
				name: 'Dashboard',
				path: 'dashboard',
				icon: <BsFillGridFill size={16} />,
			},
		],
	},
	{
		categoryName: 'Applications',
		items: [
			{
				name: 'Index',
				path: 'applications',
				icon: <FaStickyNote size={16} />,
			},
		],
	},
	{
		categoryName: 'Users',
		items: [
			{
				name: 'Index',
				path: 'users',
				icon: <HiUserGroup size={16} />,
			},
			{
				name: 'Register',
				path: 'users/register',
				icon: <CgAddR size={16} />,
			},
		],
	},
	{
		categoryName: 'Records',
		items: [
			{
				name: 'Index',
				path: 'records',
				icon: <RiTimer2Line size={16} />,
			},
		],
	},
]
