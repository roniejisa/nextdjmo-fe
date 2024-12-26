import Footer from "@/components/ui/client/Footer";
import Header from "@/components/ui/client/Header";
import GoogleSignIn from "@/components/Google/GoogleSignIn";
import AllEffect from "@/components/Effects/All";

const WebLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <GoogleSignIn />
      <AllEffect />
      <Footer />
    </>
  );
};

export default WebLayout;
