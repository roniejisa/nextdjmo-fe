export function checkPercent(percent) {
  if (percent > 100) {
    percent = 100;
  }
  if (percent < 0) {
    percent = 0;
  }
  if (isNaN(percent)) {
    percent = 0;
    alert("Chưa tải được thời gian 😒");
  }
  return percent;
}

export function toTime(seconds) {
  var hours = Math.floor(seconds / 60 / 60);
  if (hours < 10) {
    hours = "0" + minutes;
  }
  var minutes = Math.floor(seconds / 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  seconds = Math.floor(seconds - minutes * 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (+hours > 0) {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
}

export const request = {
  endpoint: "",
  headers: {},
  body: {},
  params: {},
  setEndpoint: (endpoint) => {
    request.endpoint = endpoint;
  },
  setHeaders: (key, value) => {
    request.headers[key] = value;
  },
  setBody: (key, value) => {
    request.body[key] = value;
  },
  buildData: (data, type) => {
    if (type === "json") {
      return JSON.stringify(data);
    } else {
      var params = [];
      for (const [key, value] of Object.entries(data)) {
        params.push(`${key}=${value}`);
      }
      params = params.join("&");
      return params;
    }
  },
  setParam: (key, value) => {
    request.params[key] = value;
  },
  send: async (method, url, body = null, type = "json") => {
    let dataParam = "";
    const options = {
      headers: request.headers,
    };
    if (type === "json") {
      options.headers["Content-Type"] = "application/json";
    } else if (type === "form") {
      options.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (body) {
      if (
        method === "GET" ||
        options.headers["Content-Type"] === "application/x-www-form-urlencoded"
      ) {
        options["body"] = request.buildData(body);
      } else {
        options["body"] = JSON.stringify(body);
      }
    }
    if (Object.entries(request.params).length) {
      dataParam += "?" + request.buildData(request.params);
    }

    options["method"] = method;
    try {
      const response = await fetch(
        `${request.getEndpoint()}${url}${dataParam}`,
        options
      );
      if(type === 'file'){
        return {
          data: response,
          status: "OK"
        }
      }
      const json = await response.json();

      return {
        error: false,
        status: "OK",
        data: json,
      };
    } catch (err) {
      return {
        error: true,
        message: err,
      };
    }
  },
  getEndpoint: () => {
    return request.endpoint;
  },
  setEndpoint: (endpoint) => {
    request.endpoint = endpoint;
    return request
  },

  get: async (url, body = null, type = "json") => {
    return await request.send("GET", url, body, type);
  },
  post: async (url, body, type = "json") => {
    return await request.send("POST", url, body, type);
  },
};

export const KEY_PLAYLIST_MAIN = "PLAYLIST_MAIN";
export const KEY_TIME_LAST_UPDATE = "TIME_LAST_UPDATE";

export const isMobile = typeof navigator !== 'undefined' && 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export const KEY_HOME = "HOME";