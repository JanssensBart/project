import { useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { IoChevronDownCircleOutline } from "react-icons/io5";

const Navbar = () => {

    const { userInfo } = useSelector( (state) => state.auth )

    const Navigate = useNavigate()


  return (
    
    <section>
        <nav  >
            <h1>LOGO</h1>
            <ul>

                <Link to='/lobby'>Lobby</Link>
                <Link to='sitandgo'>Tables</Link>
                <Link to='chat'>General Chat</Link>
                
            </ul>

            <p>Welcome {userInfo.username} <IoChevronDownCircleOutline/></p>
        </nav>
        
    </section>
    
  )
}

export default Navbar