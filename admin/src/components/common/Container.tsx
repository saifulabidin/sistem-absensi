type Props = {
	className?: string
	children: any
}

const Container = ({ className, children }: Props) => {
	return <div className={`${className ?? ''} max-w-xl p-30 mx-auto`}>{children}</div>
}

export default Container
