import SocketProvider from "@/context/SocketProvider";

const WebLayout = ({ children }) => {
  return (
    <SocketProvider>
      <main>{children}</main>
    </SocketProvider>
  );
};

export default WebLayout;
