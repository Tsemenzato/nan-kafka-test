import { createGlobalStyle, DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;
    dropShadow: (opacity: number) => string;
    font: {
      fontFamily: string;
    };
    colors: {
      main: string;
      highlight: string;
      light: string;
      white: string;
      error: string;
    };
  }
}

const myTheme: DefaultTheme = {
  borderRadius: '4px',
  dropShadow: (opacity: number) => `0 15px 25px -10px rgba(0,0,0,${opacity / 100})`,
  font: {
    fontFamily: 'sans-serif',
  },
  colors: {
    main: '#392F5A',
    highlight: '#F4D06F',
    light: '#FFF8F0',
    white: '#fff',
    error: '#D74E09',
  },
};

const GlobalStyles = createGlobalStyle<{ theme: DefaultTheme }>`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.main}
  }
`;

export default myTheme;
export { GlobalStyles };
