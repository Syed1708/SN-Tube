// console.log("hello");

let activeCategory = 'All';  
let categories = [];
let videos = [];
let searchedVideos = []; 

// Set loader
function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; 
}

// remove loader
function hideLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';  
}
// Step 1 call api

async function fetchCats() {

    try {
        showLoader();
        const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/categories`);
        const data = await response.json();
        // sore date with global array 
        categories = data.categories;
        // console.log(categories);

        hideLoader();
        // now display cats
        displayCategories(categories);

    } catch (error) {
        console.log('Error fetching categories:', error);
    }
    
    
}

fetchCats();

async function fetchVideos() {
    // const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();  

    try {

        showLoader();
        
        const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/videos`);
        const data = await response.json();
        // update to gobal video array
        videos = data.videos;
        // console.log(videos);
        // now display videos
        displayVideos('All');
        hideLoader();

    } catch (error) {
        console.log('Error fetching videos:', error);
    }
    
    
}

fetchVideos();


// Step 2 display cat and videos

function displayCategories(cats) {
    const catContainer = document.getElementById('categoryItems');
    catContainer.innerHTML = "";

    // create li and a and set onclik event
    const elementLi = document.createElement('li');
    const elementA = document.createElement('a');
    elementA.href = "#";
    elementA.textContent = 'All';
    elementA.onclick = (event) => {
   
        event.preventDefault();
        activeCategory = 'All';  // Set active category to 'All'
        displayVideos('All');    // Call function to display videos
        updateActiveCategory(); 
    };
    elementLi.appendChild(elementA);
    catContainer.appendChild(elementLi);
    // console.log(elementLi.innerHTML);


    // Now populate orthers category

    cats.map(cat =>{
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = "#";
        a.textContent = cat.category;
        a.onclick = (event) => {
            event.preventDefault();
            // i need to pass category_id not nage
            activeCategory = cat.category; 
            displayVideos(cat.category_id);  
            updateActiveCategory();
        };
        li.appendChild(a);
        catContainer.appendChild(li);
    })

    function updateActiveCategory() {
        // Remove active class from all categories
        const categoryLinks = catContainer.querySelectorAll('a');
        console.log(categoryLinks);
        
        categoryLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });

        // Add active class to the selected category
        categoryLinks.forEach(link => {
            if (link.textContent === activeCategory) {
                link.parentElement.classList.add('active');
            }
        });
    }

    // Initialize the active category on page load
    updateActiveCategory();

}

function displayVideos(categoryId){
    
    const videosContainer = document.getElementById('videosContainer');
    videosContainer.innerHTML = "";

// filter by cat
    const filteredVideosByCat = categoryId === 'All' ? videos :
     videos.filter(video => video.category_id === categoryId);
    



    // no data for filtercat
    if (filteredVideosByCat.length === 0) {
    
        const element = document.createElement('div');
        element.classList.add('noContent');
        
        element.innerHTML = `
        <img src="icon.png" alt="no content">
        <p class="no-videos">Oops!!! Sorry there is no content here</p>`;
        videosContainer.appendChild(element);
        return;
    }



    // Now populate orthers category

    filteredVideosByCat.map(video =>{
        const div = document.createElement('div');

        // console.log(video.others.views);
        
            div.classList.add('video');
            div.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}">
                <h3><a href="">${video.title}</a></h3>
                <p>${video.authors[0].profile_name}</p>
                <p>${video.others.views} views</p>
                
            `;
            videosContainer.appendChild(div);
    })
}

// search btn
const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
const search = document.getElementById("search");

search.addEventListener("click", function(e){
    if(searchInput){
        e.preventDefault();
        fetchVideos();
    // filter by search
    const videosContainer = document.getElementById('videosContainer');
    videosContainer.innerHTML = "";

    searchedVideos = searchInput
    ? videos.filter(video => video.title.toLowerCase().includes(searchInput)) 
    : "";

    if (searchedVideos.length === 0) {
    
        const element = document.createElement('div');
        element.classList.add('noContent');
        
        element.innerHTML = `
        <img src="icon.png" alt="no content">
        <p class="no-videos">Oops!!! Sorry there is videos found matching your search</p>`;
        videosContainer.appendChild(element);
        return;
    }

    searchedVideos.map(video =>{
        const div = document.createElement('div');

        // console.log(video.others.views);
        
            div.classList.add('video');
            div.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}">
                <h3><a href="">${video.title}</a></h3>
                <p>${video.authors[0].profile_name}</p>
                <p>${video.others.views} views</p>
                
            `;
            videosContainer.appendChild(div);
    })
        
    }

    
})






