import React from 'react'
import { render, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './Navbar'
import { AuthContext } from '../../contexts/AuthContext'

it('renders galleries with user id', async () => {
	await act(async () => {
		render(
			<Router>
				<AuthContext.Provider value={{ user: { uid: '123456789' } }}>
					<Navbar />
				</AuthContext.Provider>
			</Router>
		)
	})
	
	expect(screen.getByText('Photo Review')).toBeInTheDocument()
	expect(screen.getByText('Home')).toBeInTheDocument()
	expect(screen.getByText('Galleries')).toBeInTheDocument()
	expect(screen.getByText('Sign out')).toBeInTheDocument()
})