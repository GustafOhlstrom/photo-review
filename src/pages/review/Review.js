import './Review.scss'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useReview from '../../hooks/useReview'
import Loader from '../../components/loader/Loader'
import useSubmitReview from '../../hooks/useSubmitReview'
import { ReactComponent as ThumbSvg } from '../../assets/icons/thumb.svg';

const Review = () => {
	const { id, version } = useParams()
	const { name, images, loading, error } = useReview(id, version)

	const [status, setStatus] = useState(0)
	const [review, setReview] = useState([])

	const [submitedImages, setSubmitedImages] = useState(null)
	const { isSuccess, loading: createLoading, error: createError } = useSubmitReview(id, version, submitedImages)

	const navigate = useNavigate()

	useEffect(() => {
		if(isSuccess) {
			console.log("isSuccess")
			navigate(`/galleries/${id}`)
		} else if(error) {
			console.log("error")
			navigate(`/`)
		}
	}, [isSuccess, error])

	useEffect(() => {
		if(images && images.length > 0) {
			setReview(images.map(() => 'undetermined'))
		}
	}, [images]);

	useEffect(() => {
		setStatus(review.filter(item => item !== 'undetermined').length)
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

	return (
		<div id="review">
			<header>
				<h1>Review: { name }</h1>

				<p>{ status } / { review.length }</p>
				<button disabled={ status !== review.length || loading || createLoading } onClick={onSubmitReview}>Submit review</button>
			</header>
		
			{	/* Display all images */
				loading 
					? <Loader />
					: <div className="images">
						{
							images.map((image, index) => (
								<figure className={`${ review[index] === 'liked' && 'liked' } ${ review[index] === 'disliked' && 'disliked' }`} key={image.url} >
									<img src={image.url} alt={image.name}/>
									<div className="review-buttons">
										<ThumbSvg className={`like ${ review[index] === 'liked' && 'liked' } `} onClick={() => onStusChange(image, 'liked')} />
										<ThumbSvg className={`dislike ${ review[index] === 'disliked' && 'disliked' }`} onClick={() => onStusChange(image, 'disliked')} />
									</div>
								</figure>
							))
						}
					</div>
			}
			
		</div>
	)
}

export default Review
