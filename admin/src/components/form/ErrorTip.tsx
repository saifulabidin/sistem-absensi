type Props = {
	refName?: any
	className?: string
}

const ErrorTip = ({ refName, className }: Props) => {
	return <p ref={refName} className={`${className ?? ''} error-tip text-red-700 text-14 mt-4`}></p>
}

export default ErrorTip
