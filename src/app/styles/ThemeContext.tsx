
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { lightColors, darkColors } from './colorThemes';

const getStyles = (colors: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    input: {
      color: colors.text,
      height: 40,
      margin: 12,
      borderWidth: 1,
    },
    text: {
      color: colors.text,
    },
    textSecondary: {
      color: colors.textSecondary,
    },
    webView: {
      flex: 1,
      marginTop: 20,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'white',
      borderColor: 'black'
    },
  });
  return styles;
}

export const ThemeContext = React.createContext({
  isDark: false,
  colors: lightColors,
  styles: getStyles(lightColors),
  setScheme: (scheme) => { },
});

export const ThemeProvider = (props) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = React.useState(colorScheme === "dark");

  React.useEffect(() => {
    setIsDark(colorScheme === "dark");
  }, [colorScheme]);

  const defaultTheme = {
    isDark,
    colors: isDark ? darkColors : lightColors,
    styles: getStyles(isDark ? darkColors : lightColors),
    setScheme: (scheme) => setIsDark(scheme === "dark"),
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useTheme = () => React.useContext(ThemeContext);