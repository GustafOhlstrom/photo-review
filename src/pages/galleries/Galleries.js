import './Galleries.scss'
import React from 'react'
import useGalleries from '../../hooks/useGalleries'
import { Link } from 'react-router-dom'
import Loader from '../../components/loader/Loader'
import AddGallery from './add-gallery/AddGallery'
import noImage from '../../assets/images/no-image.jpg'; 

const Galleries = () => {
	const { galleries, loading } = useGalleries()

	const renderRandomImage = gallery => {
		const imageArray = []
		if(Object.keys(gallery.versions).length > 0) {
			Object.values(gallery.versions).forEach(version => {
				version.forEach(image => imageArray.push(image))
			})

			if(imageArray.length > 0) {
				const image = imageArray[Math.floor(Math.random() * imageArray.length)];
				return <img src={image.url} alt={'Image preview for ' + gallery.name}/>
			} else {
				return <img src={noImage} alt={'Image preview for ' + gallery.name}/>
			}
		} else {
			return <img src={noImage} alt={'Image preview for ' + gallery.name}/>
		}
	}

	return (
		<div id="galleries">
			<h1>Your Galleries</h1>

			<AddGallery />

			{	/* Display all galleries */
				loading 
					? <Loader />
					: <div className="gallery-grid">
						{
							galleries.map(gallery => (
								<Link 
									to={`/galleries/${gallery.id}`} 
									className="gallery" 
									key={gallery.id}
								>
									{ renderRandomImage(gallery) }

									<header>
										<h2>{ gallery.name }</h2>
										{/* <h3>New version from review available</h3> */}
									</header>

									<ul>
										<li>
											<h3>{ Object.keys(gallery.versions).length }</h3>
											<h4>{ Object.keys(gallery.versions).length === 1 ? 'Version' : 'Versions' }</h4>
										</li>
										<li>
											<h3>{ gallery.review.length }</h3>
											<h4>{ gallery.review.length === 1 ? 'Active review' : 'Active reviews'}</h4>
										</li>
									</ul>
								</Link>
							))
						}
					</div>
			}
		</div>
	)
}

export default Galleries
