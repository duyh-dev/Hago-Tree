document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Cảm ơn bạn đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm nhất!");
  this.reset();
});
