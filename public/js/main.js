const container = document.getElementById("suggestions-container");

fetch("/api/suggestions")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      const col = document.createElement("div");

      // ✅ Bootstrap column must be DIRECT child of .row
      col.className = "col-md-4 travel-card";

      col.innerHTML = `
        <div class="card border-0 shadow-lg h-100 rounded-4 overflow-hidden">
          
          <div class="position-relative">
            <img src="${item.photo}" class="card-img-top"
                 alt="${item.name}"
                 style="object-fit: cover; height: 250px;">
            <div class="position-absolute top-0 start-0 w-100 h-100 overlay-gradient"></div>
          </div>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-primary mb-2">${item.name}</h5>
            <p class="card-text text-muted mb-2">${item.description}</p>
            <p class="card-text text-secondary mb-3">
              <strong>Opening Time:</strong> ${item.timings}
            </p>

            <div class="mt-auto d-flex gap-2">
              <a href="${item.location}" target="_blank"
                 class="btn btn-outline-primary btn-sm flex-fill">
                 View on Map
              </a>
              <a href="${item.importantLink}" target="_blank"
                 class="btn btn-outline-secondary btn-sm flex-fill">
                 Website
              </a>
            </div>
          </div>
        </div>
      `;

      container.appendChild(col);
    });
  });

document
  .getElementById("addSuggestionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await fetch("/api/suggestions", {
      method: "POST",
      cache: "no-store",
      body: formData,
    });

    if (!res.ok) {
      alert("Failed to save");
      return;
    }

    const newItem = await res.json();

    // hiding the submit form
    document.getElementById("add-form").style.display = "none";

    addCard(newItem); // inject immediately
    e.target.reset();
  });

function addCard(item) {
  const container = document.getElementById("suggestions-container");

  const col = document.createElement("div");
  col.className = "col-md-6 travel-card";

  col.innerHTML = `
                <div class="card border-0 shadow-lg h-100 rounded-4 overflow-hidden">
                    <div class="position-relative">
                    <img src="${item.photo}" class="card-img-top"
                        style="object-fit: cover; height: 250px;">
                    <div class="position-absolute top-0 start-0 w-100 h-100 overlay-gradient"></div>
                    </div>

                    <div class="card-body d-flex flex-column">
                    <h5 class="fw-bold text-primary">${item.name}</h5>
                    <p class="text-muted">${item.description}</p>
                    <p><strong>Opening Time:</strong> ${item.timings}</p>

                    <div class="mt-auto d-flex gap-2">
                        <a href="${item.location}" target="_blank"
                        class="btn btn-outline-primary btn-sm flex-fill">Map</a>
                        <a href="${item.importantLink}" target="_blank"
                        class="btn btn-outline-secondary btn-sm flex-fill">Website</a>
                    </div>
                    </div>
                </div>
                `;

  container.prepend(col);
}
