import { useEffect, useState } from 'react'
import firebase, { db } from '../firebase'

const useSubmitReview = (id, version, images) => {
	const [isSuccess, setIsSuccess] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	// Create gallery
	// eslint-disable-next-line react-hooks/exhaustive-deps
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
			await db.collection("galleries").doc(id).update({
				'review': firebase.firestore.FieldValue.arrayRemove(version.toString()),
				[`versions.${newVersion}`]: images
			})

			// Save image location
			images.forEach(image => {
				db.collection("images").doc(image.name).set(
					{
						locations: firebase.firestore.FieldValue.arrayUnion({ [id]: newVersion })
					},
					{ 
						merge: true  
					}
				)
			})

			setIsSuccess(true)
		} catch (error) {
			setLoading(false)
			setError(`An error occurred when creating the new id: ${error.message}`)
		}

		setLoading(false)
	}, [id, version, images])

	return { isSuccess, loading, error }
}

export default useSubmitReview
