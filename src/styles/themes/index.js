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
    h1: {
      as: 'h1',
      fontSize: [32],
      letterSpacing: 2,
      fontFamily: fontFamilies.medium,
      m: '30px 0px',
    },
    pageTitle: {
      as: 'span',
      fontSize: [18, 22, 24],
      fontWeight: 500,
      lineHeight: ['18px', '22px', '24px'],
      fontFamily: fontFamilies.medium,
      color: colorStyles.heading,
    },
    buttonTertiary: {
      as: 'span',
      fontSize: [10, 12, 14],
      lineHeight: ['12px', '14px', '16px'],
      fontWeight: 400,
      fontFamily: fontFamilies.regular,
      color: colorStyles.subtext,
    },
    chartData: {
      as: 'span',
      fontSize: [10, 12, 14],
      lineHeight: ['12px', '14px', '16px'],
      fontWeight: 600,
      fontFamily: fontFamilies.regular,
      color: colorStyles.heading,
    },
  };
  return { textStyles, colorStyles };
};

export default theme;
