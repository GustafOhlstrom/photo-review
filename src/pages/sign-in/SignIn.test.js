import React from 'react'
import { render, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import App from '../../App'

it('renders sign in form', async () => {
	const history = createMemoryHistory()
	window.history.pushState({}, '', '/signin')

	await act(async () => {
		render(
			<Router history={history}>
				<App />
			</Router>
		)
	})

	expect(screen.getByPlaceholderText('email')).toBeInTheDocument()
	expect(screen.getByPlaceholderText('password')).toBeInTheDocument()
	expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
	expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
})