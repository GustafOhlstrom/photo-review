import './Review.scss'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useReview from '../../hooks/useReview'
import Loader from '../../components/loader/Loader'
import useSubmitReview from '../../hooks/useSubmitReview'
import Images from './images/Images'

const Review = () => {
	// Review information
	const { id, version } = useParams()
	const { name, images, loading } = useReview(id, version)
	
	// Track user review input
	const [review, setReview] = useState([])
	const [status, setStatus] = useState(0)
	const [liked, setLiked] = useState(0)
	const [disliked, setDisliked] = useState(0)

	// Submit Review
	const [submitedImages, setSubmitedImages] = useState(null)
	const { isSuccess, loading: createLoading } = useSubmitReview(id, version, submitedImages)

	// Reset review if new images are provided
	useEffect(() => {
		if(images && images.length > 0) {
			setReview(images.map(() => 'undetermined'))
		}
	}, [images]);

	// Update review varaibles 
	useEffect(() => {
		setStatus(review.filter(item => item !== 'undetermined').length)
		setLiked(review.filter(item => item === 'liked').length)
		setDisliked(review.filter(item => item === 'disliked').length)
	}, [review])

	// Handle new like/dislike input
	const onStatusChange = (image, status) => {
		const imageIndex = images.indexOf(image)

		setReview(prevReview => prevReview.map((item, index) => (
			index === imageIndex
				? item = item !== status
					? status
					: 'undetermined'
				: item
		)))
	}

	// Submit review 
	const onSubmitReview = () => {
		if(status === review.length) {
			const galleryImages = images.filter((image, index) => review[index] === 'liked')
			setSubmitedImages(galleryImages)
		}
	}

	return (
		<div id="review">
			{
				isSuccess 
					? <h1>Review successfully submitted!</h1>
					: <>
						<header>
							{/* Title and submit button */}
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
							
							{/* Review status with progress bar */}
							<h2>Status: { status } / { review.length }</h2>
							<div className="progress-bar">
								<div className="progress-text"></div>
								<div className="row">
									<div className="progress-completed liked" style={{width:`${ (liked / review.length)* 100 }%`}}>{ liked !== 0 && liked }</div>
									<div className="progress-completed disliked" style={{width:`${ (disliked / review.length)* 100 }%`}}>{ disliked !== 0 && disliked }</div>
								</div>
								
							</div>
							
							{/* User instructions */}
							<p>Like all images you want to keep and dislike the rest.</p>
							<p>When all images have been marked please submit the review.</p>
						</header>
					
						{	/* Display all images */
							loading 
								? <Loader />
								: <Images 
									images={images} 
									review={review}
									onStatusChange={(image, status) => onStatusChange(image, status)}
								/>
						}
					</>
			}
		</div>
	)
}

export default Review
