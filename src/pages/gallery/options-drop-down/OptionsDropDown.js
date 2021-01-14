import './OptionsDropDown.scss'
import { ReactComponent as OptionsSvg } from '../../../assets/icons/options.svg'
import React, { useState } from 'react'

const OptionsDropDown = ({onCreateReview, onGoToReview, onToggleRename, onDeleteImages, onCreateGallery, onDeleteVersion, onDeleteGallery, review, version}) => {
	const [options, setOptions] = useState(false)

	const onToggleOptions = () => {
		setOptions(prevOptions =>  !prevOptions)
	}

	return (
		<div id="options-drop-down" className={`${options && 'drop-down-display'}`} onClick={onToggleOptions}>
			<div className={`drop-down-value ${options && 'spin-option-wheel'}`}>	
				<OptionsSvg />
			</div>
			
			<ul className="drop-down-list" style={ options ? (review.includes(version) ? { height: '326px' } : { height: '282px' }) : {} }>
				<li onClick={onCreateReview}>Create a review</li>
				{ review.includes(version) && <li onClick={onGoToReview}>Go to review page</li> } 
				<li onClick={onToggleRename}>Rename gallery</li>
				<li onClick={onDeleteImages}>Delete selected images</li>
				<li onClick={onCreateGallery}>Create new gallery based on selected images</li>
				<li onClick={onDeleteVersion}>Delete version</li>
				<li onClick={onDeleteGallery}>Delete gallery</li>
			</ul>
		</div>
	)
}

export default OptionsDropDown
