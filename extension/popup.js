document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("url");
  const titleInput = document.getElementById("title");
  const form = document.getElementById("form");

  let scrapedData = null;

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    urlInput.value = tab.url || "";
    titleInput.value = tab.title || "";

    // Scrape data from the active tab
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          function getImages() {
            const images = new Set();
            const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
            if (ogImage) images.add(ogImage);

            document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
              try {
                const data = JSON.parse(el.textContent);
                const items = Array.isArray(data) ? data : [data];
                for (const item of items) {
                  if (item["@type"] === "Product" || item["@type"]?.includes?.("Product")) {
                    const raw = Array.isArray(item.image) ? item.image : item.image ? [item.image] : [];
                    raw.forEach((img) => {
                      const url = typeof img === "string" ? img : img?.url;
                      if (url) images.add(url);
                    });
                  }
                }
              } catch {}
            });

            document.querySelectorAll("img").forEach((img) => {
              const src = img.dataset.src || img.dataset.lazySrc || img.src;
              if (!src || src.startsWith("data:")) return;
              const lower = src.toLowerCase();
              if (
                lower.includes("favicon") || lower.includes("logo") || lower.includes("icon") ||
                lower.includes("sprite") || lower.includes("pixel") || lower.includes("tracking") ||
                lower.includes("badge") || lower.endsWith(".svg") || lower.endsWith(".gif")
              ) return;
              if (img.naturalWidth > 0 && img.naturalWidth < 50) return;
              if (img.naturalHeight > 0 && img.naturalHeight < 50) return;
              images.add(src);
            });

            return [...images].slice(0, 20);
          }

          function getPrice() {
            const meta =
              document.querySelector('meta[property="product:price:amount"]')?.getAttribute("content") ||
              document.querySelector('meta[property="og:price:amount"]')?.getAttribute("content");
            if (meta) return meta;

            for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
              try {
                const data = JSON.parse(el.textContent);
                const items = Array.isArray(data) ? data : [data];
                for (const item of items) {
                  if (item["@type"] === "Product" || item["@type"]?.includes?.("Product")) {
                    const price = item.offers?.price ?? item.offers?.[0]?.price;
                    if (price) return String(price);
                  }
                }
              } catch {}
            }

            const priceRegex = /(\d[\d\s]*[.,]\d{2})\s*[€$£]/;
            const selectors = [
              '[class*="price" i]:not([class*="old" i]):not([class*="crossed" i]):not([class*="was" i])',
              '[data-price]',
              '[itemprop="price"]',
            ];
            for (const sel of selectors) {
              for (const el of document.querySelectorAll(sel)) {
                const dataPrice = el.getAttribute("data-price") || el.getAttribute("content");
                if (dataPrice) {
                  const val = parseFloat(dataPrice.replace(",", "."));
                  if (val >= 0.5 && val <= 50000) return String(val);
                }
                const match = el.textContent.match(priceRegex);
                if (match) {
                  const val = parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
                  if (val >= 0.5 && val <= 50000) return String(val);
                }
              }
            }
            return "";
          }

          function getTitle() {
            const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
            if (ogTitle) return ogTitle.trim();

            for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
              try {
                const data = JSON.parse(el.textContent);
                const items = Array.isArray(data) ? data : [data];
                for (const item of items) {
                  if (item["@type"] === "Product" || item["@type"]?.includes?.("Product")) {
                    if (item.name) return item.name.trim();
                  }
                }
              } catch {}
            }
            return document.title;
          }

          return { title: getTitle(), price: getPrice(), images: getImages() };
        },
      },
      (results) => {
        if (results?.[0]?.result) {
          scrapedData = results[0].result;
          if (scrapedData.title) titleInput.value = scrapedData.title;
        }
      }
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = encodeURIComponent(urlInput.value);
    const title = encodeURIComponent(titleInput.value);
    const price = encodeURIComponent(scrapedData?.price || "");
    const images = encodeURIComponent(JSON.stringify(scrapedData?.images || []));
    chrome.tabs.create({
      url: `http://localhost:3000/add?url=${url}&title=${title}&price=${price}&images=${images}&from=extension`,
    });
    window.close();
  });
});
