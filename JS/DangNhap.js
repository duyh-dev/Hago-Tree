// Chuyển giữa form đăng nhập và đăng ký
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Xử lý submit form (demo)
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(`Đăng nhập với email: ${loginForm.loginEmail.value}`);
  // TODO: gửi dữ liệu đăng nhập lên server xử lý
  loginForm.reset();
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    registerForm.registerPassword.value !==
    registerForm.registerPasswordConfirm.value
  ) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }
  alert(`Đăng ký tài khoản email: ${registerForm.registerEmail.value}`);
  // TODO: gửi dữ liệu đăng ký lên server xử lý
  registerForm.reset();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});
