import Footer from "@/components/ui/client/Footer";
import Header from "@/components/ui/client/Header";
import GoogleSignIn from "@/components/Google/GoogleSignIn";

const WebLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <GoogleSignIn />
      <Footer />
      
      {/* <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        /> */}
    </>
  );
};

export default WebLayout;
