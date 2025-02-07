// import Footer from "@/components/ui/client/Footer";
// import Header from "@/components/ui/client/Header";
// import GoogleSignIn from "@/components/Google/GoogleSignIn";
// import AllEffect from "@/components/Effects/All";
import SocketProvider from "@/context/SocketProvider";

const WebLayout = ({ children }) => {
  return (
    <SocketProvider>
      {/* <Header /> */}
      <main>{children}</main>
      {/* <GoogleSignIn /> */}
      {/* <Footer /> */}
      {/* <AllEffect /> */}
    </SocketProvider>
  );
};

export default WebLayout;
