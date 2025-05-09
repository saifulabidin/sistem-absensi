type Props = {
	className?: string
	children: any
}

const FormGroup = ({ className, children }: Props) => {
	return <div className={`${className ?? ''} form-group`}>{children}</div>
}

export default FormGroup
