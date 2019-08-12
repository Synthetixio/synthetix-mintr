const white = '#FFFFFF';
const black = '#161617';
const gray = '#F8F8F9';

const themeLight = {
  background: gray,
  body: black,
};

const themeDark = {
  background: black,
  body: white,
};

const theme = mode => (mode === 'dark' ? themeDark : themeLight);

export default theme;
