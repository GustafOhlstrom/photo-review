import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import firebase, { db } from '../firebase'

const useCreateGallery = (name, uploadImages = false, images) => {
	const [id, setId] = useState('')
	const [isSuccess, setIsSuccess] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const { user } = useContext(AuthContext)

	// Create gallery
	useEffect(async () => {
		if(!name || ( uploadImages && (!images || !Array.isArray(images)))) {
			setLoading(false)
			setError(null)
			
			return
		}

		// Reset states
		setIsSuccess(false)
		setLoading(true)
		setError(false)
		
		// Create gallery, empty if no images are provided
		try {
			const version = new Date().getTime()

			// Save image information for gallery
			const docRef = await db.collection('galleries').add({
				name,
				owner: user.uid,
				review: [],
				versions: {
					[version]: (images && uploadImages) ? images : []
				}
			})
			setId(docRef.id)

			// Save image location
			images.forEach(image => {
				db.collection("images").doc(image.name).set(
					{
						locations: firebase.firestore.FieldValue.arrayUnion({ [docRef.id]: version })
					},
					{ 
						merge: true  
					}
				)
			})

			setIsSuccess(true)
		} catch (error) {
			setLoading(false)
			setError(`An error occurred when creating the new gallery: ${error.message}`)
		}

		setLoading(false)
		
	}, [name, images])

	return { id, isSuccess, loading, error }
}

export default useCreateGallery
