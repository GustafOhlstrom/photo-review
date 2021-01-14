import React from 'react'
import { render, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { AuthContext } from '../../contexts/AuthContext'
import Galleries from './Galleries'

it('renders galleries with user id', async () => {
	const history = createMemoryHistory()
	window.history.pushState({}, '', '/galleries')

	await act(async () => {
		render(
			<Router history={history}>
				<AuthContext.Provider value={{ user: { uid: '123456789' } }}>
					<Galleries />
				</AuthContext.Provider>
			</Router>
		)
	})

	expect(screen.getByRole('heading', { name: 'Your Galleries' })).toBeInTheDocument()
	expect(screen.getByPlaceholderText('gallery name')).toBeInTheDocument()
	expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
})