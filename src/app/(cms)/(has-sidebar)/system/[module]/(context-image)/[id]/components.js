import Editor from "./components/Editor";
import SelectParent from "./components/SelectParent";
import ImageListComponent from "./components/ImageList";
import SelectList from "./components/SelectList";
import Slug from "./components/Slug";
import Repeat from "./components/Repeat";
import DateComponent from "./components/Date";
import Textarea from "./components/Textarea";
import Link from "./components/Link";
import FieldType from "./components/FieldType";
import Key from "./components/Key";
import Tab from "./components/Tab";
import Permission from "./components/Permission";
import MultipleCheckbox from "./components/MultipleCheckbox";
import ProductVariant from "./components/ProductVariant";
import Language from "./components/Language";
import PageBuilder from "./components/PageBuilder";
import TwoFA from "./components/TwoFA";
import CodeEditor from "./components/CodeEditor";
import Bool from "./components/Bool";
import Email from "./components/Email";
import ImageComponent from "./components/Image";
import Text from "./components/Text";
import Password from "./components/Password";
import Select from "./components/Select";
import Category from "./components/Category";
import Tag from "./components/Tag";

export const components = {
    text: Text,
    email: Email,
    image: ImageComponent,
    bool: Bool,
    password: Password,
    editor: Editor,
    select_parent: SelectParent,
    list_image: ImageListComponent,
    select_list: SelectList,
    slug: Slug,
    repeat: Repeat,
    date: DateComponent,
    textarea: Textarea,
    link: Link,
    field_type: FieldType,
    key: Key,
    tab: Tab,
    permission: Permission,
    multiple_checkbox: MultipleCheckbox,
    product_variants: ProductVariant,
    language: Language,
    page_builder: PageBuilder,
    two_fa: TwoFA,
    code_editor: CodeEditor,
    select: Select,
    category: Category,
    tag:Tag
};