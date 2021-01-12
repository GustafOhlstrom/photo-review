import './RenameGallery.scss'
import React, { useEffect, useRef } from 'react'
import { db } from '../../../firebase'

const RenameGallery = ({name, id, onToggleRename}) => {
	const nameRef = useRef()

	useEffect(() => {
		nameRef.current.value = name
	}, [name])

	const handleSubmit = async e => {
		e.preventDefault()

		// Trigger useCreateGallery if name is at least 1 character long
		const newName = nameRef.current.value;
		if (newName.length >= 1) {
			db.collection("galleries").doc(id).update({
				name: newName
			})

			onToggleRename()
		}
	}

	return (
		<form id="rename-gallery" onSubmit={handleSubmit} >
			<input id="name" type="text" ref={nameRef} placeholder="new gallery name"/>
			<button>Update</button>
		</form>	
	)
}

export default RenameGallery
