import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <div className={`flex flex-col` }>
      <Navbar />
        <main>
          <Outlet/>
          <Toaster/>
        </main>
      <Footer/>
    </div>
  )
}

export default App