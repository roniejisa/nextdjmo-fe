"use client"

import { useContext } from "react"
import { CommentContext } from "./CommentProvider";

const CommentContent = () => {
  const {showModel, setShowModel} = useContext(CommentContext);
  return (
    <div className="p-4">
        <h3 className="text-2xl">Bình luận sản phẩm</h3>
        <div>
          <div></div>
          <button onClick={() => setShowModel(true)}>Đánh giá</button>
        </div>
    </div>
  )
}

export default CommentContent