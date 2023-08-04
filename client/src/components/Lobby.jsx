import { useEffect } from "react";
import { useSelector } from 'react-redux'
import Layout from "./Layout"
import Navbar from "./navbar/Navbar";

const Lobby = () => {
  const { userInfo } = useSelector( (state) => state.auth )

  

  return (
    <>
        <Navbar/>
        <Layout />
    </>

  )
}

export default Lobby