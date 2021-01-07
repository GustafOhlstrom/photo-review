import './Navbar.scss'
import React, { useContext, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const Navbar = () => {
	const { user, signOut } = useContext(AuthContext)
	const location = useLocation()

	useEffect(() => {
		// Close burger menu on location change
		document.querySelector('.nav-list') && document.querySelector('.nav-list').classList.remove('nav-display')
        document.querySelector('.burger-menu') && document.querySelector('.burger-menu').classList.remove('burger-toggle')
	}, [location]);

	const handleMenuToggle = () => {
        document.querySelector('.nav-list').classList.toggle('nav-display')
        document.querySelector('.burger-menu').classList.toggle('burger-toggle')
    }
	
	return (
		<nav id="navbar">
			<Link 
				to="/" 
				className="nav-link"
			>
				Photo Review
			</Link>
			
			{
				user && <>
					<ul className="nav-list">
						<li>
							<NavLink 
								to="/" 
								className="nav-link"
								activeClassName="active" 
								end
							>
								Home
							</NavLink>
						</li>
						<li>
							<NavLink 
								to="/galleries" 
								className="nav-link"
								activeClassName="active"
							>
								Galleries
							</NavLink>
						</li>
						<li>
							<Link 
								to="/"
								onClick={signOut}
								className="nav-link"
							>
								Sign out
							</Link>
						</li>
					</ul>

					<div 
						className="burger-menu"
						onClick={handleMenuToggle}
					>
						<div className="line1"></div>
						<div className="line2"></div>
						<div className="line3"></div>
					</div>
				</>
			}
		</nav>
	)
}

export default Navbar
