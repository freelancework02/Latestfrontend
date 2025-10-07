// ✅ Smooth scroll for same-page anchors (optional)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function () {
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

/* ----------------------------
   SHARE HELPERS (new)
-----------------------------*/

// Centered popup
function popupCenter(url, title) {
  const w = 640, h = 560;
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
  const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const height = window.innerHeight || document.documentElement.clientHeight || screen.height;
  const left = ((width / 2) - (w / 2)) + dualScreenLeft;
  const top = ((height / 2) - (h / 2)) + dualScreenTop;
  const features = `scrollbars=yes,width=${w},height=${h},top=${top},left=${left}`;
  window.open(url, title, features);
}

// Build share URLs for current URL/title
function buildShareLinks(url, text) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text || document.title || 'مسائل ورلڈ');
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`
  };
}

// Copy current URL to clipboard (used in chooser)
async function copyCurrentUrl() {
  const currentUrl = window.location.href;
  try {
    await navigator.clipboard.writeText(currentUrl);
    alert("🔗 لنک کاپی ہوگیا ہے!");
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    alert("⚠️ لنک کاپی کرنے میں مسئلہ آیا۔");
  }
}

// This is called by the share icon in the article header
async function openShare() {
  const url = window.location.href;
  const title = document.title || 'مسائل ورلڈ';
  const text = 'اس صفحہ کا لنک ملاحظہ کریں:';

  // Native share sheet if supported
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (e) {
      if (e && e.name === 'AbortError') return; // user canceled
      // else fall through to fallback
    }
  }

  // Fallback: quick chooser via prompt (no UI/layout changes)
  const links = buildShareLinks(url, title);
  const choice = prompt('شیئر کریں: facebook, x, whatsapp, telegram, linkedin, copy', 'facebook');
  if (!choice) return;

  const key = choice.toLowerCase().trim();
  if (key === 'copy') return copyCurrentUrl();

  if (links[key]) {
    popupCenter(links[key], 'Share');
  } else {
    alert('ناموزوں انتخاب۔ درج ذیل میں سے ایک لکھیں: facebook, x, whatsapp, telegram, linkedin, copy');
  }
}

// Wire header/footer social icons to share the current URL in popups
function wireSocialShareAnchors() {
  const url = window.location.href;
  const links = buildShareLinks(url, document.title);

  const map = {
    'sm-fb-mobile': links.facebook,
    'sm-x-mobile': links.x,
    'sm-fb-desktop': links.facebook,
    'sm-x-desktop': links.x,
    'sm-fb-footer': links.facebook,
    'sm-x-footer': links.x
  };

  Object.keys(map).forEach(id => {
    const a = document.getElementById(id);
    if (!a) return;
    a.setAttribute('href', map[id]);
    a.addEventListener('click', function (e) {
      e.preventDefault();
      popupCenter(map[id], 'Share');
    });
  });
}

/* ----------------------------
   DATA FETCH
-----------------------------*/

// ✅ Fetch single article detail
async function fetchArticleDetail(id) {
  showLoader();
  try {
    const res = await fetch(`https://api.masailworld.com/api/article/${id}`);
    if (!res.ok) throw new Error("Failed to fetch article");
    const article = await res.json();

    const safeText = sanitizeArticleText(article.seo);

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
          <button type="button" onclick="openShare()" class="flex items-center hover:text-midnight_green transition-colors" aria-label="اس صفحہ کو شیئر کریں">
            <i class="bi bi-share-fill"></i>
          </button>
        </div>
      </div>

      <img src="https://api.masailworld.com/api/article/${article.id}/image" 
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
    hideLoader();
  }
}

// ✅ Fetch related articles
async function fetchRelatedArticles(currentId) {
  showLoader();
  try {
    const res = await fetch(`https://api.masailworld.com/api/article?limit=3&excludeId=${currentId}`);
    if (!res.ok) throw new Error("Failed to fetch related articles");
    const related = await res.json();

    relatedContainer.innerHTML = related
      .map(
        (a) => `
        <div onclick="window.location.href='article-detail.html?id=${a.id}'" 
             class="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border border-[rgba(174,195,176,0.35)]">
          <img src="https://api.masailworld.com/api/article/${a.id}/image" alt="${a.Title}" class="w-full h-56 object-cover">
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
    hideLoader();
  }
}

/* ----------------------------
   INIT
-----------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  wireSocialShareAnchors(); // ensure top/footer icons share current URL in popup
});

if (articleId) {
  fetchArticleDetail(articleId);
  fetchRelatedArticles(articleId);
} else {
  articleContainer.innerHTML = `<p class="text-red-600 text-center">مضمون نہیں ملا۔</p>`;
}
