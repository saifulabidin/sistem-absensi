import { ReactNode } from 'react';

type Props = {
	className?: string
	children: ReactNode
	hasShadow?: boolean
	hover?: boolean
	borderTop?: boolean
	borderTopColor?: string
}

const Card = ({ 
	className, 
	children, 
	hasShadow = true,
	hover = false,
	borderTop = false,
	borderTopColor = 'theme'
}: Props) => {
	return (
		<div className={`
			${className ?? ''} 
			p-4 sm:p-5 md:p-6
			bg-black-800 
			text-white
			w-full 
			rounded-xl 
			border border-gray-800
			${hasShadow ? 'shadow-lg hover:shadow-xl transition-all duration-300' : ''}
			${hover ? 'transform hover:-translate-y-1 transition-transform duration-300' : ''}
			${borderTop ? `border-t-4 border-t-${borderTopColor}` : ''}
			relative overflow-hidden
		`}>
			{/* Subtle gradient overlay for depth */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-transparent opacity-5 pointer-events-none"></div>
			
			{/* Content */}
			<div className="relative z-10">
				{children}
			</div>
		</div>
	)
}

export default Card
