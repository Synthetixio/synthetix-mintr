import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
	name: 'modal',
	initialState: {
		modalType: null,
		modalProps: {},
	},
	reducers: {
		showModal: (state, action) => {
			const { modalType, modalProps } = action.payload;
			state.modalType = modalType;
			state.modalProps = modalProps;
		},
		hideModal: state => {
			state.modalType = null;
			state.modalProps = {};
		},
	},
});

export const getModalState = state => state.modal;

const { showModal, hideModal } = modalSlice.actions;

export { showModal, hideModal };

export default modalSlice.reducer;
