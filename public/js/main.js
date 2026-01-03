const container = document.getElementById("suggestions-container");

fetch("/api/suggestions")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      const card = document.createElement("div");
    //   card.classList.add("col-md-6", "mb-4");
      card.innerHTML = `
        <div class="col-md-6 mb-4">
            <div class="card border-0 shadow-lg h-100 rounded-4 overflow-hidden">
                <!-- Image with overlay effect -->
                <div class="position-relative">
                <img src="${item.photo}" class="card-img-top" alt="${item.name}" style="object-fit: cover; height: 250px;">
                <div class="position-absolute top-0 start-0 w-100 h-100 overlay-gradient"></div>
                </div>

                <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold text-primary mb-2">${item.name}</h5>
                <p class="card-text text-muted mb-2">${item.description}</p>
                <p class="card-text text-secondary mb-3"><strong>Opening Time:</strong> ${item.timings}</p>
                
                <div class="mt-auto d-flex gap-2">
                    <a href="${item.location}" target="_blank" class="btn btn-outline-primary btn-sm flex-fill">View on Map</a>
                    <a href="${item.importantLink}" target="_blank" class="btn btn-outline-secondary btn-sm flex-fill">Website</a>
                </div>
                </div>
            </div>
        </div>
      `;
      container.appendChild(card);
    });
  });
