
import * as CommonTypes from '../../../types/CommonTypes'

type Props = {
	priority: CommonTypes.PrioritiesType
	displayText: string
	className?: string
}

const CardHeader = ({ priority, displayText, className }: Props) => {
	const getPriorityClass = () => {
		switch (priority) {
			case 'primary':
				return 'text-14'
			case 'secondary':
				return 'text-12'
			case 'tertiary':
				return 'text-10'
		}
	}
	return <p className={`${className ?? ''} ${getPriorityClass()} text-black-500`}>{displayText}</p>
}

export default CardHeader
