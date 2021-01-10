import './AddGallery.scss'
import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { db } from '../../../firebase'
import Loader from '../../../components/loader/Loader'

const AddGallery = () => {
	const nameRef = useRef()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	
	const { user } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		// Gallery names need to be at least 1 character
		const name = nameRef.current.value;
		if (name.length < 1) {
			return;
		}

		setLoading(true)
		setError(false)
	
		// Create gallery in galleries collection on db
		try {
			const docRef = await db.collection('galleries').add({
				name,
				owner: user.uid,
			})
			
			navigate(`/galleries/${docRef.id}`)
		} catch (e) {
			setLoading(false)
			setError(`An error occurred when creating the new gallery: ${e.message}`)
		}
	}

	return (
		<div id="add-gallery">
			{ error && !loading && <p className="error">{ error }</p> }
			
			{ loading
				? <Loader />
				: <form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="name"></label>
						<input id="name" type="text" ref={nameRef} placeholder="gallery name"/>
					</div>
					
					<button>Add</button>
				</form>	
			}
		</div>
	)
}

export default AddGallery
