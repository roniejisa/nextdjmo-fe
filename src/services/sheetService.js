import { google } from "googleapis";

const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY;
const spreadsheetId = process.env.SPREADSHEET_ID;

function connectSheet() {
  // Khởi tạo auth
  const auth = new google.auth.JWT(
    email,
    undefined,
    // privateKey có thể chứa \n, cần thay thế cho đúng
    privateKey?.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  // Khởi tạo client
  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

export async function addRow(row) {
  const sheets = connectSheet();
  await sheets.spreadsheets.values.append(row);
}

export async function fetchRow(range, spreadsheetId) {
  // Lấy biến môi trường
  const sheets = connectSheet();
  // Gửi request đọc dữ liệu, vd đọc từ sheet1, range A1:D
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return response;
}

export async function findIndex(spreadsheetId, id) {
  const sheets = connectSheet();

  // Get all rows
  const sheetRes = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `'Trang Tính1'!A2:D`,
  });

  const rows = sheetRes.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === id);
  return rowIndex;
}

export async function editRow(row) {
  const sheets = connectSheet();
  await sheets.spreadsheets.values.update(row);
}

export async function deleteRow(spreadsheetId, rowIndex) {
  const sheets = connectSheet();
  // Dùng batchUpdate để xoá dòng
  return await sheets.spreadsheets.batchUpdate({
    spreadsheetId: spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // Nếu bạn chỉ có 1 sheet → mặc định là 0
              dimension: "ROWS",
              startIndex: rowIndex + 1, // A2 = index 1
              endIndex: rowIndex + 2,
            },
          },
        },
      ],
    },
  });
}
