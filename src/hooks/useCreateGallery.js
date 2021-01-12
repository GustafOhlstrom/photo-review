import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { db } from '../firebase'

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
		
		// Create empty gallery if no images are provided
		try {
			if(images && uploadImages) {
				const version = new Date().getTime()
				const docRef = await db.collection('galleries').add({
					name,
					owner: user.uid,
					review: [],
					versions: {
						[version]: images
					}
				})
				setId(docRef.id)
			} else {
				const version = new Date().getTime()
				const docRef = await db.collection('galleries').add({
					name,
					owner: user.uid,
					review: [],
					versions: {
						[version]: []
					}
				})
				setId(docRef.id)
			}
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
