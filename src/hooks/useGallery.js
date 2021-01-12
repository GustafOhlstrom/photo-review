import { useEffect, useState } from 'react'
import { db } from '../firebase'

const useGallery = id => {
	const [name, setName] = useState("")
	const [versions, setVersions] = useState([])
	const [loading, setLoading] = useState(true)

	// Get images and gallery name from db using gallery id param from current route
	useEffect(() => {
		const unsubscribe = db.collection("galleries")
			.doc(id)
			.onSnapshot(doc => {
				setLoading(true)
				
				if(doc.data()) {
					setVersions(doc.data().versions || [])
					setName(doc.data().name);
				}
				
				setLoading(false)
			});

		return unsubscribe
	}, [id])

	return { name, versions, loading }
}

export default useGallery
