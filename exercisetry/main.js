const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "7fXKDSXrj7RljWC4QTixrd";
const container = document.querySelector('div[data-js="tracks"]');
const main = document.getElementById('main');

function fetchPlaylist(token, playlistId) {
  fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.tracks && data.tracks.items) {
        addTracksToPage(data.tracks.items);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addTracksToPage(items) {
  const ul = document.createElement("ul");
  ul.classList.add("playlist-items");

  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("playlist-item");

    li.innerHTML = `
      ${
        item.track.album.images[0]
          ? `<img class="imgPlaylist" src="${item.track.album.images[0].url}" data-title="${item.track.name}" data-artist="${item.track.artists.map((artist) => artist.name).join(", ")}" data-preview="${item.track.preview_url}">`
          : "<p>No Image available</p>"
      }
      <p>${item.track.name} by ${item.track.artists
        .map((artist) => artist.name)
        .join(", ")}</p>
    `;

    li.addEventListener('click', (event) => {
      const img = event.target.closest('.imgPlaylist');
      if (img) {
        displayInMainArea(img);
      }
    });

    ul.appendChild(li);
  });

  container.appendChild(ul);
}

function displayInMainArea(img) {
  const title = img.getAttribute('data-title');
  const artist = img.getAttribute('data-artist');
  const previewUrl = img.getAttribute('data-preview');

  main.innerHTML = `
    <img src="${img.src}" class="main-song-image">
    <p class="main-song-title">${title} by ${artist}</p>
    ${
      previewUrl
        ? `<audio controls class="previewPlayer" src="${previewUrl}"></audio>`
        : "<p>No preview available</p>"
    }
  `;

  // Use Vibrant.js to extract the dominant color from the image
  const vibrant = new Vibrant(img.src);
  vibrant.getPalette().then((palette) => {
    // Set the background color of the main section to the most vibrant color
    main.style.backgroundColor = palette.Vibrant.hex;
  });
}

function fetchAccessToken() {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.access_token) {
        fetchPlaylist(data.access_token, PLAYLIST_ID);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

fetchAccessToken();
