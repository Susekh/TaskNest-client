import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { useState } from "react"
import { Toaster } from 'react-hot-toast';


function App() {

  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`${isDark ? "dark" : " "} flex flex-col` }>
      <Navbar isDark={isDark} setIsDark={setIsDark} />
        <main>
          <Outlet/>
          <Toaster/>
        </main>
      <Footer/>
    </div>
  )
}

export default App