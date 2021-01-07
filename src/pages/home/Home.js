import './Home.scss'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const Home = () => {
	const { user } = useContext(AuthContext)

	return (
		<div id="home">
			<h1>Welcome to Photo Review</h1>

			{
				!user && (
					<div className="auth-options">
						<Link to="/signin">
							<button>Sign in</button>
						</Link>
						<Link to="/signup">
							<button>Sign up</button>
						</Link>
					</div>
				)
			}
			
		</div>
	)
}

export default Home
