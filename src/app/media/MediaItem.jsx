
const MediaItem = ({children, className, onClick, onDoubleClick, index}) => {
  return (
    <div className={`h-[160px] rounded-lg border relative ${className}`} onClick={onClick} onDoubleClick={onDoubleClick} index={index}>
        {children}
    </div>
  )
}

export default MediaItem