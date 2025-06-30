// Product management module for admin
// Uses localStorage to store product data

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

async function loadProducts() {
  const tableBody = document.querySelector('#ProductManageTable tbody');
  if (!tableBody) return;

  try {
    const res = await fetch('https://dssc.hagotree.site/sp/12');
    if (!res.ok) throw new Error('dow fail');
    const list = await res.json();
    tableBody.innerHTML = '';
    list.forEach((p, idx) => {
      tableBody.appendChild(createRow(p, idx));
    });

  } catch (err) {
    console.error('Lỗi load sản phẩm:', err);
  }
}

function createRow(product, index) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="pm-name" type="text" value="${product.title || ''}"></td>
    <td><input class="pm-price" type="number" value="${product.cost || ''}"></td>
    <td>
      <img class="pm-preview" src="https://dssc.hagotree.site${product.image || ''}" alt="preview">
      <input class="pm-image" type="file" accept="image/*">
    </td>
    <td><textarea class="pm-desc">${product.content || ''}</textarea></td>
    <td class="pm-feedback">${product.feedback || 0}</td>
    <td class="pm-sales">${product.sales || 0}</td>
    <td class="pm-revenue">${product.revenue || 0}</td>
    <td><button class="pm-save-btn" data-idx="${index}">Lưu</button><button class="pm-delete-btn" data-idx="${index}">Xóa</button></td>
  `;
  const fileInput = tr.querySelector('.pm-image');
  const preview = tr.querySelector('.pm-preview');
  fileInput.addEventListener('change', () => {
    const f = fileInput.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = e => { preview.src = e.target.result; };
      reader.readAsDataURL(f);
    }
  });
  tr.querySelector('.pm-save-btn').addEventListener('click', () => saveRow(tr, index));
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
