import BuilderProvider from "./providers/BuilderProvider"

const layout = ({children}) => {
  return (
    <BuilderProvider>
        {children}
    </BuilderProvider>
  )
}

export default layout