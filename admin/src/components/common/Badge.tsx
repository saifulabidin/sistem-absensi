import { SizesType, ColorsType } from '../../types/CommonTypes'

type Props = {
	size: SizesType
	color: ColorsType
	displayText: string
	className?: string
}

const Badge = ({ size, color, displayText, className }: Props) => {
	const sizeClasses = () => {
		switch (size) {
			case 'small':
				return 'px-4 py-2 text-12 rounded-2'
			case 'medium':
				return 'px-8 py-4 text-14 rounded-3'
			case 'large':
				return 'px-12 py-6 rounded-4'
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
				return 'text-white bg-black-700'
			case 'light-gray':
				return 'text-white bg-black-300'
			case 'theme':
				return 'text-white bg-theme'
			case 'theme-light':
				return 'text-white bg-theme-light'
		}
	}
	return <span className={`${className ?? ''} ${sizeClasses()} ${colorClasses()} inline-block leading-1em`}>{displayText}</span>
}

export default Badge
