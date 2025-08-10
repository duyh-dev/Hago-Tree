
window.addEventListener("DOMContentLoaded", () => {
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

function truncateText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "..." : text;
}
if (postId) {
  fetch(`https://dssc.hagotree.site/baiviet/${postId}`)
    .then(res => {
      if (!res.ok) throw new Error("Không tìm thấy bài viết");
      return res.text();
    })
    .then(data => {
      document.getElementById("postcontainer").innerHTML = `
        <div class="card full-content"" style="max-width:800px; margin:auto;">
          <div>${data}</div>
        </div>
      `;
    })
    .catch(err => {
      document.getElementById("postcontainer").innerHTML = `ER 1<p>${err.message} </p>`;
    });

} else {
  fetch(`https://dssc.hagotree.site/list-baiviet-all`)
    .then(res => res.json())
    .then(files => {
      const container = document.getElementById("postcontainer");
      container.innerHTML = "";
      files.forEach(item => {
        const previewText = truncateText(item.content.replace(/<[^>]*>?/gm, ''), 512);
        const card = document.createElement("div");
       card.innerHTML = `
  <div>
    <a href="?id=${item.filename}" style="text-decoration: none; color: inherit;width: 100%; max-width: 1200px;">
      <div  class="card" style="
          display: flex;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          align-items: center;
          gap: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: background 0.2s;
          margin: auto;
        "
        onmouseover="this.style.background='#f9f9f9'" 
        onmouseout="this.style.background='white'">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 8px; font-size: 20px; color: #333; font-weight: 600;">${item.title}</h3>
          <p style="margin: 0; font-size: 16px; color: #666; line-height: 1.4;">
            ${previewText}
          </p>
        </div>
      </div>
    </a>
  </div>

        `;
        container.appendChild(card);
      });
    });
}
});
