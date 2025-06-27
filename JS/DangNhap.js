let user = JSON.parse(localStorage.getItem("user")) || [];
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

window.addEventListener("DOMContentLoaded", () => {


  const user = JSON.parse(localStorage.getItem("user")) || [];

  if (user.length > 0 && localStorage.getItem("userPassword") && localStorage.getItem("userPassword").length > 0) {
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
