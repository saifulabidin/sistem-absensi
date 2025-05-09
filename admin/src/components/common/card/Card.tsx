type Props = {
	className?: string
	children: any
}

const Card = ({ className, children }: Props) => {
	return <div className={`${className ?? ''} p-30 bg-black-800 w-100p rounded-12`}>{children}</div>
}

export default Card
