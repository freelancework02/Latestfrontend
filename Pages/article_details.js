// ✅ Smooth scroll for same-page anchors (optional)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    // Uncomment if you want SPA-style smooth scroll
    // e.preventDefault();
    // document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ✅ Utility to read querystring parameter
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const articleId = getQueryParam("id"); // ?id=123
const articleContainer = document.querySelector("article");
const relatedContainer = document.querySelector(".grid");

// ✅ Loader utilities
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex";
}
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

// ✅ Helper: check if ArticleText is empty
function sanitizeArticleText(text) {
  if (!text || text.trim() === "" || text.trim() === "<p><br></p>") {
    return `<p class="text-gray-500 italic">مضمون کا متن دستیاب نہیں ہے۔</p>`;
  }
  return text;
}

// ✅ Fetch single article detail
async function fetchArticleDetail(id) {
  showLoader(); // show loader before request
  try {
    const res = await fetch(`https://masailworld.onrender.com/api/article/${id}`);
    if (!res.ok) throw new Error("Failed to fetch article");
    const article = await res.json();

    // ✅ Sanitize content
    const safeText = sanitizeArticleText(article.seo);

    // ✅ Fill article detail dynamically
    articleContainer.innerHTML = `
      <h1 class="text-3xl md:text-5xl font-bold mb-4 text-rich-black leading-tight">${article.Title}</h1>

      <div class="flex flex-wrap justify-between items-center border-b border-[rgba(174,195,176,0.35)] pb-4 mb-8">
        <div class="flex items-center text-air_force_blue mb-4 md:mb-0">
          <span class="ml-2">تحریر: ${article.writer || "نامعلوم"}</span>
          <span class="mx-2">|</span>
          <span>تاریخ اشاعت: ${
            article.createdAt
              ? new Date(article.createdAt).toLocaleDateString("ur-PK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "نامعلوم"
          }</span>
        </div>

        <div class="flex items-center space-x-6 space-x-reverse text-air_force_blue text-lg">
          <div class="flex items-center">
            <i class="bi bi-eye-fill ml-2"></i><span class="font-sans">${article.Views || 0}</span>
          </div>
          <div class="flex items-center">
            <i class="bi bi-hand-thumbs-up-fill ml-2"></i><span class="font-sans">${article.Likes || 0}</span>
          </div>
          <a href="#" class="flex items-center hover:text-midnight_green transition-colors">
            <i class="bi bi-share-fill"></i>
          </a>
        </div>
      </div>

      <img src="https://masailworld.onrender.com/api/article/${article.id}/image" 
           alt="${article.Title}" 
           class="w-full h-auto object-cover rounded-xl shadow-md mb-8">

      <div class="text-rich_black-600 text-base md:text-xl space-y-6 leading-relaxed">
        ${safeText}
      </div>
    `;
  } catch (err) {
    console.error(err);
    articleContainer.innerHTML = `<p class="text-red-600 text-center">مضمون لوڈ کرنے میں مسئلہ پیش آیا۔</p>`;
  } finally {
    hideLoader(); // always hide loader
  }
}

// ✅ Fetch related articles
async function fetchRelatedArticles(currentId) {
  showLoader(); // show loader before request
  try {
    const res = await fetch(`https://masailworld.onrender.com/api/article?limit=3&excludeId=${currentId}`);
    if (!res.ok) throw new Error("Failed to fetch related articles");
    const related = await res.json();

    relatedContainer.innerHTML = related
      .map(
        (a) => `
        <div onclick="window.location.href='article-detail.html?id=${a.id}'" 
             class="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border border-[rgba(174,195,176,0.35)]">
          <img src="https://masailworld.onrender.com/api/article/${a.id}/image" alt="${a.Title}" class="w-full h-56 object-cover">
          <div class="p-6">
            <h3 class="text-xl md:text-2xl font-bold mb-3 text-rich_black">${a.Title}</h3>
            <p class="text-midnight_green-600 font-bold text-lg">مکمل مضمون پڑھیں &larr;</p>
          </div>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error(err);
    relatedContainer.innerHTML = `<p class="text-red-600 text-center">متعلقہ مضامین لوڈ کرنے میں مسئلہ پیش آیا۔</p>`;
  } finally {
    hideLoader(); // always hide loader
  }
}

// ✅ Initialize on page load
if (articleId) {
  fetchArticleDetail(articleId);
  fetchRelatedArticles(articleId);
} else {
  articleContainer.innerHTML = `<p class="text-red-600 text-center">مضمون نہیں ملا۔</p>`;
}
