const contactForm=document.getElementById("contactForm")
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const contactFormdata = Object.fromEntries(new FormData(contactForm).entries()); 

  fetch('https://server-web-hagotree.glitch.me/lien-he', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactFormdata)  // xử lý các phần riêng biệt thành những phần tử trong json
  })

  .then(response => {
    if (response.status === 201) {
      alert('Cảm ơn bạn đã gửi yêu cầu, chúng tôi sẽ sớm liên hệ lại với bạn!');
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  })
});

