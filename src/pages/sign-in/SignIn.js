import './SignIn.scss'
import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Loader from '../../components/loader/Loader'

const SignIn = () => {
	const emailRef = useRef()
	const passwordRef = useRef()
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const { signIn } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		setError(null)

		try {
			setLoading(true)
			await signIn(emailRef.current.value, passwordRef.current.value)
			navigate('/galleries')
		} catch (error) {
			setError("Could not sign in. Please check your email and password.")
			setLoading(false)
		}
	}

	return (
		<div id="signin">
			<h1>Sign in</h1>

			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email"></label>
					<input id="email" type="email" ref={emailRef} placeholder="email"/>
				</div>

				<div>
					<label htmlFor="password"></label>
					<input id="password" type="password" ref={passwordRef} placeholder="password"/>
				</div>
				
				{ error && <p className="error">{error}</p> }

				<button>Sign in</button>
			</form>
			
			{ loading && <Loader />}
			
		</div>
	)
}

export default SignIn
