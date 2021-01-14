import './SignUp.scss'
import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Loader from '../../components/loader/Loader'

const SignUp = () => {
	const emailRef = useRef()
	const passwordRef = useRef()
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const { signUp, signIn } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		setError(null)

		try {
			setLoading(true)
			await signUp(emailRef.current.value, passwordRef.current.value)
			await signIn(emailRef.current.value, passwordRef.current.value)
			navigate('/galleries')
		} catch (error) {
			setError(`Could not sign up: ${error}`)
			setLoading(false)
		}
	}

	return (
		<div id="signup">
			<h1>Sign up</h1>

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
				
				<button>Sign up</button>
			</form>

			{ loading && <Loader />}
		</div>
	)
}

export default SignUp
