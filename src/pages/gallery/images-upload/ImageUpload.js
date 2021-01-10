import './ImageUpload.scss'
import React, { useCallback, useEffect, useState } from 'react'
import useImagesUpload from '../../../hooks/useImagesUpload'
import { useDropzone } from 'react-dropzone'

const ImagesUpload = ({ galleryId }) => {
	const [images, setImages] = useState(null)
	const { isSuccess, progress, error } = useImagesUpload(images, galleryId)

	// Clear images after upload is completed or get an error
	useEffect(() => {
		setImages(null)
		acceptedFiles.length = 0
	}, [isSuccess, error])

	// Upload all accepted images selected/dropped 
	const onDrop = useCallback(acceptedFiles => {
		if (acceptedFiles.length > 0) {
			setImages(acceptedFiles)
		}
	}, [])

	// Dropzone config
	const { getRootProps, getInputProps, isDragActive, acceptedFiles, isDragAccept, isDragReject } = useDropzone({
		accept: 'image/gif, image/jpeg, image/png',
		onDrop
	})

	return (
		<div 
			id="image-upload" 
			{ ...getRootProps() } 
		>
			<input { ...getInputProps() } />

			{	/* Display dropzone text depending on user interaction */
				isDragActive
					? isDragAccept 
						? <p>Drop images here!</p> 
						: <p>File not accepted!</p>
					: <p>Drag images here or click to select them</p>
			}
			
			{ 	/* Display file names of accepted files to be uploaded */
				acceptedFiles && 
				<div className="accepted-files">
					<ul>
						{
							acceptedFiles.map(file => (
								<li key={ file.name }>
									{ file.name } ({ Math.round(file.size / 1024) } kb)
								</li>
							))
						}
					</ul>
				</div>
			}

			{	/* Progress bar for images currently being uploaded */
				progress !== null && <div className="progress-bar"><div className="progress-completed" style={{width:`${ progress }%`}}>{ progress }%</div></div>
			}

			{	/* Images where uploaded successfully message */
				isSuccess && <p className="success">Images uploaded!</p>
			}

			{	/* Images experienced an error during upload message */
				error && <p className="error">{ error }</p>
			}
		</div>
	)
}

export default ImagesUpload
