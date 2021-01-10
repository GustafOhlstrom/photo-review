import { useEffect, useState } from 'react'
import { db } from '../firebase'

const useGalleries = () => {
	const [galleries, setGalleries] = useState([])
	const [loading, setLoading] = useState(true)

	// Get all galleries from db 
	useEffect(() => {
		const unsubscribe = db.collection("galleries")
			.orderBy('name')
			.onSnapshot(snapshot => {
				setLoading(true)

				const tempGalleries = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
				
				setGalleries(tempGalleries)
				setLoading(false)
			});
			
		return unsubscribe
	}, []);

	return { galleries, loading }
}

export default useGalleries
