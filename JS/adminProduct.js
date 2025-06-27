// Product management module for admin
// Uses localStorage to store product data

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

function loadProducts() {
  const tableBody = document.querySelector('#ProductManageTable tbody');
  if (!tableBody) return;
  const list = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  tableBody.innerHTML = '';
  list.forEach((p, idx) => {
    tableBody.appendChild(createRow(p, idx));
  });
}

function createRow(product, index) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="pm-name" type="text" value="${product.title || ''}"></td>
    <td><input class="pm-price" type="number" value="${product.cost || ''}"></td>
    <td>
      <img class="pm-preview" src="${product.image || ''}" alt="preview">
      <input class="pm-image" type="file" accept="image/*">
    </td>
    <td><textarea class="pm-desc">${product.content || ''}</textarea></td>
    <td class="pm-feedback">${product.feedback || 0}</td>
    <td class="pm-sales">${product.sales || 0}</td>
    <td class="pm-revenue">${product.revenue || 0}</td>
    <td><button class="pm-save-btn" data-idx="${index}">Lưu</button></td>
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
  return tr;
}

function saveRow(tr, index) {
  const name = tr.querySelector('.pm-name').value.trim();
  const price = parseFloat(tr.querySelector('.pm-price').value) || 0;
  const desc = tr.querySelector('.pm-desc').value.trim();
  const imgInput = tr.querySelector('.pm-image');
  const preview = tr.querySelector('.pm-preview');
  const item = {
    title: name,
    cost: price,
    content: desc,
    image: preview.getAttribute('src'),
    feedback: parseInt(tr.querySelector('.pm-feedback').textContent) || 0,
    sales: parseInt(tr.querySelector('.pm-sales').textContent) || 0,
    revenue: parseInt(tr.querySelector('.pm-revenue').textContent) || 0
  };

  const list = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  list[index] = item;
  localStorage.setItem('adminProducts', JSON.stringify(list));
  alert('Đã lưu sản phẩm!');
}
