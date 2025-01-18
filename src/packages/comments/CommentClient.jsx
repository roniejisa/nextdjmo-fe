import CommentProvider from "./CommentProvider";

const CommentClient = ({ children }) => {
  return <CommentProvider>{children}</CommentProvider>;
};

export default CommentClient;
