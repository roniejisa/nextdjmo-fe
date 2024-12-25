"use server";
export const httpClient = {
  fetch: async (url, customHeaders = {}, body = {}, method = "GET") => {
    try {
      const options = {
        cache: "no-cache",
        headers: {
          "X-API-KEY": "123456",
          ...customHeaders,
        },
        method,
      };

      if (Object.keys(body).length > 0) {
        if (method === "GET") {
          const searchParams = new URLSearchParams(body);
          url = url + "?" + searchParams.toString();
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
      }

      const response = await fetch(url, options);
      // Không cần xử lý refresh token nữa vì khi chạy qua middleware thì nó đã tự động lấy lại rồi

      const data = await response.json();
      return data
    } catch (error) {
      return []
    }
  },
  get: async (url, headers, body) => {
    return await httpClient.fetch(url, headers, body, "GET")
  },
  post: async (url, headers, body) => {
    return await httpClient.fetch(url, headers, body, "POST")
  },
  put: async (url, headers, body) => {
    return await httpClient.fetch(url, headers, body, "PUT")
  },
  patch: async (url, headers, body) => {
    return await httpClient.fetch(url, headers, body, "PATCH")
  },
  delete: async (url, headers, body) => {
    return await httpClient.fetch(url, headers, body, "DELETE")
  },
};
