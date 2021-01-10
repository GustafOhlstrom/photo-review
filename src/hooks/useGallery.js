import { useEffect, useState } from 'react'
import { db } from '../firebase'

const useGallery = id => {
	const [name, setName] = useState("");
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true)

	// Get images and gallery name from db using gallery id param from current route
	useEffect(() => {
		const unsubscribe = db.collection("galleries")
			.doc(id)
			.onSnapshot(doc => {
				setLoading(true)
				
				setImages(doc.data().images || []);
				setName(doc.data().name);

				setLoading(false)
			});

		return unsubscribe
	}, [id]);

	return { name, images, loading };
}

export default useGallery
