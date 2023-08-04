import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const Navigate = useNavigate()

  const handleClick = () => {
    Navigate('login')
  }

  return (
    <div>
        <p>Welcome to </p>
        <h1>The Golden Nugget !</h1>
        <Link to='login'>Login</Link>
        <Link to='mockups'>Mockups</Link>
    </div>
  )
}

export default Hero