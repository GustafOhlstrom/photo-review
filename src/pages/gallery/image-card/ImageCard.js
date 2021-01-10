import './ImageCard.scss'
import React from 'react'

const ImageCard = ({ image }) => {
	return (
		<div id="image-card">
			<img src={image.url} alt={image.name}/>
		</div>
	)
}

export default ImageCard
