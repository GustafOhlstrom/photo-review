import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { db } from '../firebase'

const useGalleries = () => {
	const [galleries, setGalleries] = useState([])
	const [loading, setLoading] = useState(true)
	const { user } = useContext(AuthContext)

	// Get all galleries from db 
	useEffect(() => {
		const unsubscribe = db.collection("galleries")
			.orderBy('name')
			.onSnapshot(snapshot => {
				setLoading(true)

				const tempGalleries = snapshot.docs
					.map(doc => ({ ...doc.data(), id: doc.id }))
					.filter(gallery => gallery.owner === user.uid)
				
				setGalleries(tempGalleries)
				setLoading(false)
			})
			
		return unsubscribe
	}, [user])

	return { galleries, loading }
}

export default useGalleries
