import './VersionsDropDown.scss'
import React, { useState } from 'react'

const VersionsDropDown = ({versions, version, onSelectVersion, getVersionName}) => {
	const [versionsDropDown, setVersionsDropDown] = useState(false)

	const onToggleVersionsDropDown = () => {
		setVersionsDropDown(prevVersionsDropDown =>  !prevVersionsDropDown)
	}

	return (
		<div id="versions-drop-down" className={`${versionsDropDown && 'drop-down-display'}`} onClick={onToggleVersionsDropDown}>
			<div className="row">
				<p className="version-text">Version: </p>
				<div className="drop-down-value">{ getVersionName(version) }</div>
			</div>
			
			<ul className="drop-down-list" style={ versionsDropDown ? { height: `${(Object.keys(versions).length * 44) - 1}px` } : {} }>
				{
					Object.keys(versions).sort((a,b) => a - b).reverse().map((version, index) => <li onClick={() => onSelectVersion(version)} key={version}>{ getVersionName(version) }</li>)
				}
			</ul>

			<div className="arrow"></div>
		</div>
	)
}

export default VersionsDropDown
