import './ImageUpload.scss'
import React, { useCallback, useEffect, useState } from 'react'
import useImagesUpload from '../../../hooks/useImagesUpload'
import { useDropzone } from 'react-dropzone'

const ImagesUpload = ({ galleryId, version }) => {
	const [images, setImages] = useState(null)
	const [alert, setAlert] = useState(null)
	const { isSuccess, progress, error } = useImagesUpload(images, galleryId, version)

	// Clear images after upload is completed or get an error
	useEffect(() => {
		if (isSuccess) {
			setAlert({
				type: 'success',
				text: 'Images uploaded!',
			});
		} else if (error) {
			setAlert({
				type: 'error',
				text: error,
			});
		} else {
			setAlert(null);
		}

		setImages(null)
		acceptedFiles.length = 0
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess, error])

	// Upload all accepted images selected/dropped 
	const onDrop = useCallback(acceptedFiles => {
		if (acceptedFiles.length > 0) {
			setImages(acceptedFiles)
		}
	}, [])

	// Dropzone config
	const { getRootProps, getInputProps, isDragActive, acceptedFiles, isDragAccept } = useDropzone({
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
					: <p>Upload images by dragging them here or clicking to select them</p>
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

			{	/* Images upload alert, either success or error */
				alert && <p className={alert.type}>{ alert.text }</p>
			}
		</div>
	)
}

export default ImagesUpload
