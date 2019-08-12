import themeLight from './light';
import themeDark from './dark';

const theme = mode => (mode === 'dark' ? themeDark : themeLight);

export default theme;
