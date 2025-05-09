import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import ScrollToTop from '../libraries/ScrollToTop'

const DefaultLayout = () => {
	return (
		<>
			<ScrollToTop />
			<div className={`h-100vh w-100p flex`}>
				<Sidebar />
				<main className={`flex-grow bg-black-900 min-h-100vh p-30`}>
					<Outlet />
				</main>
				{/* <Footer />
				<Loading className={`min-h-[calc(100vh-126px)] top-126`} /> */}
			</div>
		</>
	)
}

export default DefaultLayout
