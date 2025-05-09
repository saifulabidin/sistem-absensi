import { Outlet } from 'react-router-dom'
import CopyRight from '../components/common/CopyRight'
import ScrollToTop from '../libraries/ScrollToTop'

type Props = {
	children?: any
}

const FooterOnlyLayout = ({ children }: Props) => {
	return (
		<>
			<ScrollToTop />
			<main className={`min-h-[calc(100vh-45px)] flex flex-col text-black-700`}>{<Outlet />}</main>
			<CopyRight className={`text-black-300`} />
		</>
	)
}

export default FooterOnlyLayout
