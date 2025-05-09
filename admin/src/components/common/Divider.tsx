type Numerator = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type Props = {
	base: Numerator
	xs?: Numerator
	sm?: Numerator
	md?: Numerator
	lg?: Numerator
	xl?: Numerator
	className?: string
	children?: any
}

const Divider = ({ base, xs, sm, md, lg, xl, className, children }: Props) => {
	const getTailwindCssClass = () => {
		let numeratorClasses = [] as string[]
		switch (base) {
			case 1:
				numeratorClasses.push('w-[calc(100%/12*1)]')
				break
			case 2:
				numeratorClasses.push('w-[calc(100%/12*2)]')
				break
			case 3:
				numeratorClasses.push('w-[calc(100%/12*3)]')
				break
			case 4:
				numeratorClasses.push('w-[calc(100%/12*4)]')
				break
			case 5:
				numeratorClasses.push('w-[calc(100%/12*5)]')
				break
			case 6:
				numeratorClasses.push('w-[calc(100%/12*6)]')
				break
			case 7:
				numeratorClasses.push('w-[calc(100%/12*7)]')
				break
			case 8:
				numeratorClasses.push('w-[calc(100%/12*8)]')
				break
			case 9:
				numeratorClasses.push('w-[calc(100%/12*9)]')
				break
			case 10:
				numeratorClasses.push('w-[calc(100%/12*10)]')
				break
			case 11:
				numeratorClasses.push('w-[calc(100%/12*11)]')
				break
			case 12:
				numeratorClasses.push('w-[calc(100%/12*12)]')
				break
		}
		switch (xs) {
			case 1:
				numeratorClasses.push('xs:w-[calc(100%/12*1)]')
				break
			case 2:
				numeratorClasses.push('xs:w-[calc(100%/12*2)]')
				break
			case 3:
				numeratorClasses.push('xs:w-[calc(100%/12*3)]')
				break
			case 4:
				numeratorClasses.push('xs:w-[calc(100%/12*4)]')
				break
			case 5:
				numeratorClasses.push('xs:w-[calc(100%/12*5)]')
				break
			case 6:
				numeratorClasses.push('xs:w-[calc(100%/12*6)]')
				break
			case 7:
				numeratorClasses.push('xs:w-[calc(100%/12*7)]')
				break
			case 8:
				numeratorClasses.push('xs:w-[calc(100%/12*8)]')
				break
			case 9:
				numeratorClasses.push('xs:w-[calc(100%/12*9)]')
				break
			case 10:
				numeratorClasses.push('xs:w-[calc(100%/12*10)]')
				break
			case 11:
				numeratorClasses.push('xs:w-[calc(100%/12*11)]')
				break
			case 12:
				numeratorClasses.push('xs:w-[calc(100%/12*12)]')
				break
		}
		switch (sm) {
			case 1:
				numeratorClasses.push('sm:w-[calc(100%/12*1)]')
				break
			case 2:
				numeratorClasses.push('sm:w-[calc(100%/12*2)]')
				break
			case 3:
				numeratorClasses.push('sm:w-[calc(100%/12*3)]')
				break
			case 4:
				numeratorClasses.push('sm:w-[calc(100%/12*4)]')
				break
			case 5:
				numeratorClasses.push('sm:w-[calc(100%/12*5)]')
				break
			case 6:
				numeratorClasses.push('sm:w-[calc(100%/12*6)]')
				break
			case 7:
				numeratorClasses.push('sm:w-[calc(100%/12*7)]')
				break
			case 8:
				numeratorClasses.push('sm:w-[calc(100%/12*8)]')
				break
			case 9:
				numeratorClasses.push('sm:w-[calc(100%/12*9)]')
				break
			case 10:
				numeratorClasses.push('sm:w-[calc(100%/12*10)]')
				break
			case 11:
				numeratorClasses.push('sm:w-[calc(100%/12*11)]')
				break
			case 12:
				numeratorClasses.push('sm:w-[calc(100%/12*12)]')
				break
		}
		switch (md) {
			case 1:
				numeratorClasses.push('md:w-[calc(100%/12*1)]')
				break
			case 2:
				numeratorClasses.push('md:w-[calc(100%/12*2)]')
				break
			case 3:
				numeratorClasses.push('md:w-[calc(100%/12*3)]')
				break
			case 4:
				numeratorClasses.push('md:w-[calc(100%/12*4)]')
				break
			case 5:
				numeratorClasses.push('md:w-[calc(100%/12*5)]')
				break
			case 6:
				numeratorClasses.push('md:w-[calc(100%/12*6)]')
				break
			case 7:
				numeratorClasses.push('md:w-[calc(100%/12*7)]')
				break
			case 8:
				numeratorClasses.push('md:w-[calc(100%/12*8)]')
				break
			case 9:
				numeratorClasses.push('md:w-[calc(100%/12*9)]')
				break
			case 10:
				numeratorClasses.push('md:w-[calc(100%/12*10)]')
				break
			case 11:
				numeratorClasses.push('md:w-[calc(100%/12*11)]')
				break
			case 12:
				numeratorClasses.push('md:w-[calc(100%/12*12)]')
				break
		}
		switch (lg) {
			case 1:
				numeratorClasses.push('lg:w-[calc(100%/12*1)]')
				break
			case 2:
				numeratorClasses.push('lg:w-[calc(100%/12*2)]')
				break
			case 3:
				numeratorClasses.push('lg:w-[calc(100%/12*3)]')
				break
			case 4:
				numeratorClasses.push('lg:w-[calc(100%/12*4)]')
				break
			case 5:
				numeratorClasses.push('lg:w-[calc(100%/12*5)]')
				break
			case 6:
				numeratorClasses.push('lg:w-[calc(100%/12*6)]')
				break
			case 7:
				numeratorClasses.push('lg:w-[calc(100%/12*7)]')
				break
			case 8:
				numeratorClasses.push('lg:w-[calc(100%/12*8)]')
				break
			case 9:
				numeratorClasses.push('lg:w-[calc(100%/12*9)]')
				break
			case 10:
				numeratorClasses.push('lg:w-[calc(100%/12*10)]')
				break
			case 11:
				numeratorClasses.push('lg:w-[calc(100%/12*11)]')
				break
			case 12:
				numeratorClasses.push('lg:w-[calc(100%/12*12)]')
				break
		}
		switch (xl) {
			case 1:
				numeratorClasses.push('xl:w-[calc(100%/12*1)]')
				break
			case 2:
				numeratorClasses.push('xl:w-[calc(100%/12*2)]')
				break
			case 3:
				numeratorClasses.push('xl:w-[calc(100%/12*3)]')
				break
			case 4:
				numeratorClasses.push('xl:w-[calc(100%/12*4)]')
				break
			case 5:
				numeratorClasses.push('xl:w-[calc(100%/12*5)]')
				break
			case 6:
				numeratorClasses.push('xl:w-[calc(100%/12*6)]')
				break
			case 7:
				numeratorClasses.push('xl:w-[calc(100%/12*7)]')
				break
			case 8:
				numeratorClasses.push('xl:w-[calc(100%/12*8)]')
				break
			case 9:
				numeratorClasses.push('xl:w-[calc(100%/12*9)]')
				break
			case 10:
				numeratorClasses.push('xl:w-[calc(100%/12*10)]')
				break
			case 11:
				numeratorClasses.push('xl:w-[calc(100%/12*11)]')
				break
			case 12:
				numeratorClasses.push('xl:w-[calc(100%/12*12)]')
				break
		}
		return numeratorClasses
	}
	return <div className={`${getTailwindCssClass().join(' ')} ${className ?? ''}`}>{children}</div>
}

export default Divider
