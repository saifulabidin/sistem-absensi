import { SizesType, ColorsType } from '../../types/CommonTypes'
import { IconType } from 'react-icons/lib/cjs/iconBase'
import { Link } from 'react-router-dom'

type _Props = {
	size: SizesType
	color: ColorsType
	href: string
	displayText: string
	Icon?: IconType
	iconPosition?: 'left' | 'right'
	bordered?: boolean
	className?: string
	onClick?: any
}

const AnchorButton = ({ size, color, href, displayText, Icon, iconPosition, bordered, className }: _Props): JSX.Element => {
	const sizeClasses = () => {
		switch (size) {
			case 'small':
				return 'px-15 py-4 text-12'
			case 'medium':
				return 'px-30 py-8 text-14'
			case 'large':
				return 'px-45 py-10 text-16'
		}
	}
	const colorClasses = () => {
		switch (color) {
			case 'blue':
				return 'text-white bg-blue-700'
			case 'green':
				return 'text-white bg-green-700'
			case 'yellow':
				return 'text-white bg-yellow-700'
			case 'orange':
				return 'text-white bg-orange-700'
			case 'red':
				return 'text-white bg-red-700'
			case 'pink':
				return 'text-white bg-pink-700'
			case 'gray':
				return bordered ? 'border border-black-700' : 'text-white bg-black-700'
			case 'light-gray':
				return 'text-white bg-black-300'
			case 'theme':
				return bordered ? 'border border-theme' : 'text-white bg-theme'
			case 'theme-light':
				return 'text-white bg-theme-light'
		}
	}
	return (
		<Link to={href} className={`${sizeClasses()} ${colorClasses()} ${className ? className : ''} rounded-100vh flex items-center transition-all duration-300 hover:brightness-105`}>
			{Icon && iconPosition == 'left' && <Icon className={`mr-8`} size={20} />}
			<span>{displayText}</span>
			{Icon && iconPosition == 'right' && <Icon className={`ml-8`} size={20} />}
		</Link>
	)
}

export default AnchorButton
