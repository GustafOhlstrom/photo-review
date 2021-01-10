import './Gallery.scss'
import React from 'react'
import { useParams } from 'react-router-dom'
import useGallery from '../../hooks/useGallery'
import ImagesUpload from './images-upload/ImageUpload'
import ImageCard from './image-card/ImageCard'
import Loader from '../../components/loader/Loader'

const Gallery = () => {
	const { id } = useParams()
	const { name, images, loading } = useGallery(id)

	return (
		<div id="gallery">
			<h1>{ name }</h1>

			<ImagesUpload galleryId={ id } />

			{	/* Display all images */
				loading 
					? <Loader />
					: <div className="images">
						{
							images.map(image => (
								<ImageCard image={image} key={image.url}/>
							))
						}
					</div>
			}
			
		</div>
	)
}

export default Gallery
