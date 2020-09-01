import React, { useRef, useMemo } from 'react'
import { AddAPhoto, Clear } from '@material-ui/icons'
import { Button } from '@material-ui/core'
import './style.scss'

const ImageUploader = ({ onChange = () => {}, value = null }) => {
	const input = useRef()

	const imageSrc = useMemo(() => {
		if (value instanceof File) return window.URL.createObjectURL(value)
		if (typeof value === 'string') return value
		return null
	}, [value])

	const onFileChosen = e => {
		let file = e.target.files ? e.target.files[0] : null
		if (file) onChange(file)
	}

	const clear = () => {
		onChange(null)
	}

	return (
		<div className="ImageUploader">
			<input ref={input} type="file" className="file-upload" onChange={onFileChosen} />

			<Button className="pb-take-photo" onClick={() => input.current.click()}>
				<AddAPhoto />
			</Button>

			<div className="taken-photo-container">
				{imageSrc && (
					<>
						<img src={imageSrc} alt="tenant add" />
						<div className="clear-button" onClick={clear}>
							<Clear fontSize="large" />
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default ImageUploader
