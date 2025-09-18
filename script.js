
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#page-ask form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop normal form submit

    // Collect values
    const questionername = document.getElementById("name").value.trim();
    const questionaremail = document.getElementById("email").value.trim();
    const Title = document.getElementById("subject").value; // using subject as Title
    const detailquestion = document.getElementById("question").value.trim();

    // Generate a slug from title (optional: backend can also handle this)
    const slug = Title.replace(/\s+/g, "-").toLowerCase() + "-" + Date.now();

    // Build request payload
    const data = {
      Title,
      slug,
      detailquestion,
      questionername,
      questionaremail,
    };

    try {
      const res = await fetch("http://localhost:5000/api/fatwa/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ سوال کامیابی کے ساتھ بھیج دیا گیا!");
        form.reset();
      } else {
        alert("❌ خرابی: " + (result.error || "سوال بھیجنے میں ناکامی"));
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("❌ نیٹ ورک میں خرابی، دوبارہ کوشش کریں۔");
    }
  });
});



// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/fatwa/latest");
//     const fatawa = await res.json();
//     console.log("The Api Response is ", fatawa);

//     const ticker = document.getElementById("latest-fatawa-ticker");
//     ticker.innerHTML = ""; // clear placeholder

//     // Ensure fatawa is always an array
//     const fatawaList = Array.isArray(fatawa) ? fatawa : [fatawa];

//     fatawaList.forEach(fatwa => {
//       const item = document.createElement("div");
//       item.classList.add(
//         "ticker-item",
//         "px-4",
//         "py-2",
//         "text-midnight_green",
//         "font-medium"
//       );

//       // Use slug if available, otherwise fallback to ID
//       const link = fatwa.slug ? `/fatwa/${fatwa.slug}` : `/fatwa/${fatwa.id}`;

//       item.innerHTML = `
//         <a href="${link}" class="hover:underline">
//           ${fatwa.Title}
//         </a>
//       `;

//       ticker.appendChild(item);
//     });
//   } catch (err) {
//     console.error("❌ Error loading latest fatawa:", err);
//   }
// });






document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:5000/api/fatwa/latest");
    const fatawa = await res.json();
    console.log("Latest fatawa response:", fatawa);

    const list = document.getElementById("latest-fatawa-list");
    list.innerHTML = ""; // clear placeholder

    // Always make fatawa an array
    const fatawaList = Array.isArray(fatawa) ? fatawa : [fatawa];

    fatawaList.forEach((fatwa, index) => {
      const fatwaCard = document.createElement("div");
      fatwaCard.classList.add(
        "bg-white",
        "p-6",
        "rounded-xl",
        "shadow-lg",
        "border",
        "border-ash_gray/50",
        "hover:shadow-xl",
        "transition"
      );

      // Use slug if available, else ID
      const link = fatwa.slug ? `/fatwa/${fatwa.slug}` : `/fatwa/${fatwa.id}`;

      // Fallbacks if views or details not in DB yet
      const views = fatwa.Views || 0;
      const details = fatwa.detailquestion
        ? fatwa.detailquestion.slice(0, 180) + "..."
        : "";

      fatwaCard.innerHTML = `
        <div class="flex items-start">
          <div class="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-midnight_green text-white font-bold text-3xl rounded-xl ml-4 shadow-md">
            ${index + 1}
          </div>
          <div class="flex-grow">
            <h3 class="text-xl sm:text-2xl font-semibold text-rich_black leading-normal">
              <a href="${link}" class="hover:underline">${fatwa.Title}</a>
            </h3>
            <p class="text-rich_black-600 text-base md:text-lg mt-2 mb-3 leading-relaxed line-clamp-3">
              ${details}
            </p>
            <div class="flex justify-between items-center mt-4">
              <a href="${link}" class="text-midnight_green-600 font-bold text-md md:text-lg hover:underline transition">
                مکمل جواب پڑھیں &larr;
              </a>
              <div class="flex items-center space-x-4 space-x-reverse text-air_force_blue">
                <div class="flex items-center">
                  <i class="bi bi-eye-fill ml-1"></i>
                  <span class="font-sans">${views}</span>
                </div>
                <span class="hover:text-midnight_green transition-colors cursor-pointer">
                  <i class="bi bi-share-fill"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      `;

      list.appendChild(fatwaCard);
    });
  } catch (err) {
    console.error("❌ Error loading latest fatawa:", err);
  }
});

