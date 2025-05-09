import Routers from './Routers'
import './app.scss'
import { AuthContextProvider } from './components/authentication/AuthContextProvider'

function App() {
  return (
    <AuthContextProvider>
      <Routers />
    </AuthContextProvider>
  )
}

export default App
