import Routers from './Routers'
import './app.scss'
import firebase from './firebase/Firebase'
import { AuthContextProvider } from './components/authentication/AuthContextProvider'

function App() {
	return (
		<AuthContextProvider>
			<Routers />
		</AuthContextProvider>
	)
}

export default App
