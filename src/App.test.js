import React from 'react'
import { render, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import App from './App'

it('renders home page when unauthorized', async () => {
	const history = createMemoryHistory()
	window.history.pushState({}, '', '/galleries')

	await act(async () => {
		render(
			<Router history={history}>
				<App />
			</Router>
		)
	})

	expect(screen.getByRole('heading', { name: 'Welcome to Photo Review' })).toBeInTheDocument()
	expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
	expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
})