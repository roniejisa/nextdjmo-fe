
const MediaItem = ({children, className, onClick, onDoubleClick, index}) => {
  return (
    <div className={`h-0 pt-[100%] rounded-lg relative ${className}`} onClick={onClick} onDoubleClick={onDoubleClick} index={index}>
        {children}
    </div>
  )
}

export default MediaItem