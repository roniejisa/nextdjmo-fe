import { useContext, useEffect } from "react";
import { BuilderContext } from "../providers/BuilderProvider";
import { httpClient } from "@/utils/http";
import { useNotify } from "@/context/NotifyProvider";
import { toSlug } from "@/utils/client/util";

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
        attributes: { title: "Undo" },
      });

      // Nút Redo
      editor.Panels.addButton("options", {
        id: "redo",
        className: "fa fa-repeat", // Đây là class mặc định có sẵn trong GrapesJS
        command: "core:redo",
        attributes: { title: "Repeat" },
      });

      editor.Panels.addButton("options", {
        id: "clear", // ID cho nút Redo
        className: "fa fa-trash", // Icon cho nút Redo
        command: "core:canvas-clear", // Lệnh cho Redo
        attributes: { title: "Clear" },
      });

      editor.Panels.addButton("options", {
        id: "saveDb", // ID cho nút Redo
        className: "fa fa-save", // Icon cho nút Redo
        command: "saveDb", // Lệnh cho Redo
        attributes: { title: "Redo" },
      });

      if (id) {
        editor.Panels.addButton("options", {
          id: "modal-edit", // ID cho nút Redo
          className: "fa fa-pencil", // Icon cho nút Redo
          command: "modal-edit", // Lệnh cho Redo
          attributes: { title: "Sửa thông tin trang" },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, id]);

  useEffect(() => {
    if (editor) {
      editor.Commands.add("saveDb", {
        run: async (editor, sender) => {
          // Lấy HTML của canvas
          const html = editor.getHtml();
          const css = editor.getCss();

          // Gửi dữ liệu HTML và CSS để lưu vào database
          const response = await httpClient(
            process.env.NEXT_PUBLIC_ENDPOINT_URL + "pages/save",
            {
              Authorization: `Bearer ${token}`,
            },
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

      editor.Commands.add("modal-edit", {
        run: async (editor, sender) => {
          // Lấy HTML của canvas
          // Tạo HTML cho modal
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
                <span>Sửa thông tin trang</span>
                <button class="close-modal" style="cursor:pointer; font-size:14px; font-weight:600;width:24px; height:24px; display:flex; justify-content:center; align-items:center; border-radius:50%; border:1px solid #cccccc50; background-color:#cccccc50;color:#cacaca;">&times;</button>
              </div>
              <label>
                <span>Tên</span>
                <input name="name" style="padding:10px; border:1px solid #ccc; border-radius:5px; margin-top:10px; width:100%" placeholder="Nhập tên trang" value="${page.name}"/>
              </label>
              <label>
                <span>Đường dẫn</span>
                <input name="slug" style="padding:10px; border:1px solid #ccc; border-radius:5px; margin-top:10px; width:100%" placeholder="Nhập tên trang" value="${page.slug}"/>
              </label>
              <button class="save-content" style="cursor:pointer; font-size:20px; font-weight:600; background-color:#2a85ff; color:#fff; padding:10px; border-radius:5px; margin-top:10px">Lưu lại</button>
            </div>
          `;

          // Thêm modal vào DOM
          document.body.append(modalHTML);

          // Mở modal
          const closeButton = modalHTML.querySelector(".close-modal");
          const saveButton = modalHTML.querySelector(".save-content");
          const nameInp = modalHTML.querySelector("[name='name']");
          const slugInp = modalHTML.querySelector("[name='slug']");

          slugInp.onchange = async (e) => {
            const slug = toSlug(e.target.value);
            e.target.value = slug;
            const response = await httpClient(
              process.env.NEXT_PUBLIC_ENDPOINT_URL + "pages/check-slug",
              {
                Authorization: `Bearer ${token}`,
              },
              {
                id,
                slug,
              },
              "POST"
            );
            if (response.status != 200) {
              e.target.value = "";
            }
            notify.changeNotify(
              response.status === 200 ? "success" : "error",
              response.message
            );
          };
          // Xử lý sự kiện đóng modal
          closeButton.addEventListener("click", () => {
            modalHTML.remove();
          });

          // Xử lý lưu nội dung
          saveButton.addEventListener("click", async () => {
            const name = nameInp.value;
            const slug = slugInp.value;
            if (!slug.trim()) {
              return slugInp.focus();
            }
            const response = await httpClient(
              process.env.NEXT_PUBLIC_ENDPOINT_URL + "pages/save",
              {
                Authorization: `Bearer ${token}`,
              },
              {
                id,
                name,
                slug,
              },
              "POST"
            );
            if (response.status == 200) {
              modalHTML.remove(); // Đóng modal
              setPage((prev) => {
                return {
                  ...prev,
                  name,
                  slug,
                };
              });
              notify.changeNotify(
                response.status == (200 || 201) ? "success" : "error",
                response.message
              );
            }
          });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, id, page]);

  return null;
};

export default CommandManager;
