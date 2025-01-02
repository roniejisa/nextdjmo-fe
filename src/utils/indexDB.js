export const getOrCreateIndexDB = (name, version, tables = ["myConfig"]) => {
    const request = indexedDB.open(name, version);
    let db = null;
    const connectDB = async () => {
        if (!db) {
            return new Promise((resolve, reject) => {
                request.onupgradeneeded = function (event) {
                    db = event.target.result;
                    // Tạo bảng lưu lại config web
                    for (const table of tables) {
                        if (!db.objectStoreNames.contains(table)) {
                            db.createObjectStore(table, { keyPath: "id", autoIncrement: true }); // "id" là khóa chính
                        }
                    }
                    resolve(db);
                };

                request.onerror = function (event) {
                    console.error("Error upgrading database");
                    reject(event.target.error);
                };

                request.onsuccess = function (event) {
                    db = event.target.result;
                    // Kiểm tra và tạo bảng nếu cần
                    for (const table of tables) {
                        if (!db.objectStoreNames.contains(table)) {
                            const versionChangeRequest = indexedDB.open(name, version + 1); // Tăng version để upgrade
                            versionChangeRequest.onupgradeneeded = (event) => {
                                db = event.target.result;
                                db.createObjectStore(table, { keyPath: "id", autoIncrement: true });
                                resolve(db);
                            };
                            versionChangeRequest.onsuccess = () => resolve(db);
                            versionChangeRequest.onerror = () => reject("Failed to upgrade database.");

                            return;
                        }
                    }
                    resolve(db);
                };
            });
        }
        return db;
    }


    return {
        set: async (table, data) => {
            const db = await connectDB();
            return new Promise((resolve) => {
                const transaction = db.transaction([table], "readwrite");
                const store = transaction.objectStore(table);

                const request = store.add(data);
                request.onsuccess = function () {
                    resolve({
                        status: true,
                        data: request.result,
                        message: "Data added successfully"
                    });
                };

                request.onerror = function () {
                    resolve({
                        status: false,
                        data: null,
                        message: "Error adding data"
                    })
                };
            })
        },
        update: async (table, data) => {
            const db = await connectDB();
            return new Promise((resolve) => {
                const transaction = db.transaction([table], "readwrite");
                const store = transaction.objectStore(table);

                const request = store.put(data);
                request.onsuccess = function () {
                    resolve({
                        status: true,
                        data: request.result,
                        message: "Data updated successfully"
                    })
                };

                request.onerror = function () {
                    resolve({
                        status: false,
                        data: null,
                        message: "Error updating data"
                    })
                };
            })

        },
        delete: async (table, key) => {
            const db = await connectDB();
            return new Promise((resolve) => {
                const transaction = db.transaction([table], "readwrite");
                const store = transaction.objectStore(table);

                const request = store.delete(key);
                request.onsuccess = function () {
                    resolve({
                        status: true,
                        data: request.result,
                        message: "Data deleted successfully"
                    });
                };

                request.onerror = function () {
                    resolve({
                        status: false,
                        data: null,
                        message: "Error deleting data"
                    });
                };
            })
        },
        get: async (table, key) => {
            const db = await connectDB();
            return new Promise((resolve) => {

                const transaction = db.transaction([table], "readonly");
                const store = transaction.objectStore(table);

                const request = store.get(key);
                request.onsuccess = function () {
                    resolve({
                        status: true,
                        data: request.result,
                        message: "Data retrieved successfully"
                    });
                };

                request.onerror = function () {
                    resolve({
                        status: false,
                        data: null,
                        message: "Error retrieving data"
                    });
                };
            })
        },
        getOrSet: async (table, key, data) => {
            const db = await connectDB();
            return new Promise((resolve) => {
                try {
                    const transaction = db.transaction([table], "readwrite");
                    const store = transaction.objectStore(table);

                    const request = store.get(key);
                    request.onsuccess = function () {
                        if (request.result) {
                            return resolve({
                                status: true,
                                data: request.result,
                                message: "Data retrieved successfully"
                            });
                        } else {
                            const request = store.add(data);
                            request.onsuccess = function () {
                                resolve({
                                    status: true,
                                    data: request.result,
                                    message: "Data added successfully"
                                });
                            };
                            request.onerror = function () {
                                resolve({
                                    status: false,
                                    data: null,
                                    message: "Error adding data"
                                })
                            };
                        }
                    };
                    request.onerror = function () {
                        console.error("Error retrieving data");
                    };
                } catch (e) {
                    resolve({
                        status: false,
                        data: null,
                        message: "Error adding data"
                    })
                }
            })
        }
    }
}