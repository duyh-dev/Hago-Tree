let user = JSON.parse(localStorage.getItem("user")) || [];
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const showFogotPass = document.getElementById("showFogotPass");
const forgotPassForm = document.getElementById("ForgotPassForm");
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  forgotPassForm.classList.add("hidden");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  forgotPassForm.classList.add("hidden");
});
showFogotPass.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.add("hidden");
  loginForm.classList.add("hidden");
  forgotPassForm.classList.remove("hidden");
});
 function sendOTP() {
    const email = document.getElementById("registerEmail").value;

    if (!email) {
      alert("Vui lòng nhập email trước khi nhận mã xác nhận.");
      return;
    }

    fetch("https://dssc.hagotree.site/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Mã OTP đã được gửi tới email của bạn.");
        } else {
          alert("Gửi OTP thất bại: " + data.message);
        }
      });
  }

  function verifyOTP() {
    const email = document.getElementById("registerEmail").value;
    const otpInput = document.getElementById("OTPPassword").value;

    if (!otpInput) {
      alert("Vui lòng nhập mã OTP.");
      return;
    }

    fetch("https://dssc.hagotree.site/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: otpInput })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Xác nhận OTP thành công. Bạn có thể đăng ký.");
          document.getElementById("registerBtn").disabled = false;
        } else {
          alert("OTP không hợp lệ hoặc đã hết hạn.");
        }
      });
  }
window.addEventListener("DOMContentLoaded", () => {


  const user = JSON.parse(localStorage.getItem("user")) || [];

  if ((user.length > 0) & (localStorage.getItem("userPassword").length >0 )) {
    const lastUser = user[user.length - 1];
    console.log(lastUser.email);
    document.getElementById("Accountchecker").innerHTML = lastUser.email;
    }
  if (user.length > 0) {
    const lastUser = user[user.length - 1];

    loginForm.loginEmail.value = lastUser.email || '';
    loginForm.loginPassword.value = localStorage.getItem("userPassword") || '';
    const loginFormdata = Object.fromEntries(new FormData(loginForm).entries()); 
    fetch('https://dssc.hagotree.site/dang-nhap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginFormdata)  // xử lý các phần riêng biệt thành những phần tử trong json
  })

  .then(response => {
    if (response.status === 201) {
      user.push({
        email: loginFormdata.loginEmail,
      });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userPassword", loginFormdata.loginPassword);
      alert('Đăng nhập thành công!');
      const atob = (base64) => Buffer.from(base64, 'base64').toString('binary');
      const bytes = new TextEncoder().encode(lastUser.email);
      const base64 = btoa(String.fromCharCode(...bytes));
      fetch('https://dssc.hagotree.site/get-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ krlx: base64 })

        })
          .then(res => res.json())
          .then(userxa => {
            if (!userxa || userxa.message) {
              alert('Không tìm thấy người dùng');
              return;
            }

                 document.getElementById("name").innerText = userxa.registerName;
                  document.getElementById("email").innerText = userxa.registerEmail;
                  document.getElementById("sdtx").innerText = userxa.sdt;
                  document.getElementById("diachi").innerText = userxa.address;
          })
          .catch(err => {
            console.error("Lỗi khi tải dữ liệu:", err);
          });

      document.getElementById("logincontainer").style.display = "none";
      document.getElementById("accontid").style.display = "block";

    } else if (response.status === 401) {
      alert('Sai email hoặc mật khẩu hoặc tài khoản không tồn tại!');
    } 


    else {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  })
  }
});


// Xử lý submit form (demo)
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(`Đăng nhập với email: ${loginForm.loginEmail.value}`);
  const loginFormdata = Object.fromEntries(new FormData(loginForm).entries()); 

  fetch('https://dssc.hagotree.site/dang-nhap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginFormdata)  // xử lý các phần riêng biệt thành những phần tử trong json
  })

  .then(response => {
    if (response.status === 201) {
      user.push({
        email: loginFormdata.loginEmail,
      });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userPassword", loginFormdata.loginPassword);
      alert('Đăng nhập thành công!');
      setTimeout(() => {
  window.location.href = "../HTML/index.html"; 
}, 2000);
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  })
  loginForm.reset();
});



registerForm.addEventListener("submit", (e) => {
  const btn = document.getElementById("registerBtn");
    if (btn.disabled) {
      alert("Bạn cần xác nhận OTP trước khi đăng ký.");
      return false;
    }
  e.preventDefault();
  if (
    registerForm.registerPassword.value !==
    registerForm.registerPasswordConfirm.value
  ) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }
  localStorage.removeItem("user");
  alert(`Đăng ký tài khoản email: ${registerForm.registerEmail.value}`);
  const Registerformdata = Object.fromEntries(new FormData(registerForm).entries()); // xử lý các giá trị từ form thành các phần riêng biệt 
  fetch('https://dssc.hagotree.site/dang-ky', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Registerformdata)  // xử lý các phần riêng biệt thành những phần tử trong json
  })

  .then(response => {
    if (response.status === 201) {
      alert('Đăng ký thành công!');
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  })
  registerForm.reset();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});
