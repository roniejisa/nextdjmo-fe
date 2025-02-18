import EditItem from "./components/buttons/EditItem";
import ReadItem from "./components/buttons/ReadItem";
import CopyItem from "./components/buttons/CopyItem";
import BuilderItem from "./components/buttons/BuilderItem";
import Phone from "./components/Phone";
import OrderStatus from "./components/OrderStatus";
import PaymentStatus from "./components/PaymentStatus";
import Slug from "./components/Slug";
import DeleteItem from "./components/buttons/DeleteItem";
import Editor from "./components/Editor";
import Text from "./components/Text";
import ImageComponent from "./components/Image";
import Bool from "./components/Bool";
import Email from "./components/Email";
import Textarea from "./components/Textarea";
import SelectList from "./components/SelectList";
import Date from "./components/Date";
import Select from "./components/Select";
import Category from "./components/Category";
import Language from "./components/Language";
import Tag from "./components/Tag";
import ImageList from "./components/ImageList";
import Rating from "./components/Rating";

export const components = {
  text: Text,
  image: ImageComponent,
  bool: Bool,
  email: Email,
  editor: Editor,
  slug: Slug,
  phone: Phone,
  order_status: OrderStatus,
  payment_status: PaymentStatus,
  textarea: Textarea,
  select_list:SelectList,
  date:Date,
  select:Select,
  category:Category,
  language:Language,
  tag:Tag,
  list_image:ImageList,
  rating:Rating
};

export const componentActions = {
  delete: DeleteItem,
  edit: EditItem,
  read: ReadItem,
  copy: CopyItem,
  builder: BuilderItem,
};