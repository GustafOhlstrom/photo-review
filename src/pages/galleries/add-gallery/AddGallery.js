import './AddGallery.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/loader/Loader'
import useCreateGallery from '../../../hooks/useCreateGallery'

const AddGallery = () => {
	const nameRef = useRef()
	const [name, setName] = useState("")
	const { id, loading, error } = useCreateGallery(name)
	const navigate = useNavigate()

	useEffect(() => {
		navigate(`/galleries/${id}`)
	}, [id])

	const handleSubmit = async e => {
		e.preventDefault()

		// Trigger useCreateGallery if name is at least 1 character long
		const name = nameRef.current.value;
		if (name.length >= 1) {
			setName(name)
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
