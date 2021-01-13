import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import firebase, { db, storage } from '../firebase'

const useImagesUpload = (images, gallery, version) => {
	const [isSuccess, setIsSuccess] = useState(false)
	const [progress, setProgress] = useState(null)
	const [error, setError] = useState(null)
	
	const { user } = useContext(AuthContext)

	useEffect(() => { 
		if (!images || !Array.isArray(images) || !gallery) {
			setProgress(null)
			setError(null)
			setIsSuccess(false)

			return
		}

		// Reset states
		setError(null)
		setIsSuccess(false)
		
		// Promises of all images that are being uploaded
		const promises = []

		// Total bytes and current progress for all images
		const totalBytes = images.reduce((a, b) => a + (b.size || 0), 0)
		let bytesTransferred = 0

		// Version, create new if none was provided
		const updateVersion = version ? +version : new Date().getTime()

		// Upload images
		images.forEach(image => {
			// Get ref, and check if image path already exists
			const imageName = '' + new Date().getTime() + '-' + image.name
			const imageRef = storage.ref(`images/${user.uid}/${imageName}`)

			// Start image upload and save upload to promises array
			const uploadTask = imageRef.put(image)
			promises.push(uploadTask)

			// Track upload progress
			let imageBytesTransferred = 0
			uploadTask.on('state_changed', taskSnapshot => {
				bytesTransferred += taskSnapshot.bytesTransferred - imageBytesTransferred
				setProgress(Math.round(((bytesTransferred) / totalBytes) * 100))
				imageBytesTransferred = taskSnapshot.bytesTransferred
			})

			// Save image information to db after images has been uploaded to storage
			uploadTask.then(async snapshot => {
				// Save image information
				db.collection("galleries").doc(gallery).update({
					[`versions.${updateVersion}`]: firebase.firestore.FieldValue.arrayUnion({
						name: imageName,
						owner: user.uid,
						path: snapshot.ref.fullPath,
						size: image.size,
						type: image.type,
						url: await imageRef.getDownloadURL()
					})
				})

				// Save image location
				db.collection("images").doc(imageName).set(
					{
						locations: firebase.firestore.FieldValue.arrayUnion({ [gallery]: updateVersion })
					},
					{ 
						merge: true  
					}
				)
			}).catch(error => {
				setError(`An error occurred and an image could not be uploaded: ${error.code}`)
			})
		})

		// Wait for all image uploads to complete
		Promise.all(promises)
			.then(() => {
				setProgress(null)
				setIsSuccess(true)
			})
			.catch(error => {
				setError(`An error occurred and the images could not be uploaded: ${error.code}`)
			})

		
	}, [images, gallery])

	return { isSuccess, progress, error }
}

export default useImagesUpload
