import './Galleries.scss'
import React from 'react'
import useGalleries from '../../hooks/useGalleries'
import { Link } from 'react-router-dom'
import Loader from '../../components/loader/Loader'
import AddGallery from './add-gallery/AddGallery'

const Galleries = () => {
	const { galleries, loading } = useGalleries()
	
	return (
		<div id="galleries">
			<h1>Your Galleries</h1>

			<AddGallery />

			{	/* Display all galleries */
				loading 
					? <Loader />
					: galleries.map(gallery => (
						<Link 
							to={`/galleries/${gallery.id}`} 
							className="gallery" 
							key={gallery.id}
						>
							{ gallery.name }
						</Link>
					))
			}
		</div>
	)
}

export default Galleries
