import { useContext, useEffect } from "react";
import { BuilderContext } from "../providers/BuilderProvider";
import { httpClient } from "@/utils/http";
import { useNotify } from "@/context/NotifyProvider";

const CommandManager = () => {
  const notify = useNotify();
  const { editor, token, id, setId, page, setPage } =
    useContext(BuilderContext);
  useEffect(() => {
    if (editor) {
      // Nút Undo
      editor.Panels.addButton("options", {
        id: "undo",
        className: "fa fa-undo", // Đây là class mặc định có sẵn trong GrapesJS
        command: "core:undo",
        attributes: { title: "Hoàn tác" },
      });

      // Nút Redo
      editor.Panels.addButton("options", {
        id: "redo",
        className: "fa fa-repeat", // Đây là class mặc định có sẵn trong GrapesJS
        command: "core:redo",
        attributes: { title: "Làm lại" },
      });

      editor.Panels.addButton("options", {
        id: "clear", // ID cho nút Redo
        className: "fa fa-trash", // Icon cho nút Redo
        command: "delete-all", // Lệnh cho Redo
        attributes: { title: "Xóa toàn bộ" },
      });

      editor.Panels.addButton("options", {
        id: "viewSite", // ID cho nút Redo
        className: "fa fa-globe", // Icon cho nút Redo
        command: "viewSite", // Lệnh cho Redo
        attributes: { title: "Xem thực tế" },
      });

      editor.Panels.addButton("options", {
        id: "saveDb", // ID cho nút Redo
        className: "fa fa-save", // Icon cho nút Redo
        command: "saveDb", // Lệnh cho Redo
        attributes: { title: "Lưu lại" },
      });

      // if (id) {
      //   editor.Panels.addButton("options", {
      //     id: "modal-edit", // ID cho nút Redo
      //     className: "fa fa-pencil", // Icon cho nút Redo
      //     command: "modal-edit", // Lệnh cho Redo
      //     attributes: { title: "Sửa thông tin trang" },
      //   });
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, id]);

  useEffect(() => {
    if (editor) {
      // Chỉnh sửa trong page nhưng khả năng bỏ
      editor.Commands.add("delete-all", {
        run: async (editor, sender) => {
          // Lấy HTML của canvas
          // Tạo HTML cho modal
          const { modalHTML, saveButton } = createModalInGrapes(
            `Bạn có chắc chắn muốn xóa toàn bộ trang không?`
          );
          // Xử lý lưu nội dung
          saveButton.addEventListener("click", async () => {
            editor.DomComponents.clear();
            modalHTML.remove();
          });
        },
      });

      editor.Commands.add("viewSite", {
        run: () => {
          window.open(`/${page.slug}`);
        },
      });

      editor.Commands.add("saveDb", {
        run: async (editor, sender) => {
          // Lấy HTML của canvas
          const html = editor.getHtml();
          const css = editor.getCss();

          // Gửi dữ liệu HTML và CSS để lưu vào database
          const response = await httpClient(
            process.env.NEXT_PUBLIC_ENDPOINT_URL + "pages/save",
            {},
            {
              id,
              data: JSON.stringify({
                html: html
                  .replace("<body", "<section")
                  .replace("</body>", "</section>"),
                css: css,
              }),
            },
            "POST"
          );
          if (response.status == 201) {
            setId(response.data._id);
            setPage(response.data);
          }
          notify.changeNotify(
            response.status == (200 || 201) ? "success" : "error",
            response.message
          );
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, id, page]);

  return null;
};

export default CommandManager;

const createModalInGrapes = (html, btnTitle = "Đồng ý") => {
  const modalHTML = document.createElement("div");
  Object.assign(modalHTML.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "8888",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  modalHTML.innerHTML = `
            <div class="my-modal" style="background-color:#fff; padding:20px; border-radius:5px; max-width:600px; width:100%">
              <div style="display:flex; justify-content:space-between; align-items:center">
                <span style="display:block;font-size:24px">Sửa thông tin trang</span>
                <button class="close-modal">&times;</button>
              </div>
              ${html}
              <div>
                <button class="save-content">${btnTitle}</button>
              </div>
            </div>

            <style>
              .close-modal{
                cursor:pointer; 
                font-size:14px; 
                font-weight:600;
                width:24px; 
                height:24px; 
                display:flex; 
                justify-content:center; 
                align-items:center; 
                border-radius:50%; 
                border:1px solid #cccccc50; 
                background-color:#cccccc50;
                color:#cacaca;
                transition:all 300ms
              }
              .close-modal:hover{
                background-color:#cccccc90;
                color:black;
              }

              .save-content{
                cursor:pointer; 
                font-size:20px; 
                font-weight:600; 
                background-color:#2a85ff; 
                color:#fff; 
                padding:10px; 
                border-radius:5px; 
                margin-top:10px;
                transition:all 300ms
              }
              
              .save-content:hover{
                background-color:#1f70dd
              }
            </style>
          `;

  // Thêm modal vào DOM
  document.body.append(modalHTML);

  // Mở modal
  const closeButton = modalHTML.querySelector(".close-modal");
  const saveButton = modalHTML.querySelector(".save-content");

  // Xử lý sự kiện đóng modal
  closeButton.addEventListener("click", () => {
    modalHTML.remove();
  });

  return { modalHTML, saveButton };
};
