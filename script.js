
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
      const res = await fetch("https://masailworld.onrender.com/api/fatwa/website", {
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

//Latest fatawa

async function loadLatestFatawa() {
    try {
        const response = await fetch("https://masailworld.onrender.com/api/fatwa/latest");
        const fatawa = await response.json();

        // صرف 3 فتاویٰ لیں
        const latestFatawa = fatawa.slice(0, 3);

        const fatawaList = document.getElementById("latest-fatawa-list");
        fatawaList.innerHTML = "";

        latestFatawa.forEach(fatwa => {
            const fatwaItem = document.createElement("div");
            fatwaItem.className = "bg-white p-6 rounded-2xl shadow-lg border border-ash_gray hover:shadow-xl transition transform hover:-translate-y-1";
            fatwaItem.innerHTML = `
                <h3 class="text-xl md:text-2xl font-bold text-midnight_green mb-3">${fatwa.title}</h3>
                <p class="text-rich_black-600 text-base md:text-lg mb-4 leading-relaxed line-clamp-3">${fatwa.summary || ""}</p>
                <a href="#fatwa-detail" class="nav-link text-midnight_green-600 hover:text-midnight_green font-bold text-lg hover:underline transition">مکمل جواب پڑھیں &larr;</a>
            `;
            fatawaList.appendChild(fatwaItem);
        });
    } catch (error) {
        console.error("Error fetching latest fatawa:", error);
        document.getElementById("latest-fatawa-list").innerHTML =
            `<p class="text-center text-air_force_blue">فی الحال کوئی فتاویٰ دستیاب نہیں ہیں۔</p>`;
    }
}

// صفحہ لوڈ ہوتے ہی چلائیں
document.addEventListener("DOMContentLoaded", loadLatestFatawa);





//category fatawa

async function loadFatawa() {
    try {
        const response = await fetch("https://masailworld.onrender.com/api/fatwa/latest");
        const fatawa = await response.json();
        console.log("the loadfatawa", fatawa);

        // ✅ تازہ ترین فتاویٰ (Home Page)
        const latestFatawaList = document.getElementById("latest-fatawa-list");
        if (latestFatawaList) {
            latestFatawaList.innerHTML = "";
            fatawa.slice(0, 3).forEach(fatwa => {
                const item = document.createElement("div");
                item.className =
                    "bg-white p-6 rounded-2xl shadow-lg border border-ash_gray hover:shadow-xl transition transform hover:-translate-y-1";
                item.innerHTML = `
                    <h3 class="text-xl md:text-2xl font-bold text-midnight_green mb-3">${fatwa.Title}</h3>
                    <p class="text-rich_black-600 text-base md:text-lg mb-4 leading-relaxed line-clamp-3">
                        ${fatwa.detailquestion ? fatwa.detailquestion.substring(0, 150) + "..." : ""}
                    </p>
                    <a href="#fatwa-detail" 
                       class="nav-link text-midnight_green-600 hover:text-midnight_green font-bold text-lg hover:underline transition">
                        مکمل جواب پڑھیں &larr;
                    </a>
                `;
                latestFatawaList.appendChild(item);
            });
        }

        // ✅ موضوعات کے فتاویٰ (Categories Page)
        const categoryFatawaList = document.getElementById("category-fatawa-list");
        if (categoryFatawaList) {
            categoryFatawaList.innerHTML = "";
            fatawa.forEach((fatwa, index) => {
                const item = document.createElement("a");
                item.href = "#fatwa-detail";
                item.className =
                    "nav-link block bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-ash_gray hover:shadow-2xl hover:border-midnight_green-200 transition-all duration-300 transform hover:-translate-y-1";
                item.innerHTML = `
                    <div class="flex items-start">
                        <div class="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-midnight_green text-white font-bold text-3xl rounded-xl ml-4 shadow-md">${index + 1}</div>
                        <div class="flex-grow">
                            <h3 class="text-xl sm:text-2xl font-semibold text-rich_black leading-normal">${fatwa.Title}</h3>
                            <p class="text-rich_black-600 text-base md:text-lg mt-2 mb-3 leading-relaxed line-clamp-3">
                                ${fatwa.detailquestion ? fatwa.detailquestion.substring(0, 200) + "..." : ""}
                            </p>
                            <div class="flex justify-between items-center mt-4">
                                <span class="text-midnight_green-600 font-bold text-md md:text-lg hover:underline transition">
                                    مکمل جواب پڑھیں &larr;
                                </span>
                                <div class="flex items-center space-x-4 space-x-reverse text-air_force_blue">
                                    <div class="flex items-center">
                                        <i class="bi bi-eye-fill ml-1"></i>
                                        <span class="font-sans">${fatwa.Views || 0}</span>
                                    </div>
                                    <span class="hover:text-midnight_green transition-colors"><i class="bi bi-share-fill"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                categoryFatawaList.appendChild(item);
            });
        }
    } catch (error) {
        console.error("Error fetching fatawa:", error);
        if (document.getElementById("latest-fatawa-list")) {
            document.getElementById("latest-fatawa-list").innerHTML =
                `<p class="text-center text-air_force_blue">فی الحال کوئی فتاویٰ دستیاب نہیں ہیں۔</p>`;
        }
        if (document.getElementById("category-fatawa-list")) {
            document.getElementById("category-fatawa-list").innerHTML =
                `<p class="text-center text-air_force_blue">فی الحال کوئی فتاویٰ دستیاب نہیں ہیں۔</p>`;
        }
    }
}

// صفحہ لوڈ ہوتے ہی چلائیں
document.addEventListener("DOMContentLoaded", loadFatawa);





//Other Latest
// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//     const res = await fetch("https://masailworld.onrender.com/api/fatwa/latest");
//     const fatawa = await res.json();
//     console.log("Latest fatawa response:", fatawa);

//     const list = document.getElementById("latest-fatawa-list");
//     list.innerHTML = ""; // clear placeholder

//     // Always make fatawa an array
//     const fatawaList = Array.isArray(fatawa) ? fatawa : [fatawa];

//     fatawaList.forEach((fatwa, index) => {
//       const fatwaCard = document.createElement("div");
//       fatwaCard.classList.add(
//         "bg-white",
//         "p-6",
//         "rounded-xl",
//         "shadow-lg",
//         "border",
//         "border-ash_gray/50",
//         "hover:shadow-xl",
//         "transition"
//       );

//       // Use slug if available, else ID
//  const link = fatwa.id ? `./Pages/fatwa-detail.html/${fatwa.id}` : `./Pages/fatwa-detail.html/${fatwa.id}`;

//       // Fallbacks if views or details not in DB yet
//       const views = fatwa.Views || 0;
//       const details = fatwa.detailquestion
//         ? fatwa.detailquestion.slice(0, 180) + "..."
//         : "";

//       fatwaCard.innerHTML = `
//         <div class="flex items-start">
//           <div class="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-midnight_green text-white font-bold text-3xl rounded-xl ml-4 shadow-md">
//             ${index + 1}
//           </div>
//           <div class="flex-grow">
//             <h3 class="text-xl sm:text-2xl font-semibold text-rich_black leading-normal">
//               <a href="./Pages/fatwa-detail.html?id=${fatwa.id}" class="hover:underline">${fatwa.Title}</a>
//             </h3>
//             <p class="text-rich_black-600 text-base md:text-lg mt-2 mb-3 leading-relaxed line-clamp-3">
//               ${details}
//             </p>
//             <div class="flex justify-between items-center mt-4">
//               <a href="./Pages/fatwa-detail.html?id=${fatwa.id}" class="text-midnight_green-600 font-bold text-md md:text-lg hover:underline transition">
//                 مکمل جواب پڑھیں &larr;
//               </a>
//               <div class="flex items-center space-x-4 space-x-reverse text-air_force_blue">
//                 <div class="flex items-center">
//                   <i class="bi bi-eye-fill ml-1"></i>
//                   <span class="font-sans">${views}</span>
//                 </div>
//                 <span class="hover:text-midnight_green transition-colors cursor-pointer">
//                   <i class="bi bi-share-fill"></i>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       `;

//       list.appendChild(fatwaCard);
//     });
//   } catch (err) {
//     console.error("❌ Error loading latest fatawa:", err);
//   }
// });


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("https://masailworld.onrender.com/api/fatwa/latest");
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
              <a href="./Pages/fatwa-detail.html?id=${fatwa.id}" class="hover:underline">${fatwa.Title}</a>
            </h3>
            <p class="text-rich_black-600 text-base md:text-lg mt-2 mb-3 leading-relaxed line-clamp-3">
              ${details}
            </p>
            <div class="flex justify-between items-center mt-4">
              <a href="./Pages/fatwa-detail.html?id=${fatwa.id}" class="text-midnight_green-600 font-bold text-md md:text-lg hover:underline transition">
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

    // 🚫 Stop editing in all Quill editors
    document.querySelectorAll(".ql-editor").forEach(el => {
      el.setAttribute("contenteditable", "false");
    });

  } catch (err) {
    console.error("❌ Error loading latest fatawa:", err);
  }
});





// Article 


