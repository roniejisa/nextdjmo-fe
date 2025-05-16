import {
  addRow,
  deleteRow,
  editRow,
  fetchRow,
  findIndex,
} from "@/services/sheetService";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const spreadsheetId = process.env.SPREADSHEET_ID;

export async function GET(request) {
  try {
    const response = await fetchRow(
      "TrangTínhA1:D1",
      spreadsheetId
    );
    const rows = response.data.values || [];

    // 📦 Đọc query param page & limit
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // 🧠 Cắt mảng theo page
    const startIndex = (page - 1) * limit;
    const pagedData = rows.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: pagedData,
      page,
      limit,
      totalRows: rows.length,
      totalPages: Math.ceil(rows.length / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, email, age } = await req.json();
    const id = uuidv4();

    await addRow({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `'Trang Tính1'!A:D`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[id, name, email, age]],
      },
    });

    return NextResponse.json({ success: true, message: "Đã thêm dòng!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { name, email, age } = await req.json();

    const rowIndex = await findIndex(spreadsheetId, id);

    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy dòng để sửa" },
        { status: 404 }
      );
    }

    // Update đúng dòng (cộng thêm 2 vì A2 bắt đầu từ hàng thứ 2)
    await editRow({
      spreadsheetId: spreadsheetId,
      range: `'Trang Tính1'!A${rowIndex + 2}:D${rowIndex + 2}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[id, name, email, age]],
      },
    });

    return NextResponse.json({ success: true, message: "Đã cập nhật!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const rowIndex = findIndex(spreadsheetId, id);
    // Dùng batchUpdate để xoá dòng
    const result = await deleteRow(spreadsheetId, rowIndex);
    if(result){
      return NextResponse.json({ success: true, message: "Đã xoá!" });
    }else{
      throw new Error("Đã có lỗi xảy ra")
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
