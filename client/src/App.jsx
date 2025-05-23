import Home from "./component/Home"
import {BrowserRouter,Routes ,Route } from "react-router-dom"
import Navbar from "./component/Navbar"
import PersonForm from "./component/PersonForm"
import Invitation from "./component/Invitation"
import AddInvitation from "./component/AddInvitaion"
// import Nav from "./component/Nav"


function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/addInfo" element={<PersonForm/>} />
        <Route path="/invitation" element={<Invitation/>} />
         <Route path="/addinvite" element={<AddInvitation/>} />
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
