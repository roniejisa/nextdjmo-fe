# SearchFieldSelector Component

Component React để chọn trường tìm kiếm với khả năng tìm kiếm động, hỗ trợ chọn đơn/đa lựa chọn và tích hợp API.

## Tính năng chính

- ✅ Chọn đơn hoặc đa lựa chọn
- ✅ Tìm kiếm động với debounce (300ms)
- ✅ Tích hợp API server hoặc lọc local
- ✅ UI đẹp với animation và hover effects
- ✅ Responsive design
- ✅ Custom rendering cho kết quả tìm kiếm
- ✅ Loading states và error handling

## Cài đặt & Import

```javascript
import { SearchFieldSelector, useSearchFieldSelector } from './SearchFieldSelector';
```

## Props cơ bản

### SearchFieldSelector Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `fields` | `array` | `[]` | Danh sách các trường để chọn |
| `selectedField` | `string` | `""` | Trường đã chọn (chế độ đơn) |
| `selectedFields` | `array` | `[]` | Các trường đã chọn (chế độ đa chọn) |
| `onChange` | `function` | - | Callback khi thay đổi lựa chọn |
| `onSearch` | `function` | - | Callback khi tìm kiếm |
| `onResult` | `function` | - | Callback để render custom kết quả |
| `multiple` | `boolean` | `false` | Bật chế độ đa chọn |
| `disabled` | `boolean` | `false` | Vô hiệu hóa component |
| `loading` | `boolean` | `false` | Hiển thị trạng thái loading |
| `placeholder` | `string` | `"Chọn trường"` | Text placeholder |
| `searchPlaceholder` | `string` | `"Tìm kiếm..."` | Placeholder cho ô tìm kiếm |
| `noResultsText` | `string` | `"Không tìm thấy kết quả"` | Text khi không có kết quả |
| `maxHeight` | `string` | `"16rem"` | Chiều cao tối đa của dropdown |
| `className` | `string` | `""` | CSS class cho button chính |
| `dropdownClassName` | `string` | `""` | CSS class cho dropdown |

### Field Object Structure

```javascript
{
  name: "fieldName",     // Tên trường (bắt buộc)
  label: "Nhãn hiển thị", // Label hiển thị (bắt buộc)
  type: "text"           // Loại trường (component chỉ hiển thị type="text")
}
```

## Sử dụng cơ bản

### 1. Chọn đơn với dữ liệu local

```javascript
const fields = [
  { name: "name", label: "Tên", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Số điện thoại", type: "text" }
];

function MyComponent() {
  const [selectedField, setSelectedField] = useState("");

  return (
    <SearchFieldSelector
      fields={fields}
      selectedField={selectedField}
      onChange={(fieldName, fieldObject) => {
        setSelectedField(fieldName);
      }}
    />
  );
}
```

### 2. Đa chọn với dữ liệu local

```javascript
function MultiSelectComponent() {
  const [selectedFields, setSelectedFields] = useState([]);

  return (
    <SearchFieldSelector
      fields={fields}
      selectedFields={selectedFields}
      multiple={true}
      onChange={(fieldNames, fieldObjects) => {
        setSelectedFields(fieldObjects);
      }}
    />
  );
}
```

### 3. Tích hợp với API bằng useSearchFieldSelector Hook

```javascript
function APIIntegratedComponent() {
  const { fields, loading, error, searchFields } = useSearchFieldSelector(
    "https://api.example.com/fields",
    {
      headers: { "Authorization": "Bearer token" },
      transform: (data) => data.fields, // Transform dữ liệu từ API
      onError: (err) => console.error(err)
    }
  );

  const [selectedField, setSelectedField] = useState("");

  return (
    <SearchFieldSelector
      fields={fields}
      selectedField={selectedField}
      loading={loading}
      onSearch={searchFields} // Tìm kiếm qua API
      onChange={setSelectedField}
    />
  );
}
```

### 4. Tìm kiếm với custom rendering

```javascript
function CustomRenderComponent() {
  const handleSearch = async (searchTerm) => {
    const response = await fetch(`/api/search?q=${searchTerm}`);
    return await response.json();
  };

  const renderResults = (results, { onSelect, isSelected }) => {
    return results.map(item => (
      <div 
        key={item.id}
        onClick={() => onSelect(item)}
        className={`p-3 cursor-pointer ${isSelected(item) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
      >
        <div className="font-medium">{item.label}</div>
        <div className="text-sm text-gray-500">{item.description}</div>
      </div>
    ));
  };

  return (
    <SearchFieldSelector
      onSearch={handleSearch}
      onResult={renderResults}
      // ... other props
    />
  );
}
```

## useSearchFieldSelector Hook

Hook để tích hợp với API server.

### Parameters

```javascript
useSearchFieldSelector(apiUrl, options)
```

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `apiUrl` | `string` | URL API để lấy dữ liệu |
| `options` | `object` | Tùy chọn cấu hình |

### Options Object

```javascript
{
  headers: {},              // HTTP headers
  fetchOptions: {},         // Fetch options bổ sung
  transform: (data) => data, // Hàm transform dữ liệu
  onError: (error) => {}    // Callback xử lý lỗi
}
```

### Return Values

```javascript
{
  fields: [],        // Danh sách fields
  loading: false,    // Trạng thái loading
  error: null,       // Lỗi nếu có
  searchFields: fn,  // Hàm tìm kiếm
  refetch: fn        // Hàm tải lại dữ liệu
}
```

## Callbacks chi tiết

### onChange Callback

```javascript
// Chế độ đơn
onChange(fieldName, fieldObject)

// Chế độ đa chọn  
onChange(fieldNames, fieldObjects)
```

### onResult Callback

```javascript
onResult(searchResults, helpers)

// helpers object:
{
  searchTerm: "...",           // Từ khóa tìm kiếm
  onSelect: (item) => {},      // Hàm chọn item
  isSelected: (item) => bool,  // Kiểm tra item đã chọn
  multiple: boolean,           // Chế độ đa chọn
  selectedValues: []           // Giá trị đã chọn
}
```

## Styling & Customization

Component sử dụng Tailwind CSS với design system nhất quán. Có thể custom thông qua:

- `className`: Style cho button chính
- `dropdownClassName`: Style cho dropdown
- CSS variables cho màu sắc
- Override các class Tailwind

## Lưu ý quan trọng

1. **Field filtering**: Component tự động lọc chỉ hiển thị các field có `type="text"` và `name !== "_id"`
2. **Debounce**: Tìm kiếm được debounce 300ms để tránh spam API
3. **Memory management**: Component tự động cleanup event listeners và timeouts
4. **Error handling**: Sử dụng try-catch và error callbacks để xử lý lỗi
5. **Performance**: Sử dụng useMemo và useCallback để optimize performance

## Browser Support

- Modern browsers với ES6+ support
- React 16.8+ (cần Hooks)
- Tailwind CSS cho styling
