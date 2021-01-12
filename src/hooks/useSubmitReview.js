import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import firebase, { db } from '../firebase'

const useSubmitReview = (id, version, images) => {
	const [isSuccess, setIsSuccess] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const { user } = useContext(AuthContext)

	// Create gallery
	useEffect(async () => {
		if(!id || !version || !images || !Array.isArray(images)) {
			setLoading(false)
			setError(null)
			
			return
		}

		// Reset states
		setIsSuccess(false)
		setLoading(true)
		setError(false)
		
		// Create empty gallery if no images are provnewVersioned
		try {
			const newVersion = new Date().getTime()
			console.log("version", '' + version, 1610466777058 )
			await db.collection("galleries").doc(id).update({
				'review': firebase.firestore.FieldValue.arrayRemove(version.toString()),
				[`versions.${newVersion}`]: images
			})

			setIsSuccess(true)
		} catch (error) {
			setLoading(false)
			setError(`An error occurred when creating the new id: ${error.message}`)
		}

		setLoading(false)
		
	}, [id, images])

	return { isSuccess, loading, error }
}

export default useSubmitReview
