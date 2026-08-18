const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType, BorderStyle, convertInchesToTwip } = require('docx');
const fs = require('fs');
const path = require('path');

// Admin Guide Content
const adminGuideDoc = new Document({
  sections: [{
    children: [
      // Title
      new Paragraph({
        text: "HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ NHÂN SỰ",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
      new Paragraph({
        text: "Dành cho Quản trị viên (Admin)",
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),

      // Table of Contents
      new Paragraph({
        text: "MỤC LỤC",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: "1. Giới thiệu hệ thống",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "2. Đăng nhập vào hệ thống",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "3. Quản lý nhân viên",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "4. Quản lý chấm công",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "5. Quản lý kỳ nghỉ phép",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "6. Quản lý chi phí",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "7. Quản lý lương",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "8. Quản lý KPI",
        spacing: { after: 200 },
      }),

      // Section 1
      new Paragraph({
        text: "1. GIỚI THIỆU HỆ THỐNG",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "Hệ thống quản lý nhân sự là công cụ toàn diện giúp các quản trị viên quản lý thông tin nhân viên, chấm công, kỳ nghỉ phép, chi phí, lương và KPI.",
        spacing: { after: 200 },
      }),

      // Section 2
      new Paragraph({
        text: "2. ĐĂNG NHẬP VÀO HỆ THỐNG",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "Bước 1: Truy cập trang đăng nhập của hệ thống",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "Bước 2: Nhập tên đăng nhập (email) và mật khẩu",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "Bước 3: Nhấn nút 'Đăng nhập' để vào dashboard chính",
        spacing: { after: 200 },
      }),

      // Section 3
      new Paragraph({
        text: "3. QUẢN LÝ NHÂN VIÊN",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "Thêm nhân viên mới:",
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "• Nhấn nút 'Thêm nhân viên'",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Điền thông tin: Họ tên, email, số điện thoại, vị trí, phòng ban",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Nhấn 'Lưu' để thêm nhân viên mới",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "Xem danh sách nhân viên:",
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "• Chọn 'Danh sách nhân viên' từ menu",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Xem tất cả nhân viên và thông tin chi tiết của họ",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Có thể chỉnh sửa hoặc xóa thông tin nhân viên",
        spacing: { after: 200 },
      }),

      // Section 4
      new Paragraph({
        text: "4. QUẢN LÝ CHẤM CÔNG",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "• Xem lịch sử chấm công của từng nhân viên",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Kiểm tra tần suất vắng mặt và đi làm đúng giờ",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Báo cáo chấm công hàng tháng",
        spacing: { after: 200 },
      }),

      // Section 5
      new Paragraph({
        text: "5. QUẢN LÝ KỲ NGHỈ PHÉP",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "• Xem các yêu cầu nghỉ phép từ nhân viên",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Phê duyệt hoặc từ chối yêu cầu nghỉ phép",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Quản lý số ngày phép còn lại của từng nhân viên",
        spacing: { after: 200 },
      }),

      // Section 6
      new Paragraph({
        text: "6. QUẢN LÝ CHI PHÍ",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "• Xem tất cả các chi phí được báo cáo",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Phê duyệt hoặc từ chối chi phí",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Tạo báo cáo chi phí theo tháng hoặc năm",
        spacing: { after: 200 },
      }),

      // Section 7
      new Paragraph({
        text: "7. QUẢN LÝ LƯƠNG",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "• Cập nhật thông tin lương của nhân viên",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Tính toán lương hàng tháng",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Xuất báo cáo lương",
        spacing: { after: 200 },
      }),

      // Section 8
      new Paragraph({
        text: "8. QUẢN LÝ KPI",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "• Đặt KPI cho từng nhân viên",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Theo dõi tiến độ hoàn thành KPI",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Đánh giá hiệu suất làm việc",
        spacing: { after: 200 },
      }),

      // Footer
      new Paragraph({
        text: "Liên hệ hỗ trợ: support@company.com",
        spacing: { before: 200 },
        alignment: AlignmentType.CENTER,
        italics: true,
      }),
    ],
  }],
});

// Employee Guide Content
const employeeGuideDoc = new Document({
  sections: [{
    children: [
      // Title
      new Paragraph({
        text: "HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ NHÂN SỰ",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
      new Paragraph({
        text: "Dành cho Nhân viên",
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),

      // Table of Contents
      new Paragraph({
        text: "MỤC LỤC",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: "1. Giới thiệu hệ thống",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "2. Đăng nhập vào hệ thống",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "3. Bảng điều khiển cá nhân",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "4. Quản lý chấm công",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "5. Yêu cầu nghỉ phép",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "6. Xem KPI cá nhân",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "7. Quản lý tài khoản",
        spacing: { after: 200 },
      }),

      // Section 1
      new Paragraph({
        text: "1. GIỚI THIỆU HỆ THỐNG",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "Hệ thống quản lý nhân sự giúp bạn quản lý thông tin cá nhân, chấm công, kỳ nghỉ phép, xem lương và theo dõi KPI của mình.",
        spacing: { after: 200 },
      }),

      // Section 2
      new Paragraph({
        text: "2. ĐĂNG NHẬP VÀO HỆ THỐNG",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "Bước 1: Truy cập trang đăng nhập của hệ thống",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "Bước 2: Nhập email và mật khẩu của bạn",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "Bước 3: Nhấn nút 'Đăng nhập' để vào dashboard cá nhân",
        spacing: { after: 200 },
      }),

      // Section 3
      new Paragraph({
        text: "3. BẢNG ĐIỀU KHIỂN CÁ NHÂN (DASHBOARD)",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "Bảng điều khiển cá nhân hiển thị:",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "• Thông tin cá nhân: Họ tên, email, vị trí, phòng ban",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Số ngày phép còn lại",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Chấm công hôm nay",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Thông tin KPI hiện tại",
        spacing: { after: 200 },
      }),

      // Section 4
      new Paragraph({
        text: "4. QUẢN LÝ CHẤM CÔNG",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "Xem lịch sử chấm công:",
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "• Chọn 'Lịch sử chấm công' từ menu cá nhân",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Xem các ngày bạn đã chấm công",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Thời gian vào và ra khỏi công ty",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "Thông tin chính:",
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "• Tổng số ngày đi làm",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Số lần vắng mặt",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Ngày đi làm muộn hoặc về sớm",
        spacing: { after: 200 },
      }),

      // Section 5
      new Paragraph({
        text: "5. YÊU CẦU NGHỈ PHÉP",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "Đề xuất yêu cầu nghỉ phép:",
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "• Chọn 'Yêu cầu nghỉ phép' từ menu",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Chọn ngày bắt đầu và ngày kết thúc",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Nhập lý do (tùy chọn)",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Nhấn 'Gửi yêu cầu'",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "Xem trạng thái yêu cầu:",
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "• Chờ phê duyệt từ quản trị viên",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Nhận thông báo khi yêu cầu được phê duyệt hoặc từ chối",
        spacing: { after: 200 },
      }),

      // Section 6
      new Paragraph({
        text: "6. XEM KPI CÁ NHÂN",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "• Chọn 'KPI của tôi' từ menu",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Xem các KPI được giao cho bạn",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Theo dõi tiến độ hoàn thành",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Xem đánh giá hiệu suất từ quản lý",
        spacing: { after: 200 },
      }),

      // Section 7
      new Paragraph({
        text: "7. QUẢN LÝ TÀI KHOẢN CÁ NHÂN",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: "Cập nhật thông tin cá nhân:",
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "• Chọn 'Quản lý tài khoản' từ menu",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Cập nhật email hoặc số điện thoại",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Nhấn 'Lưu thay đổi'",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "Đổi mật khẩu:",
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "• Chọn 'Đổi mật khẩu'",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Nhập mật khẩu cũ và mật khẩu mới",
        spacing: { after: 50 },
      }),
      new Paragraph({
        text: "• Nhấn 'Xác nhận' để lưu mật khẩu mới",
        spacing: { after: 200 },
      }),

      // Footer
      new Paragraph({
        text: "Liên hệ hỗ trợ: support@company.com",
        spacing: { before: 200 },
        alignment: AlignmentType.CENTER,
        italics: true,
      }),
    ],
  }],
});

// Generate documents
async function generateDocuments() {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '../documents');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate Admin Guide
    const adminBytes = await Packer.toBuffer(adminGuideDoc);
    fs.writeFileSync(
      path.join(outputDir, 'Huong_Dan_Su_Dung_Admin.docx'),
      adminBytes
    );
    console.log('✓ Tạo thành công: Huong_Dan_Su_Dung_Admin.docx');

    // Generate Employee Guide
    const employeeBytes = await Packer.toBuffer(employeeGuideDoc);
    fs.writeFileSync(
      path.join(outputDir, 'Huong_Dan_Su_Dung_Nhan_Vien.docx'),
      employeeBytes
    );
    console.log('✓ Tạo thành công: Huong_Dan_Su_Dung_Nhan_Vien.docx');

    console.log('\n✓ Hai file hướng dẫn đã được tạo thành công trong thư mục "documents"');
  } catch (error) {
    console.error('Lỗi khi tạo file:', error);
    process.exit(1);
  }
}

generateDocuments();
