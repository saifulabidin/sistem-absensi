
import * as CommonTypes from '../../../types/CommonTypes'
import { ReactNode } from 'react'

type Props = {
	priority: CommonTypes.PrioritiesType
	displayText: string
	className?: string
	icon?: ReactNode
	action?: ReactNode
}

const CardHeader = ({ priority, displayText, className, icon, action }: Props) => {
	const getPriorityClass = () => {
		switch (priority) {
			case 'primary':
				return 'text-theme';
			case 'secondary':
				return 'text-gray-300';
			case 'tertiary':
				return 'text-gray-400';
			case 'success':
				return 'text-green-400';
			case 'warning':
				return 'text-amber-400';
			case 'danger':
				return 'text-red-400';
			default:
				return 'text-white';
		}
	};
	
	const getBorderClass = () => {
		switch (priority) {
			case 'primary':
				return 'border-theme';
			case 'secondary':
				return 'border-gray-400';
			case 'tertiary':
				return 'border-gray-500';
			case 'success':
				return 'border-green-500';
			case 'warning':
				return 'border-amber-500';
			case 'danger':
				return 'border-red-500';
			default:
				return 'border-theme';
		}
	};
	
	return (
		<div className="flex items-center justify-between mb-4 pb-2 border-b-2" style={{ borderColor: `var(--${getBorderClass().split('-')[1]})` }}>
			<div className="flex items-center">
				{icon && <div className="mr-2">{icon}</div>}
				<h2 className={`text-lg font-semibold ${getPriorityClass()} ${className ?? ''}`}>
					{displayText}
				</h2>
			</div>
			{action && <div>{action}</div>}
		</div>
	);
};

export default CardHeader;
