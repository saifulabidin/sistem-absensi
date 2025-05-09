type Props = {
	className?: string
	children?: any
}

const Dividers = ({ className, children }: Props) => {
	return <div className={`${className ?? ''} flex flex-wrap`}>{children}</div>
}

export default Dividers
