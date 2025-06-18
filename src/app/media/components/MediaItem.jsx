import { VIEW_MODES } from "../lib"

const MediaItem = ({children, className, onClick, onDoubleClick, index, viewMode}) => {
  return (
    <div className={`${viewMode == VIEW_MODES.GRID ? 'h-0 pt-[100%] relative' : 'h-auto' }  ${className}`} onClick={onClick} onDoubleClick={onDoubleClick} index={index}>
        {children}
    </div>
  )
}

export default MediaItem