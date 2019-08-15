import themeLight from './light';
import themeDark from './dark';

const fontFamilies = {
  regular: 'apercu-regular',
  medium: 'apercu-medium',
  bold: 'apercu-bold',
};

const theme = mode => {
  const colorStyles = mode === 'dark' ? themeDark : themeLight;
  const textStyles = {
    canon: {
      as: 'h1',
      fontSize: [11, 12, 14],
      fontWeight: 700,
      lineHeight: ['32px', '36px', '56px'],
      fontFamily: fontFamilies.bold,
      color: colorStyles.heading,
    },
    trafalgar: {
      as: 'h3',
      fontSize: [6, 9, 12],
      lineHeight: ['24px', '28px', '40px'],
      fontWeight: 500,
      fontFamily: fontFamilies.medium,
      color: colorStyles.body,
    },
  };
  return { textStyles, colorStyles };
};

export default theme;
