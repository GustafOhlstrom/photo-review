import './Images.scss'
import React, { useState } from 'react'

const Images = ({images, selected, setSelected}) => {
	const [imageIndex, setImageIndex] = useState(0)
	const [lightBox, setLightBox] = useState(false)
	
	const onToggleLightBox = index => {
		setLightBox(prevLightBox => !prevLightBox)
		index && setImageIndex(index)
	}

	const onPreviousImage = () => {
		setImageIndex(prevIndex => prevIndex >= 1 ? prevIndex - 1 : images.length - 1)
	}

	const onNextImage = () => {
		setImageIndex(prevIndex => prevIndex + 1 !== images.length ? prevIndex + 1 : 0)
	}

	const onSelect = image => {
		selected.includes(image)
			? setSelected(prevSelected => prevSelected.filter(selected => selected !== image))
			: setSelected(prevSelected =>  [...prevSelected, image])
	}

	return (
		<div id="images">
			{
				lightBox
					? <figure className="lightbox">
						<div className="close" onClick={() => onToggleLightBox()} >
							<div className="line1"></div>
							<div className="line2"></div>
						</div>
						
						<img src={images[imageIndex].url} alt={images[imageIndex].name}/>
						
						<div className="row">
							<div className="previous" onClick={() => onPreviousImage()}>
								<div className="arrow left"></div>
							</div>
								
							<div className="next" onClick={() => onNextImage()}>
								<div className="arrow right"></div>
							</div>
						</div>
					</figure> 
					: <div className="image-grid">
						{
							images.map((image, index) => (
								<figure key={image.url} >
									<div className={`select-icon ${ selected.includes(image) && 'selected' }`} onClick={() => onSelect(image)}><div></div></div>
									<img src={image.url} alt={image.name} onClick={() => onToggleLightBox(index)} />
								</figure>
							))
						}
					</div>
					 
			}
		</div>
	)
}

export default Images
