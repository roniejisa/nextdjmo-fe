import Footer from '@/components/ui/client/Footer'
import Header from '@/components/ui/client/Header'

const WebLayout = ({children}) => {
  return (
    <>
        <Header />
        <main>
            {children}
        </main>
        <Footer />
    </>
  )
}

export default WebLayout