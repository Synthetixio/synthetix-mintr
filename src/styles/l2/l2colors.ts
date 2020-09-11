interface ILayer2Colors {
	brand: {
		yellow: string;
		green: string;
		blue: string;
		red: string;
		purple: string;
	};
	accent: {
		l1: string;
	};
	purple: {
		l1: string;
		l2: string;
		l3: string;
		l4: string;
		l5: string;
		l6: string;
	};
	gradients: {
		l1: {
			color1: string;
			color2: string;
		};
		l2: {
			color1: string;
			color2: string;
		};
		l3: {
			color1: string;
			color2: string;
		};
	};
	common: {
		white: string;
		black: string;
	};
}

const Layer2Colors: ILayer2Colors = {
	brand: {
		yellow: '#935DFF',
		green: '#935DFF',
		blue: '#935DFF',
		red: '#935DFF',
		purple: '#935DFF',
	},
	accent: {
		l1: '#00E2DF',
	},
	purple: {
		l1: '#020B29',
		l2: '#0F0F33',
		l3: '#1B1B3F',
		l4: '#282862',
		l5: '#908FDA',
		l6: '#CACAF1',
	},
	gradients: {
		l1: {
			color1: '#F49E25',
			color2: '#B252E9',
		},
		l2: {
			color1: '#F4C625',
			color2: '#E652E9',
		},
		l3: {
			color1: '#3130AF',
			color2: '#5834B2',
		},
	},
	common: {
		white: '#FFFFFF',
		black: '#666666',
	},
};

export default Layer2Colors;
