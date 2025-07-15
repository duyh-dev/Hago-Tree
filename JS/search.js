const params = new URLSearchParams(window.location.search);
  const keyword = params.get("s")?.toLowerCase() || "";
  function displayResults(results) {
    const resultDiv = document.getElementById("result-search");
    if (!results.length) {
      resultDiv.innerHTML = "<p>Không tìm thấy kết quả.</p>";
      return;
    }

    resultDiv.innerHTML = results.map(item => `
      <a href="../HTML/SanPham.html?id=${item.id}"><div style="border-bottom:1px solid #ccc; padding:10px;" class="container single-product">
      <img src="https://dssc.hagotree.site${item.image}" alt="Sản phẩm 2">
      <div class="product-info">
      <h3>${item.title}</h3>
        <p>${item.content}</p>
      </div>
      </div></a>
    `).join("");
  }

  async function fetchAndSearch() {
    if (!keyword) {
      document.getElementById("result-search").innerHTML = "<p>Không có từ khóa.</p>";
      return;
    }

    try {
      const res = await fetch("https://dssc.hagotree.site/sp/12");
      const data = await res.json();

      const results = data.filter(item =>
        (item.title && item.title.toLowerCase().includes(keyword)) ||
        (item.content && item.content.toLowerCase().includes(keyword)) ||
        (item.cost && item.content.toLowerCase().includes(keyword))
      );

      displayResults(results);
    } catch (err) {
      document.getElementById("result-search").innerHTML = "<p>Lỗi khi tải dữ liệu.</p>";
      console.error(err);
    }
  }

  fetchAndSearch();