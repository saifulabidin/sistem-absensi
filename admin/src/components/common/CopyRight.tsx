type Props = {
	className?: string
}

const CopyRight = ({ className }: Props) => {
	const year = new Date().getFullYear()
	return (
		<div className={`${className ?? ''} py-15 flex justify-center border-t border-black-300`}>
			<p className={`text-10`}>&copy; {year} Sabidzpro All Rights Reserved.</p>
		</div>
	)
}

export default CopyRight
