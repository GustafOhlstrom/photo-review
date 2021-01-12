import { useEffect, useState } from 'react'
import { db } from '../firebase'

const useGallery = (id, version) => {
	const [name, setName] = useState("")
	const [images, setImages] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	// Get images and gallery name from db using gallery id param from current route
	useEffect(() => {
		if(!id | !version) {
			setLoading(false)
			
			return
		}

		setLoading(true)
		setError(false)

		const unsubscribe = db.collection("galleries")
			.doc(id)
			.onSnapshot(doc => {
				setLoading(true)
				
				if(doc.data()) {
					if(doc.data().review.includes(version)) {
						setImages(doc.data().versions[version] || [])
						setName(doc.data().name);
					} else {
						setError(true)
					}
				}
				
				setLoading(false)
			});

		return unsubscribe
	}, [id, version])

	return { name, images, loading, error }
}

export default useGallery
