import { createContext, useContext } from "react";

const themeContext = createContext()

export const useThemeContext = () => {
    return useContext(themeContext)
}

export const ThemeProvider = themeContext.Provider