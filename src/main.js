document.addEventListener('DOMContentLoaded', function() {
    const accessKey = process.env.SERPSTACK_API_KEY; 
    
    const apiUrl = `https://api.serpstack.com/search?access_key=${accessKey}&query=html,javascript,css,react,programming,coding&engine=google&type=web&device=desktop&location=new york&google_domain=google.com&gl=us&hl=en&page=1&num=25&output=json`;

    const techPostsContainer = document.getElementById('tech-posts'); 
    const loadMoreButton = document.createElement('button');
    const loadingIndicator = document.createElement('div');
    let articles = [];
    let currentIndex = 0;
    const initialPosts = 10;
    const additionalPosts = 15;

    loadMoreButton.textContent = 'Load More';
    loadMoreButton.className = 'load-more';
    loadMoreButton.style.display = 'none'; // Initially hide the button

    loadingIndicator.textContent = 'Loading...';
    loadingIndicator.className = 'loading-indicator';
    techPostsContainer.appendChild(loadingIndicator); // Show loading indicator

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Remove existing children from the container
            while (techPostsContainer.firstChild) {
                techPostsContainer.removeChild(techPostsContainer.firstChild);
            }

            if (data.organic_results && data.organic_results.length > 0) {
                articles = data.organic_results;
                displayTechPosts(initialPosts); // Display initial 10 posts
                setupLoadMoreButton();
            } else {
                const noResultsElement = document.createElement('p');
                noResultsElement.textContent = 'No results found for the given query.';
                techPostsContainer.appendChild(noResultsElement);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const errorElement = document.createElement('p');
            errorElement.textContent = 'Failed to load the technical blog. Please try again later.';
            techPostsContainer.appendChild(errorElement);
        })
        .finally(() => {
            if (loadingIndicator.parentNode) {
                techPostsContainer.removeChild(loadingIndicator); // Hide the loading indicator
            }
        });

    function displayTechPosts(postsToDisplay) {
        const maxIndex = Math.min(currentIndex + postsToDisplay, articles.length);
        for (let i = currentIndex; i < maxIndex; i++) {
            const post = articles[i];
            const postElement = document.createElement('div');
            postElement.classList.add('tech-post');

            const titleElement = document.createElement('h3');
            titleElement.textContent = post.title || 'No title available';
            postElement.appendChild(titleElement);

            const dateElement = document.createElement('p');
            dateElement.classList.add('post-date');
            const publishDate = post.published_at || post.published_date || post.date || 'Date not available'; // Adjust to correct field name
            dateElement.textContent = `Published on: ${publishDate}`;
            postElement.appendChild(dateElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = post.snippet || 'No description available';
            postElement.appendChild(descriptionElement);

            const linkElement = document.createElement('a');
            linkElement.textContent = 'Read more';
            linkElement.href = post.url;
            linkElement.target = '_blank';
            postElement.appendChild(linkElement);

            techPostsContainer.appendChild(postElement);
        }
        currentIndex = maxIndex;
    }

    function setupLoadMoreButton() {
        if (currentIndex < articles.length) {
            loadMoreButton.style.display = 'block'; // Show the button if there are more posts to load
            
            loadMoreButton.removeEventListener('click', onLoadMoreClick);
            loadMoreButton.addEventListener('click', onLoadMoreClick);

            techPostsContainer.appendChild(loadMoreButton);
        }
    }

    function onLoadMoreClick() {
        displayTechPosts(additionalPosts); // Load 15 more posts
        if (currentIndex >= articles.length) {
            loadMoreButton.style.display = 'none'; // Hide the button if no more posts
        }
    }
});
