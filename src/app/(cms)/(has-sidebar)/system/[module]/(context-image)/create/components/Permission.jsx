"use client";
import { useEffect, useRef, useState } from "react";

const Permission = ({ field, defaultValue }) => {
  const [values, setValues] = useState([]);
  const permissionRef = useRef(null);

  const handleChangeAll = (e) => {
    const checked = e.target.checked;
    const value = e.target.dataset.value;
    const inputNoChecked = document.querySelectorAll(
      `[data-permission="${value}"] input:not(:checked):not([hidden])`
    );
    const listInputAll = document.querySelectorAll(
      `[data-permission="${value}"] input:not([hidden])`
    );

    if (
      (inputNoChecked.length != 0 &&
        inputNoChecked.length != listInputAll.length) ||
      inputNoChecked.length != 0 ||
      checked
    ) {
      listInputAll.forEach((input) => {
        input.checked = true;
      });

      setValues((prev) => {
        return [
          ...new Set([
            ...prev,
            ...[
              `${value}.read`,
              `${value}.create`,
              `${value}.update`,
              `${value}.delete`,
            ],
          ]),
        ];
      });
    } else {
      listInputAll.forEach((input) => {
        input.checked = false;
      });
      setValues((prev) => {
        const newValues = prev.filter(
          (oldValue) =>
            oldValue != `${value}.read` &&
            oldValue != `${value}.create` &&
            oldValue != `${value}.update` &&
            oldValue != `${value}.delete`
        );
        return [...newValues];
      });
    }
  };

  const handleCheckbox = (e) => {
    const value = e.target.dataset.value; 
    const checked = e.target.checked;
    if (checked) {
      setValues([...values, value]);
    } else {
      setValues((prev) => {
        const newValues = prev.filter((oldValue) => oldValue != value);
        return [...newValues];
      });
    }
  };

  useEffect(() => {
    if (values) {
      permissionRef.current.value = JSON.stringify(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);
  return (
    <div className="permission-field">
      <textarea name={field.name} hidden ref={permissionRef}></textarea>
      {field.data.filter(permission => permission?.active != "inactive" && permission?.name != "").map((group) => (
        <div key={group.group}>
          <div>
            <table className="border">
              <thead>
                <tr>
                  <th className="bg-blue-500 text-white w-[200px]">
                    {group.label}
                  </th>
                  <th className="w-20">Xem</th>
                  <th className="w-20">Thêm</th>
                  <th className="w-20">Sửa</th>
                  <th className="w-20">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {group.permissions && group.permissions.length ? (
                  group.permissions.filter(permission => permission?.active != "inactive").map((permission) => (
                    <tr
                      key={group.group + "." + permission.name}
                      data-permission={permission.name}
                    >
                      <td>
                        <label htmlFor={permission.name + ".all"}>
                          {permission.label}
                          <input
                            type="checkbox"
                            id={permission.name + ".all"}
                            data-value={permission.name}
                            hidden
                            onChange={handleChangeAll}
                          />
                        </label>
                      </td>
                      <td>
                        <label htmlFor={permission.name + ".read"}>
                          <input
                            type="checkbox"
                            onChange={handleCheckbox}
                            data-value={permission.name + ".read"}
                            id={permission.name + ".read"}
                          />
                        </label>
                      </td>
                      <td>
                        <label htmlFor={permission.name + ".create"}>
                          <input
                            type="checkbox"
                            onChange={handleCheckbox}
                            data-value={permission.name + ".create"}
                            id={permission.name + ".create"}
                          />
                        </label>
                      </td>
                      <td>
                        <label htmlFor={permission.name + ".update"}>
                          <input
                            type="checkbox"
                            onChange={handleCheckbox}
                            data-value={permission.name + ".update"}
                            id={permission.name + ".update"}
                          />
                        </label>
                      </td>
                      <td>
                        <label htmlFor={permission.name + ".delete"}>
                          <input
                            type="checkbox"
                            onChange={handleCheckbox}
                            data-value={permission.name + ".delete"}
                            id={permission.name + ".delete"}
                          />
                        </label>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr data-permission={group.name}>
                    <td>
                      <label htmlFor={group.name + ".all"}>
                        {group.label}
                        <input
                          type="checkbox"
                          id={group.name + ".all"}
                          data-value={group.name}
                          hidden
                          onChange={handleChangeAll}
                        />
                      </label>
                    </td>
                    <td>
                      <label htmlFor={group.name + ".read"}>
                        <input
                          type="checkbox"
                          onChange={handleCheckbox}
                          data-value={group.name + ".read"}
                          id={group.name + ".read"}
                        />
                      </label>
                    </td>
                    <td>
                      <label htmlFor={group.name + ".create"}>
                        <input
                          type="checkbox"
                          onChange={handleCheckbox}
                          data-value={group.name + ".create"}
                          id={group.name + ".create"}
                        />
                      </label>
                    </td>
                    <td>
                      <label htmlFor={group.name + ".update"}>
                        <input
                          type="checkbox"
                          onChange={handleCheckbox}
                          data-value={group.name + ".update"}
                          id={group.name + ".update"}
                        />
                      </label>
                    </td>
                    <td>
                      <label htmlFor={group.name + ".delete"}>
                        <input
                          type="checkbox"
                          onChange={handleCheckbox}
                          data-value={group.name + ".delete"}
                          id={group.name + ".delete"}
                        />
                      </label>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Permission;
