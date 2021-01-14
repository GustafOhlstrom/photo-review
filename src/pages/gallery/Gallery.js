import './Gallery.scss'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useGallery from '../../hooks/useGallery'
import ImagesUpload from './images-upload/ImageUpload'
import Loader from '../../components/loader/Loader'
import firebase, { db, storage } from '../../firebase'
import RenameGallery from './rename-gallery/RenameGallery'
import { ReactComponent as OptionsSvg } from '../../assets/icons/options.svg'
import useCreateGallery from '../../hooks/useCreateGallery'
import Images from './images/Images'

const Gallery = () => {
	const { id } = useParams()
	const { name, versions, loading } = useGallery(id)
	const [version, setVersion] = useState('')
	const [images, setImages] = useState([])

	const navigate = useNavigate()

	// Actions
	const [rename, setRename] = useState(false)
	const [selected, setSelected] = useState([])

	// Drop downs
	const [versionsDropDown, setVersionsDropDown] = useState(false)

	// New gallery
	const [newGalleryName, setnewGalleryName] = useState('')
	const [newGalleryImages, setnewGalleryImages] = useState([])
	const { id: newId } = useCreateGallery(newGalleryName, true, newGalleryImages)

	useEffect(() => {
		if(newId) {
			navigate(`/galleries/${newId}`)
		}
	}, [newId, navigate])

	useEffect(() => {
		if(versions) {
			if(Object.keys(versions).length > 0) {
				if(version && Object.keys(versions).includes(version)) {
					setImages(versions[version])
				} else {
					const versionKey = Object.keys(versions).reduce((a, b) => a > b ? a : b)
					setVersion(versionKey)
					setImages(versions[versionKey])
				}
			} else {
				setVersion(Object.keys(versions)[0])
				setImages([])
			}
			setSelected([])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [versions])

	const onToggleVersionsDropDown = () => {
		setVersionsDropDown(prevVersionsDropDown =>  !prevVersionsDropDown)
	}
	
	const onSelectVersion = version => {
		if(version) {
			setVersion(version)
			setImages(versions[version])
			setSelected([])
		}
	}
	
	const onCreateReview = () => {
		console.log("create review", id, version)

		db.collection("galleries").doc(id)
				.update({
					review: firebase.firestore.FieldValue.arrayUnion(version)
				})
				.then(() => {
					console.log("Review successfully created!")
					navigate(`/review/${id}/${version}`)
				}).catch(error => {
					console.error("Error create review of gallery: ", error)
				})
	}

	const onToggleRename = () => {
		setRename(prevRename =>  !prevRename)
	}

	const onDeleteImages = () => {
		if(selected.length > 0) {
			db.collection("galleries").doc(id).update({
				[`versions.${version}`]: firebase.firestore.FieldValue.arrayRemove(...selected)
			})

			deleteImageLocationData(selected, version)
			setSelected([])
		}
	}

	const onDeleteGallery = () => {
		if(!id) {
			return
		}

		if (window.confirm(`Delete gallery: ${name} ?`)) {
			db.collection("galleries").doc(id).delete()
				.then(() => {
					Object.keys(versions).forEach(version => {
						deleteImageLocationData(versions[version], version)
					})

					console.log("Gallery successfully deleted!")
					navigate(`/galleries`)
				}).catch(error => {
					console.error("Error removing document: ", error)
				})
		} 
	}

	const onDeleteVersion = () => {
		if(!id && !version) {
			return
		}

		if (window.confirm(`Delete version: ${ Object.keys(versions).sort((a,b) => a - b).indexOf(version) + 1 + ` (${new Date(+version).toDateString()})` } ?`)) {
			db.collection("galleries").doc(id)
				.update({
					[`versions.${version}`]: firebase.firestore.FieldValue.delete()
				})
				.then(() => {
					deleteImageLocationData(images, version)

					console.log("Version successfully deleted!")
				}).catch(error => {
					console.error("Error removing document: ", error)
				})
			
			setSelected([])
		} 
	}

	const deleteImageLocationData = (images, version) => {
		images.forEach(async image => {
			// Remove image information
			await db.collection("images").doc(image.name).update({
				locations: firebase.firestore.FieldValue.arrayRemove({ [id]: +version })
			})

			db.collection("images").doc(image.name).get()
				.then(doc => {
					// Remove image from storage if not used at any other location
					if(doc.data() && doc.data().locations.length < 1) {
						// Remove image location document
						db.collection("images").doc(image.name).delete()
							.then(() => {
								console.log("Image remove from images location")
							}).catch(error => {
								console.error("Error removing image from images location: ", error)
							})


						// Remove image from storage
						storage.ref(image.path).delete()
							.then(() => {
								console.log("Gallery successfully deleted!")
							}).catch(error => {
								console.error("Error removing document: ", error)
							})
					}
				})
				.catch(error => {
					console.error("Error: ", error)
				})
		})
	}

	const onCreateGallery = () => {
		if(selected.length > 0) {
			const newName = prompt("Enter new gallery name")
			if(newName) {
				setnewGalleryName(newName)
				setnewGalleryImages(selected)
			}
		}
	}

	const [options, setOptions] = useState(false)
	const onToggleOptions = () => {
		setOptions(prevOptions =>  !prevOptions)
	}

	return (
		<div id="gallery">
			<header>
				<div className="row title-row">
					{
						rename 
							? <RenameGallery id={id} name={name} onToggleRename={onToggleRename}/>
							: <h1>{ name }</h1>
					}

					<div className={`options drop-down ${options && 'drop-down-display'}`} onClick={onToggleOptions}>
						<div className={`drop-down-value ${options && 'spin-option-wheel'}`}>	
							<OptionsSvg />
						</div>
						
						<ul className="drop-down-list">
							<li onClick={onCreateReview}>Create a review</li>
							<li onClick={onToggleRename}>Rename gallery</li>
							<li onClick={onDeleteImages}>Delete selected images</li>
							<li onClick={onCreateGallery}>Create new gallery based on selected images</li>
							<li onClick={onDeleteVersion}>Delete version</li>
							<li onClick={onDeleteGallery}>Delete gallery</li>
						</ul>
					</div>
				</div>
				
				{
					version &&
					<div className={`versions drop-down ${versionsDropDown && 'drop-down-display'}`} onClick={onToggleVersionsDropDown}>
						<div className="row">
							<p className="version-text">Version: </p>
							<div className="drop-down-value">{ Object.keys(versions).sort((a,b) => a - b).indexOf(version) + 1 + ` (${new Date(+version).toDateString()})` }</div>
						</div>
						
						<ul className="drop-down-list" style={ versionsDropDown ? { height: `${(Object.keys(versions).length * 44) - 1}px` } : {}}>
							{
								Object.keys(versions).sort((a,b) => a - b).reverse().map((version, index) => <li onClick={() => onSelectVersion(version)} key={version}>{ Object.keys(versions).sort((a,b) => a - b).indexOf(version) + 1 + ` (${new Date(+version).toDateString()})` }</li>)
							}
						</ul>

						<div className="arrow"></div>
					</div>
				}
				
			</header>
			

			<ImagesUpload galleryId={ id } version={ version } />

			{	/* Display all images */
				loading 
					? <Loader />
					: <Images 
						images={images} 
						selected={selected}
						setSelected={(value) => setSelected(value)}
					/>
			}
		</div>
	)
}

export default Gallery
