document.addEventListener('DOMContentLoaded', () => {
    fetch('repos.json')
        .then(response => response.json())
        .then(data => {
            displayReposAsCards(data);
        })
        .catch(error => {
            console.error('Error fetching the repos:', error);
        });
});

function displayReposAsCards(repos) {
    const container = document.getElementById('projects-row');
    container.innerHTML = '';

    repos.forEach((repo, index) => {
        setTimeout(() => {
            const card = document.createElement('div');
            card.className = 'col-lg-4 col-md-6 col-sm-12 mb-3 mt-3';
            const imagePath = `imgs/${repo.name}.png`;

            card.innerHTML = `
                <div class="card">
                    <!-- Placeholder for Image or Canvas -->
                    <div class="image-or-canvas-placeholder"></div>
                    <div class="card-body">
                        <p class="card-text">
                            <span class="badge text-bg-secondary">
                                <i class="bi bi-tags-fill"></i> ${repo.latest_tag}
                            </span>
                            <span class="badge text-bg-secondary">
                                <i class="bi bi-shield-lock-fill"></i> License: <a href="${repo.html_url}/blob/main/LICENSE.md" class="text-light" target="_blank">${repo.license ? repo.license : 'No license specified.'}</a>
                            </span>
                            <span class="badge text-bg-secondary">
                                <i class="bi bi-calendar3-week"></i> Last Update: ${repo.last_update}
                            </span>
                        </p>
                        <h4 class="card-title">${repo.name}</h4>
                        <p class="card-text">${repo.description ? repo.description : 'No description available.'}</p>
                        <div class="btn-group">
                            <a href="${repo.html_url}" class="btn btn-outline-primary" target="_blank"><i class="bi bi-github"></i> Repository</a>
                            ${repo.homepage ? `<a href="${repo.homepage}" class="btn btn-primary" target="_blank"><i class="bi bi-box-arrow-up-right"></i> Open in Browser</a>` : ''}
                        </div>
                    </div>
                </div>
            `;

            const imageOrCanvasPlaceholder = card.querySelector('.image-or-canvas-placeholder');

            // Create an img element to attempt to load the image
            const img = new Image();
            img.src = imagePath;
            img.className = 'card-img-top';
            img.onload = () => {
                imageOrCanvasPlaceholder.appendChild(img);
            };
            img.onerror = () => {
                // If the image fails to load, create and append a canvas
                const canvas = document.createElement('canvas');
                canvas.className = 'card-img-top';
                canvas.width = 1600;
                canvas.height = 900;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = determine_color(repo.name);
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = 'bold 100px Courier';
                ctx.fillStyle = invertColor(determine_color(repo.name));
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(repo.name, canvas.width / 2, canvas.height / 2);
                imageOrCanvasPlaceholder.appendChild(canvas);
            };

            container.appendChild(card);

            // Trigger the opacity change after appending to the DOM
            setTimeout(() => {
                card.querySelector('.card').style.opacity = 1;
            }, 100); // Minimal delay to ensure transition occurs

            // Check if this is the last item
            if (index === repos.length - 1) {
                // Adjust this timeout to ensure it hides after the last item has appeared
                setTimeout(() => {
                    document.getElementById('loadingIndicator').style.display = 'none';
                }, 250); // Adjust this delay if needed
            }
        }, 400 * index); // Increase delay for each card to create a staggered effect
    });
}

function determine_color (str) {
    // Thx to Joe Freeman! https://stackoverflow.com/a/16348977
    let hash = 0;
    str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        colour += value.toString(16).padStart(2, '0')
    }
    return colour
}

function invertColor(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    let num = parseInt(hex, 16);
    let invertedNum = 0xFFFFFF ^ num;
    let invertedHex = invertedNum.toString(16).padStart(6, '0');
    return `#${invertedHex}`;
}