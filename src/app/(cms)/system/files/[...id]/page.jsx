import MediaComponent from "@/components/Media/MediaComponent"
import ImageProvider from "@/context/ImageProvider"

const FileManager = ({params}) => {
  const { id } = params
  return (
    <ImageProvider>
        <h3>Quản lý tệp tin</h3>
        <MediaComponent id={id}/>
    </ImageProvider>
  )
}

export default FileManager