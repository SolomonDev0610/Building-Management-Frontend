import React, { useRef } from 'react'
import { AttachFile, Clear, CloudDownload } from '@material-ui/icons'
import { Button } from '@material-ui/core'
import IconFileDocx from 'assets/img/file-docx.png'
import IconFilePptx from 'assets/img/file-pptx.png'
import IconFileXlsx from 'assets/img/file-xlsx.png'
import IconFilePdf from 'assets/img/file-pdf.png'
import IconFileTxt from 'assets/img/file-txt.png'
import IconFile from 'assets/img/file-pb.png'
import './style.scss'
import config from 'config'

const noop = _ => {}

const icon = file => {
	console.log('file', file)
	const parts = file.id ? file.filename.split('.') : file.name.split('.')
	const filetype = parts[parts.length - 1]

	switch (filetype) {
		case 'docx':
			return IconFileDocx
		case 'pptx':
			return IconFilePptx
		case 'xlsx':
			return IconFileXlsx
		case 'pdf':
			return IconFilePdf
		case 'txt':
			return IconFileTxt
		default:
			return IconFile
	}
}

const FileUploader = ({ onChange = noop, onRemove = noop, value = null }) => {
	const input = useRef()

	const onFileChosen = e => {
		let file = e.target.files ? e.target.files[0] : null
		if (file && value.findIndex(x => (x.id ? x.filename : x.name) === file.name) === -1) onChange(file)
	}

	return (
		<div className="FileUploader">
			<input ref={input} type="file" className="file-upload" onChange={onFileChosen} />

			<Button className="pb-take-photo" onClick={() => input.current.click()}>
				<AttachFile />
			</Button>

			{value.length > 0 ? (
				value.map((file, i) => (
					<div key={i} className="taken-photo-container" title={file.name}>
						<img src={icon(file)} alt="tenant add" />
						<div className="clear-button">
							<a href={file.id ? config.URL + file.path : window.URL.createObjectURL(file)}>
								<CloudDownload />
							</a>
							<Clear fontSize="large" onClick={() => onRemove(file)} />
						</div>
					</div>
				))
			) : (
				<div className="taken-photo-container" />
			)}
		</div>
	)
}

export default FileUploader
