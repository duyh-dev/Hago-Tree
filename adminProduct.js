// Product management module for admin
// Uses localStorage to store product data

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

async function loadProducts() {
  const tbody = document.querySelector('#ProductManageTable tbody');
  if (!tbody) return;

  try {
    const [resP, resDH, resFB] = await Promise.all([
      fetch('https://dssc.hagotree.site/sp/12'),
      fetch('https://dssc.hagotree.site/dh'),
      fetch('https://dssc.hagotree.site/fb')
    ]);
    if (!resP.ok || !resDH.ok || !resFB.ok) throw new Error('Fetch thất bại');

    const [products, orders, feedbacks] = await Promise.all([
      resP.json(), resDH.json(), resFB.json()
    ]);
    const salesMap = {};
    const revenueMap = {};

    orders.forEach(order => {
      if (order.Ttdon !== "Hoàn thành đơn") return;

      let items = [];

      try {
        items = JSON.parse(order.DonHang); // phải parse chuỗi JSON này thành array
      } catch (e) {
        console.warn("Lỗi parse DonHang:", e, order.DonHang);
        return;
      }

      items.forEach(item => {
        const key = normalizeTitle(item.title);
        const qty = parseInt(item.quantity || 1);
        const price = parseFloat(item.cost || 0);

        salesMap[key] = (salesMap[key] || 0) + qty;
        revenueMap[key] = (revenueMap[key] || 0) + qty * price;
      });
    });




    const fbMap = {};
    feedbacks.forEach(f => {
      const pid = f.id; 
      fbMap[pid] = (fbMap[pid] || 0) + 1;
    });

    tbody.innerHTML = '';
    products.forEach((p, idx) => {

        const key = normalizeTitle(p.title);
        p.sales = salesMap[key] || 0;
        p.revenue = revenueMap[key] || 0;
        p.feedback = fbMap[p.id] || 0;

        tbody.appendChild(createRow(p, idx));
        

      });




  } catch (err) {
    console.error('Lỗi load sản phẩm:', err);
  }
}

function createRow(product, index) {
  const tr = document.createElement('tr');
  // Giả sử product.images là mảng các ảnh chi tiết, product.image là ảnh bìa
  const detailImgs = Array.isArray(product.images) ? product.images : [];
  tr.innerHTML = `
    <td><input class="pm-name" type="text" value="${escapeHtml(product.title || '')}"></td>
    <td><input class="pm-price" type="number" value="${product.cost || ''}"></td>
    <td>
      <img class="pm-preview" src="https://dssc.hagotree.site${product.image || ''}" alt="preview" width="60">
      <input class="pm-image" type="file" accept="image/*">
    </td>
    <td>
      <div class="pm-detail-imgs">
        ${detailImgs.map(img => `<img src="https://dssc.hagotree.site${img}" alt="detail" />`).join('')}
      </div>
      <input class="pm-detail-image" type="file" accept="image/*" multiple style="margin-top:6px;">
    </td>
    <td><textarea class="pm-desc">${product.content || ''}</textarea></td>
    <td class="pm-feedback">${product.feedback}</td>
    <td class="pm-sales">${product.sales}</td>
    <td class="pm-revenue">${product.revenue}</td>
    <td>
      <button class="pm-save-btn">Lưu</button>
      <button class="pm-delete-btn">Xóa</button>
    </td>
  `;

  const fileInput = tr.querySelector('.pm-image');
  const preview = tr.querySelector('.pm-preview');
  fileInput.addEventListener('change', () => {
    const f = fileInput.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = e => preview.src = e.target.result;
      reader.readAsDataURL(f);
    }
  });

  // Preview nhiều ảnh chi tiết
  const detailInput = tr.querySelector('.pm-detail-image');
  const detailPreview = tr.querySelector('.pm-detail-imgs');
  detailInput.addEventListener('change', () => {
    detailPreview.innerHTML = '';
    Array.from(detailInput.files).forEach(f => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        detailPreview.appendChild(img);
      };
      reader.readAsDataURL(f);
    });
  });

  tr.querySelector('.pm-save-btn').addEventListener('click', () =>
    saveRow(tr, index)
  );
  tr.querySelector('.pm-delete-btn').addEventListener('click', () => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;
    fetch('https://dssc.hagotree.site/delsp-pr1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index })
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi khi xóa sản phẩm.');
        alert('Đã xóa sản phẩm!');
        loadProducts();
      })
      .catch(err => {
        console.error(err);
        alert('Không thể xóa sản phẩm.');
      });
  });

  return tr;
}

function normalizeTitle(title) {
  return (title || '')
     .replace(/\\+"/g, '"')  
    .replace(/\\+/g, '')     
    .replace(/[^a-zA-Z0-9\s]/g, '') 
    .toLowerCase()
    .trim();
}
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;") 
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


function saveRow(tr, index) {
  const name = tr.querySelector('.pm-name').value.trim();
  const price = parseFloat(tr.querySelector('.pm-price').value) || 0;
  const desc = tr.querySelector('.pm-desc').value.trim();
  const imgInput = tr.querySelector('.pm-image');
  const preview = tr.querySelector('.pm-preview');
   const product = {
    title: name,
    cost: price,
    content: desc

  };


  fetch('https://dssc.hagotree.site/updatesp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, product })
  })
  .then(res => {
    if (!res.ok) throw new Error('Lỗi khi lưu sản phẩm.');
    alert('Đã lưu sản phẩm!');
  })
  .catch(err => {
    console.error(err);
    alert('Không thể lưu sản phẩm.');
  });
}
