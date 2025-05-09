import { BsAsterisk } from 'react-icons/bs'
import Badge from '../common/Badge'

type Props = {
	displayText: string
	badge?: 'required' | 'optional' | 'readonly'
	asterisk?: boolean
	htmlFor?: string
	className?: string
}

const Label = ({ displayText, badge, asterisk, htmlFor, className }: Props) => {
	return (
		<label htmlFor={htmlFor ? htmlFor : htmlFor} className={`${className ?? ''} block font-bold`}>
			{displayText}
			{badge && (
				<Badge
					size={'medium'}
					color={badge && badge == 'required' ? 'red' : badge == 'optional' ? 'green' : 'gray'}
					displayText={badge && badge == 'required' ? '必須' : badge == 'optional' ? '任意' : badge == 'readonly' ? '編集不可' : displayText}
					className={'ml-8 h-fit'}
				/>
			)}
			{asterisk && <BsAsterisk size={10} className={`inline-block ml-4 mb-4 text-red-700`} />}
		</label>
	)
}

export default Label
