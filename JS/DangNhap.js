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
    document.getElementById("Accountchecker").innerHTML = lastUser.email;

    // Lấy thông tin user từ server
    const bytes = new TextEncoder().encode(lastUser.email);
    const base64 = btoa(String.fromCharCode(...bytes));
    fetch('https://dssc.hagotree.site/get-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ krlx: base64 })
    })
    .then(res => res.json())
    .then(userxa => {
      if (!userxa || userxa.message) {
        alert('Không tìm thấy người dùng');
        return;
      }
      // Hiển thị form chỉnh sửa tài khoản
      document.getElementById("logincontainer").style.display = "none";
      document.getElementById("accontid").style.display = "block";
      document.getElementById("editName").value = userxa.registerName || "";
      document.getElementById("editEmail").value = userxa.registerEmail || "";
      document.getElementById("editPhone").value = userxa.sdt || "";
      document.getElementById("editAddress").value = userxa.address || "";

      // Hiển thị bảng thông tin tài khoản
      document.getElementById("infoName").textContent = userxa.registerName || "";
      document.getElementById("infoEmail").textContent = userxa.registerEmail || "";
      document.getElementById("infoPhone").textContent = userxa.sdt || "";
      document.getElementById("infoAddress").textContent = userxa.address || "";
      document.getElementById("infoCreatedAt").textContent = userxa.createdAt
        ? new Date(userxa.createdAt).toLocaleString("vi-VN")
        : "";
    })
    .catch(err => {
      console.error("Lỗi khi tải dữ liệu:", err);
    });
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


document.addEventListener("DOMContentLoaded", function() {
  const editForm = document.getElementById("editAccountForm");
  if (editForm) {
    editForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("editName").value.trim();
      const email = document.getElementById("editEmail").value.trim();
      const phone = document.getElementById("editPhone").value.trim();
      const address = document.getElementById("editAddress").value.trim();
      const password = document.getElementById("editPassword").value.trim();
      const msg = document.getElementById("editAccountMsg");

      if (!name || !email || !phone || !address) {
        msg.style.color = "#d32f2f";
        msg.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
      }

      const updateData = {
        registerName: name,
        registerEmail: email,
        sdt: phone,
        address: address
      };
      if (password) updateData.registerPassword = password;
      console.log("Dữ liệu gửi:", updateData); 
      fetch('https://dssc.hagotree.site/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          msg.style.color = "#388e3c";
          msg.textContent = "Cập nhật thành công!";
        } else {
          msg.style.color = "#d32f2f";
          msg.textContent = data.message || "Cập nhật thất bại!";
        }
      })
      .catch(() => {
        msg.style.color = "#d32f2f";
        msg.textContent = "Lỗi kết nối server!";
      });
    });
  }
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

// Xử lý gửi OTP
document.getElementById("sendOtpBtn").addEventListener("click", function() {
  const email = document.getElementById("forgotEmail").value.trim();
  if (!email) {
    alert("Vui lòng nhập email đã đăng ký!");
    return;
  }
  fetch('https://dssc.hagotree.site/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Đã gửi OTP về email!");
    } else {
      alert(data.message || "Không gửi được OTP. Vui lòng thử lại.");
    }
  })
  .catch(() => alert("Lỗi gửi OTP!"));
});

// Xử lý xác nhận OTP (submit form)
forgotPassForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value.trim();
  const otp = document.getElementById("OTPPassword").value.trim();
  if (!email || !otp) {
    alert("Vui lòng nhập đầy đủ email và OTP!");
    return;
  }
  fetch('https://dssc.hagotree.site/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.newPassword) {
      alert("Mật khẩu mới của bạn: " + data.newPassword);
      forgotPassForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    } else {
      alert(data.message || "OTP không đúng hoặc đã hết hạn.");
    }
  })
  .catch(() => alert("Lỗi xác nhận OTP!"));
});

// Xử lý lưu thay đổi thông tin tài khoản

