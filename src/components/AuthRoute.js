import React, { useContext } from 'react'
import { Route, Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const AuthRoute = props => {
	const { user } = useContext(AuthContext)

	return (
		user
			? <Route { ...props } />
			: <Navigate to="/" />
	)
}

export default AuthRoute
