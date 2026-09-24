
export async function onRequestPost(context) {
  try {
    // 1. Đọc dữ liệu gửi lên từ Form HTML
    const formData = await context.request.formData();
    const tenKhach = formData.get('Ten_Khach_Hang');
    const soDienThoai = formData.get('So_Dien_Thoai');
    const loTrinh = formData.get('Lo_Trinh');
    const thoiGian = formData.get('Thoi_Gian_Don');

    // Lấy API Key bí mật được lưu trong cấu hình Cloudflare Pages
    const RESEND_API_KEY = context.env.RESEND_API_KEY;

    // 2. Nội dung Email sẽ gửi về mail@tmc.io.vn
    const emailBody = {
      from: 'He Thong Dat Xe <LienHe@tmc.io.vn>', // Gửi từ chính miền của bạn
      to: ['mail@tmc.io.vn'],                     // Email nhận thông tin của bạn
      subject: `[Đặt Xe Mới] - Khách hàng: ${tenKhach}`,
      html: `
        <h3>Thông tin đặt xe mới từ Website:</h3>
        <p><strong>Tên khách:</strong> ${tenKhach}</p>
        <p><strong>Số điện thoại:</strong> ${soDienThoai}</p>
        <p><strong>Lộ trình:</strong> ${loTrinh}</p>
        <p><strong>Thời gian đón:</strong> ${thoiGian}</p>
      `
    };

    // 3. Gọi API của Resend để kích hoạt gửi mail
    const resendResponse = await fetch('https://resend.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailBody)
    });

    if (!resendResponse.ok) {
      throw new Error('Không thể gửi email qua Resend');
    }

    // 4. Phản hồi lại cho trình duyệt (Chuyển hướng về trang chủ và báo thành công)
    return new Response(
      `<script>alert("Đặt xe thành công! Chúng tôi sẽ gọi lại ngay."); window.location.href="/";</script>`, 
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );

  } catch (error) {
    return new Response(`Lỗi hệ thống: ${error.message}`, { status: 500 });
  }
}
