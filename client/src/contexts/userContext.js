import { createContext, useContext } from "react";

const userContext = createContext()

export const useUserContext = () => {
    return useContext(userContext)
}

export const UserProvider = userContext.Provider