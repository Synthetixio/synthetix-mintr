import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
	0% {
		background-position: 0% 0%;
	}
	100% {
		background-position: -135% 0%;
	}
`;

const Skeleton = styled.div`
  display: inline-block;
	border-radius: ${props => (props.curved ? '50%' : '2px')}
  width: ${props => (props.width ? props.width : '90px')};
  height: ${props => (props.height ? props.height : '15px')};
  background: ${props =>
		'linear-gradient(-90deg, ' +
		props.theme.colorStyles.skeletonDark +
		' 0%, ' +
		props.theme.colorStyles.skeletonLight +
		' 50%, ' +
		props.theme.colorStyles.skeletonDark +
		' 100%)'};
  background-size: 400% 400%;
  animation: ${pulse} 1.4s ease-out infinite;
`;

export default Skeleton;
