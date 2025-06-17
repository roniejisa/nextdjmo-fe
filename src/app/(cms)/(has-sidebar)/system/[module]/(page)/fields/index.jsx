import Bool from "./Bool";
import Email from "./Email";
import ImageComponent from "./Image";
import ImageListComponent from "./ImageList";
import Password from "./Password";
import Text from "./Text";
import SelectParent from "./SelectParent";
import Editor from "./Editor";
import SelectList from "./SelectList";
import Slug from "./Slug";
import DateComponent from "./Date";
import Textarea from "./Textarea";
import Repeat from "./Repeat";
import Tab from "./Tab";
import Key from "./Key";
import FieldType from "./FieldType";
import Link from "./Link";
import Permission from "./Permission";
import MultipleCheckbox from "./MultipleCheckbox";
import ProductVariant from "./ProductVariant";
import Language from "./Language";
import PageBuilder from "./PageBuilder";
import CodeEditor from "./CodeEditor";
import Select from "./Select";
import Category from "./Category";
import Tag from "./Tag";
import Selectors from "./Selectors";
import Phone from "./Phone";
import TwoFA from "./TwoFA";
import Rating from "./Rating";

export const components = {
  text: Text,
  email: Email,
  image: ImageComponent,
  list_image: ImageListComponent,
  bool: Bool,
  password: Password,
  editor: Editor,
  select_parent: SelectParent,
  select_list: SelectList,
  slug: Slug,
  repeat: Repeat,
  date: DateComponent,
  textarea: Textarea,
  tab: Tab,
  key: Key,
  field_type: FieldType,
  link: Link,
  permission: Permission,
  multiple_checkbox: MultipleCheckbox,
  product_variants: ProductVariant,
  language: Language,
  page_builder: PageBuilder,
  code_editor: CodeEditor,
  select: Select,
  category: Category,
  tag: Tag,
  selectors: Selectors,
  phone: Phone,
  text: Text,
  two_fa: TwoFA,
  rating: Rating,
};
