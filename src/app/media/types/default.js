export const mediaOptions = (id) => {
    return [
        {
            text: "Xóa",
            attribute: {
                onClick: () => console.log(id)
            }
        }
    ]
};