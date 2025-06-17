import EditItem from "./fields/buttons/EditItem";
import ReadItem from "./fields/buttons/ReadItem";
import CopyItem from "./fields/buttons/CopyItem";
import BuilderItem from "./fields/buttons/BuilderItem";
import Phone from "./fields/Phone";
import OrderStatus from "./fields/OrderStatus";
import PaymentStatus from "./fields/PaymentStatus";
import Slug from "./fields/Slug";
import DeleteItem from "./fields/buttons/DeleteItem";
import Editor from "./fields/Editor";
import Text from "./fields/Text";
import ImageComponent from "./fields/Image";
import Bool from "./fields/Bool";
import Email from "./fields/Email";
import Textarea from "./fields/Textarea";
import SelectList from "./fields/SelectList";
import Date from "./fields/Date";
import Select from "./fields/Select";
import Category from "./fields/Category";
import Language from "./fields/Language";
import Tag from "./fields/Tag";
import ImageList from "./fields/ImageList";
import Rating from "./fields/Rating";
import Selectors from "./fields/Selectors";

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
  rating:Rating,
  selectors: Selectors
};

export const componentActions = {
  delete: DeleteItem,
  edit: EditItem,
  read: ReadItem,
  copy: CopyItem,
  builder: BuilderItem,
};