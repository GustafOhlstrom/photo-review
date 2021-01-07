import './SignIn.scss'
import React, { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const SignIn = () => {
	const emailRef = useRef()
	const passwordRef = useRef()
	const { signIn } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		try {
			await signIn(emailRef.current.value, passwordRef.current.value)
			navigate('/galleries')
		} catch (e) {
			console.log("error", e)
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
				
				<button>Sign in</button>
			</form>
		</div>
	)
}

export default SignIn
