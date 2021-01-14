import './Images.scss'
import React, { useState } from 'react'
import { ReactComponent as ThumbSvg } from '../../../assets/icons/thumb.svg';
	
const Images = ({images, review, onStatusChange}) => {
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

	return (
		<div id="images">
			{
				lightBox
					? <div className="lightbox image-container">
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

						<div className="review-buttons">
							<ThumbSvg 
								className={`like ${ review[imageIndex] === 'liked' && 'liked' } `} 
								onClick={() => onStatusChange(images[imageIndex], 'liked')} 
								title="like"
							/>
							<ThumbSvg 
								className={`dislike ${ review[imageIndex] === 'disliked' && 'disliked' }`} 
								onClick={() => onStatusChange(images[imageIndex], 'disliked')} 
								title="dislike"
							/>
						</div>
					</div> 
					: <div className="image-grid">
						{ 
							images.map((image, index) => (
								<figure className={`${ review[index] === 'liked' && 'liked' } ${ review[index] === 'disliked' && 'disliked' }`} key={image.url} >
									<img src={image.url} alt={image.name} onClick={() => onToggleLightBox(index)} />
									<div className="review-buttons">
										<ThumbSvg 
											className={`like ${ review[index] === 'liked' && 'liked' } `} 
											onClick={() => onStatusChange(image, 'liked')} 
											title="like"
										/>
										<ThumbSvg 
											className={`dislike ${ review[index] === 'disliked' && 'disliked' }`} 
											onClick={() => onStatusChange(image, 'disliked')} 
											title="dislike"
										/>
									</div>
								</figure>
							))
						}
					</div>
			}
		</div>
	)
}

export default Images
