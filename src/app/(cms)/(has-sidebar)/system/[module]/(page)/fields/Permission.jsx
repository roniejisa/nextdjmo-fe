"use client";
import { useEffect, useMemo, useRef, useState } from "react";

const Permission = ({ field, value }) => {
  const initialValue = useMemo(() => field?.value ?? [], [field?.value]);
  const [values, setValues] = useState(initialValue);
  const permissionRef = useRef(null);

  // Reset values khi field.value thay đổi
  useEffect(() => {
    setValues(field?.value ?? []);
  }, [field?.value]);

  const handleChangeAll = (e) => {
    const checked = e.target.checked;
    const value = e.target.dataset.value;
    
    // Lấy tất cả checkbox con của permission này
    const allPermissions = [
      `${value}.read`,
      `${value}.create`, 
      `${value}.update`,
      `${value}.delete`
    ];

    // Kiểm tra có bao nhiêu permission đã được check
    const checkedPermissions = allPermissions.filter(perm => values.includes(perm));
    
    if (checkedPermissions.length === allPermissions.length && !checked) {
      // Nếu tất cả đã check và click để uncheck -> bỏ tất cả
      setValues(prev => prev.filter(val => !allPermissions.includes(val)));
    } else {
      // Ngược lại -> check tất cả
      setValues(prev => [...new Set([...prev, ...allPermissions])]);
    }
  };

  const handleCheckbox = (e) => {
    const value = e.target.dataset.value;
    const checked = e.target.checked;
    
    if (checked) {
      setValues(prev => [...prev, value]);
    } else {
      setValues(prev => prev.filter(oldValue => oldValue !== value));
    }
  };

  // Cập nhật ref khi values thay đổi
  useEffect(() => {
    if (permissionRef.current) {
      permissionRef.current.value = JSON.stringify(values);
    }
  }, [values]);

  // Helper function để check xem permission có được select không
  const isPermissionChecked = (permissionValue) => {
    return values.includes(permissionValue);
  };

  // Helper function để check xem tất cả permission của group có được select không
  const isAllPermissionsChecked = (groupValue) => {
    const allPermissions = [
      `${groupValue}.read`,
      `${groupValue}.create`,
      `${groupValue}.update`, 
      `${groupValue}.delete`
    ];
    return allPermissions.every(perm => values.includes(perm));
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-screen-md">
      <div className="permission-field max-w-7xl mx-auto">
        <textarea name={field?.name} hidden ref={permissionRef}></textarea>

        <div className="space-y-6">
          {field?.data
            ?.filter(
              (permission) =>
                permission?.active !== "inactive" && permission?.name !== ""
            )
            .map((group) => (
              <div key={group.group} className="group">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-indigo-600">
                          <th className="text-white font-semibold py-4 px-4 sm:px-6 text-left min-w-[200px] lg:min-w-[300px]">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
                              <span className="text-sm sm:text-base lg:text-lg font-medium">
                                {group.label}
                              </span>
                            </div>
                          </th>
                          <th className="text-white font-medium py-4 px-2 sm:px-4 text-center w-16 sm:w-20 lg:w-24">
                            <div className="flex flex-col items-center space-y-1">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full"></div>
                              <span className="text-xs sm:text-sm">Xem</span>
                            </div>
                          </th>
                          <th className="text-white font-medium py-4 px-2 sm:px-4 text-center w-16 sm:w-20 lg:w-24">
                            <div className="flex flex-col items-center space-y-1">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full"></div>
                              <span className="text-xs sm:text-sm">Thêm</span>
                            </div>
                          </th>
                          <th className="text-white font-medium py-4 px-2 sm:px-4 text-center w-16 sm:w-20 lg:w-24">
                            <div className="flex flex-col items-center space-y-1">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 rounded-full"></div>
                              <span className="text-xs sm:text-sm">Sửa</span>
                            </div>
                          </th>
                          <th className="text-white font-medium py-4 px-2 sm:px-4 text-center w-16 sm:w-20 lg:w-24">
                            <div className="flex flex-col items-center space-y-1">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-400 rounded-full"></div>
                              <span className="text-xs sm:text-sm">Xóa</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.permissions && group.permissions.length ? (
                          group.permissions
                            .filter(
                              (permission) => permission?.active !== "inactive"
                            )
                            .map((permission, index) => (
                              <tr
                                key={group.group + "." + permission.name}
                                data-permission={permission.name}
                                className="hover:bg-gray-50 transition-colors duration-200"
                              >
                                <td className="py-3 sm:py-4 px-4 sm:px-6">
                                  <label
                                    htmlFor={permission.name + ".all"}
                                    className="flex items-center space-x-3 cursor-pointer group/label"
                                  >
                                    <div className="flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 opacity-60 group-hover/label:opacity-100 transition-opacity duration-200"></div>
                                    <span className="text-gray-700 text-sm sm:text-base font-medium group-hover/label:text-gray-900 transition-colors duration-200">
                                      {permission.label}
                                    </span>
                                    <input
                                      type="checkbox"
                                      id={permission.name + ".all"}
                                      data-value={permission.name}
                                      hidden
                                      onChange={handleChangeAll}
                                      checked={isAllPermissionsChecked(permission.name)}
                                    />
                                  </label>
                                </td>
                                <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                  <label
                                    htmlFor={permission.name + ".read"}
                                    className="flex justify-center cursor-pointer"
                                  >
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        onChange={handleCheckbox}
                                        data-value={permission.name + ".read"}
                                        id={permission.name + ".read"}
                                        className="sr-only peer"
                                        checked={isPermissionChecked(permission.name + ".read")}
                                      />
                                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 border-2 border-gray-300 rounded-md peer-checked:bg-green-500 peer-checked:border-green-500 transition-all duration-200 flex items-center justify-center hover:border-green-400 hover:bg-green-50">
                                        <svg
                                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </label>
                                </td>
                                <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                  <label
                                    htmlFor={permission.name + ".create"}
                                    className="flex justify-center cursor-pointer"
                                  >
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        onChange={handleCheckbox}
                                        data-value={permission.name + ".create"}
                                        id={permission.name + ".create"}
                                        className="sr-only peer"
                                        checked={isPermissionChecked(permission.name + ".create")}
                                      />
                                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 border-2 border-gray-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50">
                                        <svg
                                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </label>
                                </td>
                                <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                  <label
                                    htmlFor={permission.name + ".update"}
                                    className="flex justify-center cursor-pointer"
                                  >
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        onChange={handleCheckbox}
                                        data-value={permission.name + ".update"}
                                        id={permission.name + ".update"}
                                        className="sr-only peer"
                                        checked={isPermissionChecked(permission.name + ".update")}
                                      />
                                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 border-2 border-gray-300 rounded-md peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all duration-200 flex items-center justify-center hover:border-amber-400 hover:bg-amber-50">
                                        <svg
                                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </label>
                                </td>
                                <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                  <label
                                    htmlFor={permission.name + ".delete"}
                                    className="flex justify-center cursor-pointer"
                                  >
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        onChange={handleCheckbox}
                                        data-value={permission.name + ".delete"}
                                        id={permission.name + ".delete"}
                                        className="sr-only peer"
                                        checked={isPermissionChecked(permission.name + ".delete")}
                                      />
                                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 border-2 border-gray-300 rounded-md peer-checked:bg-red-500 peer-checked:border-red-500 transition-all duration-200 flex items-center justify-center hover:border-red-400 hover:bg-red-50">
                                        <svg
                                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </label>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr
                            data-permission={group.name}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="py-3 sm:py-4 px-4 sm:px-6">
                              <label
                                htmlFor={group.name + ".all"}
                                className="flex items-center space-x-3 cursor-pointer group/label"
                              >
                                <div className="flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 opacity-60 group-hover/label:opacity-100 transition-opacity duration-200"></div>
                                <span className="text-gray-700 text-sm sm:text-base font-medium group-hover/label:text-gray-900 transition-colors duration-200">
                                  {group.label}
                                </span>
                                <input
                                  type="checkbox"
                                  id={group.name + ".all"}
                                  data-value={group.name}
                                  hidden
                                  onChange={handleChangeAll}
                                  checked={isAllPermissionsChecked(group.name)}
                                />
                              </label>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                              <label
                                htmlFor={group.name + ".read"}
                                className="flex justify-center cursor-pointer"
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    onChange={handleCheckbox}
                                    data-value={group.name + ".read"}
                                    id={group.name + ".read"}
                                    className="sr-only peer"
                                    checked={isPermissionChecked(group.name + ".read")}
                                  />
                                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 border-2 border-gray-300 rounded-md peer-checked:bg-green-500 peer-checked:border-green-500 transition-all duration-200 flex items-center justify-center hover:border-green-400 hover:bg-green-50">
                                    <svg
                                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                              </label>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                              <label
                                htmlFor={group.name + ".create"}
                                className="flex justify-center cursor-pointer"
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    onChange={handleCheckbox}
                                    data-value={group.name + ".create"}
                                    id={group.name + ".create"}
                                    className="sr-only peer"
                                    checked={isPermissionChecked(group.name + ".create")}
                                  />
                                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 border-2 border-gray-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50">
                                    <svg
                                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                              </label>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                              <label
                                htmlFor={group.name + ".update"}
                                className="flex justify-center cursor-pointer"
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    onChange={handleCheckbox}
                                    data-value={group.name + ".update"}
                                    id={group.name + ".update"}
                                    className="sr-only peer"
                                    checked={isPermissionChecked(group.name + ".update")}
                                  />
                                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 border-2 border-gray-300 rounded-md peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all duration-200 flex items-center justify-center hover:border-amber-400 hover:bg-amber-50">
                                    <svg
                                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                              </label>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                              <label
                                htmlFor={group.name + ".delete"}
                                className="flex justify-center cursor-pointer"
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    onChange={handleCheckbox}
                                    data-value={group.name + ".delete"}
                                    id={group.name + ".delete"}
                                    className="sr-only peer"
                                    checked={isPermissionChecked(group.name + ".delete")}
                                  />
                                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 border-2 border-gray-300 rounded-md peer-checked:bg-red-500 peer-checked:border-red-500 transition-all duration-200 flex items-center justify-center hover:border-red-400 hover:bg-red-50">
                                    <svg
                                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                              </label>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Permission;