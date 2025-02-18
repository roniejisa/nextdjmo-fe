import CommentProvider from "./CommentProvider";

const CommentClient = ({ children, ...props }) => {
  return <CommentProvider {...props}>{children}</CommentProvider>;
};

export default CommentClient;