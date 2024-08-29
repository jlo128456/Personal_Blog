const techPostsContainer = document.getElementById('tech-post');
const loadMoreButton = document.createElement('button');
let articles = [];
let currentIndex = 0;
const articlesPerPage = 10;

function clearPreviousPosts() {
    while (techPostsContainer.firstChild) {
        techPostsContainer.removeChild(techPostsContainer.firstChild);
    }
}

function fetchFrontEndDeveloperNews() {
    const apiUrl = 'https://saurav.tech/NewsAPI/everything/cnn.json?q=frontend+development+OR+JavaScript+OR+React+OR+CSS+OR+HTML';

    clearPreviousPosts(); // Clear any previous posts using DOM manipulation

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            articles = data.articles.filter(article => {
                // Filter out articles that don't match the desired keywords in title or description
                const keywords = /frontend|javascript|react|css|html|web development/i;
                return keywords.test(article.title) || keywords.test(article.description);
            });
            currentIndex = 0; // Reset index for new data
            displayTechPosts();
            setupLoadMoreButton();
        })
        .catch(error => {
            const errorElement = document.createElement('p');
            errorElement.textContent = 'Failed to load front-end developer news. Please try again later.';
            techPostsContainer.appendChild(errorElement);
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayTechPosts() {
    const maxIndex = Math.min(currentIndex + articlesPerPage, articles.length);
    for (let i = currentIndex; i < maxIndex; i++) {
        const post = articles[i];
        const postElement = document.createElement('div');
        postElement.classList.add('post-item');

        const titleElement = document.createElement('h3');
        titleElement.textContent = post.title || 'No title available';
        postElement.appendChild(titleElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = post.description || 'No description available';
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
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.className = 'load-more';
        loadMoreButton.addEventListener('click', displayTechPosts);
        techPostsContainer.appendChild(loadMoreButton);
    } else {
        if (loadMoreButton.parentNode) {
            loadMoreButton.parentNode.removeChild(loadMoreButton);
        }
    }
}

// Call the function to fetch and display the news
fetchFrontEndDeveloperNews();
