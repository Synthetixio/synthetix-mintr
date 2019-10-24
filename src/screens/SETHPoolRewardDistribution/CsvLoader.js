import React from 'react';
import papaparse from 'papaparse';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

import { ButtonSecondary } from '../../components/Button';
import { PMega, PLarge } from '../../components/Typography';

import COLORS from '../../styles/colors';

export default ({ onDataLoaded }) => {
	const onFileChange = files => {
		const fileReader = new FileReader();
		fileReader.onloadend = e => {
			const data = papaparse.parse(e.target.result, {
				delimiter: ',',
				header: false,
				skipEmptyLines: true,
			}).data;
			onDataLoaded(data);
		};
		fileReader.readAsText(files[0]);
	};
	const {
		getRootProps,
		getInputProps,
		open,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		noClick: true,
		noKeyboard: true,
		accept: 'text/csv',
		onDropAccepted: onFileChange,
	});
	return (
		<Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
			<input {...getInputProps()} />
			<PMega fontWeight="bold" margin={0}>
				Drag and drop CSV here
			</PMega>
			<TextContainer>
				<PLarge color={COLORS.light1}>OR</PLarge>
			</TextContainer>
			<ButtonSecondary onClick={open}>browse files</ButtonSecondary>
		</Container>
	);
};

const getColor = props => {
	console.log(props);

	if (props.isDragAccept) {
		return COLORS.brandGreen;
	}
	if (props.isDragReject) {
		return COLORS.brandRed;
	}
	return COLORS.light3;
};

const Container = styled('div')`
	border: 2px dashed ${props => getColor(props)};
	width: 100%;
	height: 300px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const TextContainer = styled.div`
	margin: 10px 0;
`;
