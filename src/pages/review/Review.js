import './Review.scss'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useReview from '../../hooks/useReview'
import Loader from '../../components/loader/Loader'
import useSubmitReview from '../../hooks/useSubmitReview'
import { ReactComponent as ThumbSvg } from '../../assets/icons/thumb.svg';

const Review = () => {
	const { id, version } = useParams()
	const { name, images, loading } = useReview(id, version)
	
	const [review, setReview] = useState([])
	const [status, setStatus] = useState(0)
	const [liked, setLiked] = useState(0)
	const [disliked, setDisliked] = useState(0)

	const [submitedImages, setSubmitedImages] = useState(null)
	const { isSuccess, loading: createLoading } = useSubmitReview(id, version, submitedImages)

	useEffect(() => {
		if(images && images.length > 0) {
			setReview(images.map(() => 'undetermined'))
		}
	}, [images]);

	useEffect(() => {
		setStatus(review.filter(item => item !== 'undetermined').length)
		setLiked(review.filter(item => item === 'liked').length)
		setDisliked(review.filter(item => item === 'disliked').length)
	}, [review])

	const onStusChange = (image, status) => {
		const imageIndex = images.indexOf(image)

		setReview(prevReview => prevReview.map((item, index) => (
			index === imageIndex
				? item = item !== status
					? status
					: 'undetermined'
				: item
		)))
	}

	const onSubmitReview = () => {
		if(status === review.length) {
			const galleryImages = images.filter((image, index) => review[index] === 'liked')
			setSubmitedImages(galleryImages)
		}
	}

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
		<div id="review">
			{
				isSuccess 
					? <h1>Review successfully submitted!</h1>
					: <>
						<header>
							<div className="row">
								<h1>{ name }</h1>
								<button 
									disabled={ status !== review.length || loading || createLoading } 
									title={ (status !== review.length || loading || createLoading) ? 'Complete the review first by liking/disliking all images' : 'Submit reivew'}
									onClick={onSubmitReview}
								>
									Submit review
								</button>
							</div>
							
							<h2>Status: { status } / { review.length }</h2>
							{ console.log("review.length / status", status /  review.length , review.length, status)}
							<div className="progress-bar">
								<div className="progress-text"></div>
								<div className="row">
									<div className="progress-completed liked" style={{width:`${ (liked / review.length)* 100 }%`}}>{ liked !== 0 && liked }</div>
									<div className="progress-completed disliked" style={{width:`${ (disliked / review.length)* 100 }%`}}>{ disliked !== 0 && disliked }</div>
								</div>
								
							</div>
							
							<p>Like all images you want to keep and dislike the rest.</p>
							<p>When all images have been marked please submit the review.</p>
						</header>
					
						{	/* Display all images */
							loading 
								? <Loader />
								: <div className="images">
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

											<div className="review-buttons">
												<ThumbSvg 
													className={`like ${ review[imageIndex] === 'liked' && 'liked' } `} 
													onClick={() => onStusChange(images[imageIndex], 'liked')} 
													title="like"
												/>
												<ThumbSvg 
													className={`dislike ${ review[imageIndex] === 'disliked' && 'disliked' }`} 
													onClick={() => onStusChange(images[imageIndex], 'disliked')} 
													title="dislike"
												/>
											</div>
										</figure> 
										: images.map((image, index) => (
											<figure className={`${ review[index] === 'liked' && 'liked' } ${ review[index] === 'disliked' && 'disliked' }`} key={image.url} >
												<img src={image.url} alt={image.name} onClick={() => onToggleLightBox(index)} />
												<div className="review-buttons">
													<ThumbSvg 
														className={`like ${ review[index] === 'liked' && 'liked' } `} 
														onClick={() => onStusChange(image, 'liked')} 
														title="like"
													/>
													<ThumbSvg 
														className={`dislike ${ review[index] === 'disliked' && 'disliked' }`} 
														onClick={() => onStusChange(image, 'disliked')} 
														title="dislike"
													/>
												</div>
											</figure>
										))
									}
								</div>
						}
					</>
			}
			
			
		</div>
	)
}

export default Review
