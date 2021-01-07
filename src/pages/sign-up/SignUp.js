import './SignUp.scss'
import React, { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const SignUp = () => {
	const emailRef = useRef()
	const passwordRef = useRef()
	const { signUp, signIn } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		try {
			await signUp(emailRef.current.value, passwordRef.current.value)
			await signIn(emailRef.current.value, passwordRef.current.value)
			navigate('/galleries')
		} catch (e) {
			console.log("error", e)
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
				
				<button>Sign up</button>
			</form>
		</div>
	)
}

export default SignUp
