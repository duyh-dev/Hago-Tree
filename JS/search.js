const params = new URLSearchParams(window.location.search);
  const keyword = params.get("s")?.toLowerCase() || "";
  function displayResults(results) {
    const resultDiv = document.getElementById("result-search");
    if (!results.length) {
      resultDiv.innerHTML = "<p>Không tìm thấy kết quả.</p>";
      return;
    }
    function truncateText(text, maxLength) {
      if (!text) return "";
      return text.length > maxLength ? text.slice(0, maxLength).trim() + "..." : text;
    }

    resultDiv.innerHTML = results.map(item => `
     <div style="display: flex; flex-direction: column; align-items: center;">

    <a href="../HTML/SanPham.html?id=${item.id}" style="text-decoration: none; color: inherit; width: 100%; max-width: 1200px;">
      <div style="display: flex; border: 1px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 20px; align-items: center; gap: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); transition: background 0.2s; background: white;" 
           class="container single-product" 
           onmouseover="this.style.background='#f5f5f5'" 
           onmouseout="this.style.background='white'">

        <img src="https://dssc.hagotree.site${item.image}" 
             alt="${item.title}" 
             style="width: 220px; height: 220px; object-fit: cover; border-radius: 10px; border: 1px solid #ddd; background: #fff; flex-shrink: 0;">

        <div class="product-info" style="flex: 1;">
          <h3 style="margin: 0 0 10px; font-size: 24px; color: #222; font-weight: bold;">
            ${item.title}
          </h3>

          <p style="margin: 0 0 12px; font-size: 16px; color: #555; line-height: 1.5;">
            ${truncateText(item.content.replace(/\\n|\n/g, " "), 256)}
          </p>

          <h3 style="margin: 0; font-size: 20px; color: #e60023; font-weight: bold;">
            ${Number(item.cost).toLocaleString()}₫
          </h3>
        </div>

      </div>
    </a>

    </div>

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