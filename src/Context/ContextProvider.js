import React, { createContext, useState } from 'react'

export const ProvideContext = createContext()
const ContextProvider = ({children}) => {
    const[search,setSearch] = useState("")
    const[watch,setWatch] = useState([])
    const[star,setStar] = useState([])
  return (
    <ProvideContext.Provider
    value={{
        search,
        setSearch,
        watch,
        setWatch,
        star,
        setStar
    }}
    >{children}</ProvideContext.Provider>
  )
}

export default ContextProvider