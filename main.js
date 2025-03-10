// Set loader
function showLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
}

// remove loader
function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}
// remove class
function removeActiveClass() {
  const activeButtons = document.getElementsByClassName("active");
  for (let btn of activeButtons) {
    btn.classList.remove("active");
  }
}

// Gobal array
let categories = [];
let videos = [];
let searchedVideos = [];
// Fetch categories

async function loadCategories() {
  try {
    showLoader();
    const response = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/categories`
    );
    const data = await response.json();
    // sore date with global array
    categories = data.categories;
    // console.log(categories);

    hideLoader();
    // now display cats
    displayCategories(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Display categories

function displayCategories(categories) {
  const catContainer = document.getElementById("categoryItems");

  for (let cat of categories) {
    // console.log(cat);

    // create Element
    const Li = document.createElement("li");
    Li.innerHTML = `<a id="cat-${cat.category_id}" onclick="loadCategoryVideos(${cat.category_id})">${cat.category}</a>`;

    // Append the Element
    catContainer.append(Li);
  }
}

// load video

async function loadVideos(searchText = "") {
  try {
    showLoader();

    const response = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
    );
    const data = await response.json();

    // console.log(data);

    removeActiveClass();
    document.getElementById("cat-all").classList.add("active");

    // update to gobal video array
    videos = data.videos;
    // console.log(videos);
    // now display videos

    displayVideos(videos);
  } catch (error) {
    console.log("Error fetching videos:", error);
  }
}
loadVideos();
// Display videos

const displayVideos = (videos) => {
  const videosContainer = document.getElementById("videosContainer");
  videosContainer.innerHTML = "";

  if (videos.length === 0) {
    const element = document.createElement("div");
    element.classList.add("noContent");

    element.innerHTML = `
        <img src="icon.png" alt="no content">
        <p class="no-videos">Oops!!! Sorry there is no content here</p>`;
    videosContainer.appendChild(element);
    hideLoader();
    return;
  }

  videos.map((video) => {
    const div = document.createElement("div");

    // console.log(video.video_id);

    div.classList.add("video");
    div.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}">
  <h3><a href="#" class="video-title">${video.title}</a></h3>
                  <p>${video.authors[0].profile_name}</p>
                <p>${video.others.views} views</p>
                
            `;
    videosContainer.appendChild(div);

    // Add event listener to open modal when clicking the title
    div.querySelector(".video-title").addEventListener("click", () => {
        displayVideoDetails(video);
      });


  });

  hideLoader();
};



//1001
const loadCategoryVideos = async (id) => {
  try {
    showLoader();

    const response = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
    );
    const data = await response.json();

    console.log(data);

    removeActiveClass();
    const clickedButton = document.getElementById(`cat-${id}`);
    clickedButton.classList.add("active");

    displayVideos(data.category);

    // update to gobal video array
    videos = data.videos;
  } catch (error) {
    console.log("Error fetching videos:", error);
  }
};

const loadVideoDetails = async (videoId) => {
    console.log(videoId);
    
  try {
    showLoader();

    const response = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    );
    const data = await response.json();
    console.log(data);
    

    displayVideoDetails(data.video);
  } catch (error) {
    console.log("Error fetching videos:", error);
  }
};

const displayVideoDetails = (video) => {
  const modal = document.getElementById("myModal");

  // Update modal content dynamically
  modal.innerHTML = `
  <div class="modal-content">
      <span class="close">&times;</span>
      <img  src="${video.thumbnail}" alt="${video.title}">
      <h2>${video.title}</h2>	
      <p>By ${video.authors[0].profile_name}</p>

  </div>
  `;

  // Show modal
  modal.style.display = "block";

  // Add event listener for closing the modal
  const closeBtn = modal.querySelector(".close");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// search 
document.getElementById("searchInput").addEventListener("keyup", (e) => {
    const input = e.target.value;
    loadVideos(input);
  });
  
  loadCategories();
  
