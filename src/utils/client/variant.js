export const generateCombinations = (attributes) => {
    // Khởi tạo danh sách combinations ban đầu
    let combinations = [{}];

    attributes.forEach((attribute, indexAttr) => {
        const { name, values } = attribute;
        const newCombinations = [];
        // Nói chung là đã giá trị đầu tiên bắt buộc phải có 1 cái là ít nhất 1 giá trị đã
        // Nếu không có giá trị cho thuộc tính, giữ lại các combination hiện có và thêm giá trị trống cho thuộc tính đó
        if (indexAttr == 0 && values.length <= 1) {
            combinations.forEach((combo) => {
                newCombinations.push({
                    id: values[0]?.id,
                    ...combo,
                    [name]: values[0].value,
                });
            });
        } else if (
            values.length === 0 ||
            values.every((objValue) => !objValue.value)
        ) {
            combinations.forEach((combo) => {
                newCombinations.push({
                    id: indexAttr == 0 ? combo?.id : "",
                    ...combo,
                    [name]: "",
                });
            });
        } else {
            // Có giá trị đầu tiên thì cứ lấy đi lấy lại cái đầu tiên là xong

            // Tạo combinations mới nếu thuộc tính có giá trị
            values
                .filter((value) => value.value)
                .forEach((value) => {
                    combinations.forEach((combo) => {
                        // Chỗ này kiểm tra nếu id đã tồn tại thì lấy id cũ
                        newCombinations.push({
                            id: indexAttr == 0 ? value?.id : "",
                            ...combo,
                            [name]: value.value,
                        });
                    });
                });
        }
        combinations = newCombinations; // Cập nhật combinations
    });

    return combinations;
};

export const sortData = (data) => {
    // Tạo một Map để nhóm dữ liệu theo number
    const grouped = new Map();

    // Nhóm dữ liệu theo number
    data.forEach((item) => {
        const value = Object.values(item)[0]; // Lấy giá trị đầu tiên trong đối tượng (ví dụ: "đỏ", "đen", "x")

        if (!grouped.has(value)) {
            grouped.set(value, []); // Nếu chưa có, tạo một mảng mới cho giá trị đó
        }
        grouped.get(value).push(item); // Thêm đối tượng vào nhóm có giá trị tương ứng
    });

    // Sắp xếp kết quả theo number và value trong mỗi nhóm
    const result = [];
    [...grouped.keys()] // Lấy danh sách keys (number)
        .sort((a, b) => a - b) // Sắp xếp theo number
        .forEach((number) => {
            const group = grouped.get(number);
            // Kiểm tra và sắp xếp theo value nếu value là chuỗi
            group.sort((a, b) => {
                if (a.value && b.value) {
                    return a.value.localeCompare(b.value); // Sắp xếp theo value nếu có giá trị
                }
                return 0; // Nếu không có giá trị valid, không thay đổi thứ tự
            });
            result.push(...group); // Thêm các phần tử vào kết quả
        });

    return result;
};

export const generateKey = (item) => {
    const arrayData = Object.entries(item)
        .map((entry) => {
            if (!["price", "sku", "stock", "image"].includes(entry[0])) {
                return entry;
            }
            return null;
        })
        .filter((entry) => entry !== null);
    return arrayData.map((entry) => entry.join(":")).join("|");
};