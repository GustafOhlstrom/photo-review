import './Gallery.scss'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useGallery from '../../hooks/useGallery'
import ImagesUpload from './images-upload/ImageUpload'
import Loader from '../../components/loader/Loader'
import firebase, { db, storage } from '../../firebase'
import RenameGallery from './rename-gallery/RenameGallery'
import useCreateGallery from '../../hooks/useCreateGallery'
import Images from './images/Images'
import * as dayjs from 'dayjs'
import VersionsDropDown from './versions-drop-down/VersionsDropDown'
import OptionsDropDown from './options-drop-down/OptionsDropDown'

const Gallery = () => {
	// Gallery information
	const { id } = useParams()
	const { name, review, versions, loading } = useGallery(id)
	const [version, setVersion] = useState('')
	const [images, setImages] = useState([])
	const navigate = useNavigate()

	// Actions
	const [rename, setRename] = useState(false)
	const [selected, setSelected] = useState([])

	// New gallery
	const [newGalleryName, setnewGalleryName] = useState('')
	const [newGalleryImages, setnewGalleryImages] = useState([])
	const { id: newId, loading: newLoading, error} = useCreateGallery(newGalleryName, true, newGalleryImages)

	// Update images and version when new information in provided by snapshot i useGalelry
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
	
	/**
	 * ------------  Create ------------ 
	**/

	const onCreateReview = () => {
		db.collection("galleries").doc(id)
			.update({
				review: firebase.firestore.FieldValue.arrayUnion(version)
			})
			.then(() => {
				if(window.confirm(`Review was successfully created! \nPress ok to visit review page and cancel to stay`)) {
					navigate(`/review/${id}/${version}`)
				} 
			}).catch(error => {
				console.error("Error create review of gallery: ", error)
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

	// Navigate to new gallery created
	useEffect(() => {
		if(newId) {
			navigate(`/galleries/${newId}`)
		}
	}, [newId, navigate])

	
	/**
	 * ------------  Delete ------------ 
	**/

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

		if (window.confirm(`Delete version: ${ getVersionName(version) } ?`)) {
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

	/**
	 * ------------  Misc Actions ------------ 
	**/

	const onGoToReview = () => {
		if(review.includes(version)) {
			navigate(`/review/${id}/${version}`)
		}
	}

	const onToggleRename = () => {
		setRename(prevRename =>  !prevRename)
	}

	// Update data when a different version is selected
	const onSelectVersion = version => {
		if(version) {
			setVersion(version)
			setImages(versions[version])
			setSelected([])
		}
	}

	const getVersionName = version => {
		return Object.keys(versions).sort((a,b) => a - b).indexOf(version) + 1 + ` (${dayjs(+version).format('ddd DD MMM YYYY')})`
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

					<OptionsDropDown 
						onCreateReview={onCreateReview} 
						onGoToReview={onGoToReview}
						onToggleRename={onToggleRename} 
						onDeleteImages={onDeleteImages}
						onCreateGallery={onCreateGallery} 
						onDeleteVersion={onDeleteVersion} 
						onDeleteGallery={onDeleteGallery} 
						review={review}
						version={version}
					/>
				</div>
				
				{
					version &&	
					<VersionsDropDown 
						versions={versions}
						version={version}
						onSelectVersion={onSelectVersion}
						getVersionName={getVersionName}
					/>
				}
				
			</header>
			
			{/* Dropzone for uploading images */}
			<ImagesUpload galleryId={ id } version={ version } />

			{ error && !loading && <p className="error">{ error }</p> }

			{	/* Display all images */
				(loading || newLoading)
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
