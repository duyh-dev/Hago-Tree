
window.addEventListener("DOMContentLoaded", () => {

fetch("https://server-web-hagotree.glitch.me/get-posts")
  .then((res) => res.json())
  .then((posts) => {
    const container = document.getElementById("ContentPost");
    container.innerHTML = posts.reverse()
      .map((post) => {
        return `
          <main class="post-container dropdown d-block">
          <article class="post">
            <h2>${post.title}</h2> <button class="btn btn-primary dropdown-content-post"> Xem </button>
            <div class="showing-content" style="display: none;">
            <span>📝 Tác giả: <strong>Admin - Cửa hàng</strong></span>
          <p>🕒 ${new Date(post.createdAt).toLocaleString()}</p>
            ${post.image ? `<img src="https://server-web-hagotree.glitch.me/${post.image}" alt="Ảnh bài viết" style="max-width:300px;">` : ""}
            <p class="post-content">${post.content}</p>
            </div>
            <hr />
          </article>
            </main>
        `;
      })
      .join("");
         const buttons = document.querySelectorAll(".dropdown-content-post");
         buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const content = button.nextElementSibling;
          const isHidden = content.style.display === "none" || content.style.display === "";
          content.style.display = isHidden ? "block" : "none";
        });
      });
    })
  .catch((err) => {
    console.error("Lỗi khi tải bài viết:", err);
    document.getElementById("postList").innerHTML = "<p>Không thể tải bài viết!</p>";
  });
  });
