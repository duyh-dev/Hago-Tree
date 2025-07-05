// Sinh mã OTP ngẫu nhiên 6-8 số
function generateOTP(length = 6) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

// Hiển thị mã OTP lên giao diện
document.addEventListener('DOMContentLoaded', function() {
  const otpLength = 6 + Math.floor(Math.random() * 3); // 6-8 số
  document.getElementById('otpCode').textContent = generateOTP(otpLength);
});
