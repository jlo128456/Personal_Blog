document.addEventListener('DOMContentLoaded', function () {
    const reflectionEntriesContainer = document.getElementById('reflection-entries');
    const addReflectionButton = document.getElementById('add-reflection');
    const reflectionTitleInput = document.getElementById('reflection-title');
    const reflectionAuthorInput = document.getElementById('reflection-author');
    const reflectionDateInput = document.getElementById('reflection-date');
    const reflectionTextInput = document.getElementById('reflection-text');

    // Load reflections from localStorage
    function loadReflections() {
        const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
        reflections.forEach(reflection => {
            addReflectionEntry(reflection.title, reflection.author, reflection.date, reflection.text, reflection.likes, reflection.dislikes, false);
        });
    }

    // Save reflections to localStorage
    function saveReflections() {
        const reflections = [];
        document.querySelectorAll('.reflection-entry').forEach(entry => {
            const title = entry.querySelector('.reflection-title').textContent;
            const author = entry.querySelector('.reflection-author').textContent.replace('Author: ', '');
            const date = entry.querySelector('.reflection-date').textContent.replace('Date: ', '');
            const text = entry.querySelector('.reflection-text').textContent;
            const likes = parseInt(entry.querySelector('.like-button').textContent.match(/\d+/)[0]); // Extract likes count
            const dislikes = parseInt(entry.querySelector('.dislike-button').textContent.match(/\d+/)[0]); // Extract dislikes count
            reflections.push({ title, author, date, text, likes, dislikes });
        });
        localStorage.setItem('reflections', JSON.stringify(reflections));
    }

    // Functions for like, dislike, edit, and delete functionalities for permanent posts
    let permLikes = 0, permDislikes = 0;
    document.getElementById('perm-like-button').addEventListener('click', function () {
        permLikes++;
        this.textContent = `👍 Like (${permLikes})`;
    });

    document.getElementById('perm-dislike-button').addEventListener('click', function () {
        permDislikes++;
        this.textContent = `👎 Dislike (${permDislikes})`;
    });

    document.getElementById('perm-edit-button').addEventListener('click', function () {
        const newTitle = prompt('Edit Title:', document.getElementById('perm-title').textContent);
        const newAuthor = prompt('Edit Author:', document.getElementById('perm-author').textContent.replace('Author: ', ''));
        const newDate = prompt('Edit Date:', document.getElementById('perm-date').textContent.replace('Date: ', ''));
        const newText = prompt('Edit Reflection:', document.getElementById('perm-text').textContent);

        if (newTitle && newAuthor && newDate && newText) {
            document.getElementById('perm-title').textContent = newTitle;
            document.getElementById('perm-author').textContent = `Author: ${newAuthor}`;
            document.getElementById('perm-date').textContent = `Date: ${newDate}`;
            document.getElementById('perm-text').textContent = newText;
        }
    });

    document.getElementById('perm-delete-button').addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this post?')) {
            document.querySelector('.permanent-post').remove();
        }
    });

    // Function to add a reflection entry
    function addReflectionEntry(title, author, date, text, likes = 0, dislikes = 0, save = true) {
        const entryElement = document.createElement('div');
        entryElement.classList.add('reflection-entry');

        const titleElement = document.createElement('h3');
        titleElement.classList.add('reflection-title');
        titleElement.textContent = title;

        const authorElement = document.createElement('p');
        authorElement.classList.add('reflection-author');
        authorElement.textContent = `Author: ${author}`;

        const dateElement = document.createElement('p');
        dateElement.classList.add('reflection-date');
        dateElement.textContent = `Date: ${date}`;

        const textElement = document.createElement('p');
        textElement.classList.add('reflection-text');
        textElement.textContent = text;

        // Like and Dislike Buttons with Counters
        const likeButton = document.createElement('button');
        likeButton.textContent = `👍 Like (${likes})`;
        likeButton.classList.add('like-button');

        const dislikeButton = document.createElement('button');
        dislikeButton.textContent = `👎 Dislike (${dislikes})`;
        dislikeButton.classList.add('dislike-button');

        likeButton.addEventListener('click', function () {
            likes++;
            likeButton.textContent = `👍 Like (${likes})`;
            saveReflections(); // Save updated like count to localStorage
        });

        dislikeButton.addEventListener('click', function () {
            dislikes++;
            dislikeButton.textContent = `👎 Dislike (${dislikes})`;
            saveReflections(); // Save updated dislike count to localStorage
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function () {
            editReflectionEntry(entryElement, titleElement, authorElement, dateElement, textElement);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteReflectionEntry(entryElement);
        });

        entryElement.appendChild(titleElement);
        entryElement.appendChild(authorElement);
        entryElement.appendChild(dateElement);
        entryElement.appendChild(textElement);
        entryElement.appendChild(likeButton);
        entryElement.appendChild(dislikeButton);
        entryElement.appendChild(editButton);
        entryElement.appendChild(deleteButton);

        reflectionEntriesContainer.appendChild(entryElement);

        if (save) saveReflections(); // Save to localStorage if save is true
    }

    // Handle reflection add button click
    addReflectionButton.addEventListener('click', function () {
        const title = reflectionTitleInput.value;
        const author = reflectionAuthorInput.value;
        const date = reflectionDateInput.value;
        const text = reflectionTextInput.value;

        if (title && author && date && text) {
            addReflectionEntry(title, author, date, text, 0, 0); // Initialize with 0 likes and dislikes
            reflectionTitleInput.value = '';
            reflectionAuthorInput.value = '';
            reflectionDateInput.value = '';
            reflectionTextInput.value = '';
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Load reflections on page load
    loadReflections();

    // Check if localStorage has been cleared in this session
    if (!sessionStorage.getItem('localStorageCleared')) {
        localStorage.clear();  // Clear localStorage
        sessionStorage.setItem('localStorageCleared', 'true');  // Prevent clearing in the same session
    }

    // Fetch tech news from Newsdata.io
const apiUrl = `https://newsdata.io/api/1/news?apikey=pub_53833f43b5b84b0c5d65296735964d65cb437&q=chatgpt&country=au&language=en&category=technology `;

const techPostsContainer = document.getElementById('tech-posts');
const loadMoreButton = document.createElement('button');
const loadingIndicator = document.createElement('div');
loadingIndicator.textContent = 'Loading...';
techPostsContainer.appendChild(loadingIndicator);

let articles = [];
let currentIndex = 0;
const initialPosts = 10;
const additionalPosts = 15;

loadMoreButton.textContent = 'Load More';
loadMoreButton.className = 'load-more';
loadMoreButton.style.display = 'none';  // Initially hidden

// Fetch tech news
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (loadingIndicator.parentNode) {
            techPostsContainer.removeChild(loadingIndicator);  // Remove loading indicator
        }

        if (data.results && data.results.length > 0) {
            articles = data.results;  // Newsdata.io uses "results" instead of "articles"
            displayTechPosts(initialPosts);  // Display initial posts
            setupLoadMoreButton();  // Setup "Load More" button
        } else {
            const noResultsElement = document.createElement('p');
            noResultsElement.textContent = 'No results found.';
            techPostsContainer.appendChild(noResultsElement);
        }
    })
    .catch(error => {
        console.error('Error fetching tech news:', error);
        const errorElement = document.createElement('p');
        errorElement.textContent = 'Failed to load tech news. Please try again later.';
        techPostsContainer.appendChild(errorElement);
    });

// Function to display tech posts
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
        const publishDate = post.pubDate || 'Date not available';  // Newsdata.io uses "pubDate"
        dateElement.textContent = `Published on: ${publishDate}`;
        postElement.appendChild(dateElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = post.description || 'No description available';
        postElement.appendChild(descriptionElement);

        const linkElement = document.createElement('a');
        linkElement.href = post.link || '#';  // Newsdata.io uses "link" for the article URL
        linkElement.target = '_blank';
        linkElement.textContent = 'Read more';
        postElement.appendChild(linkElement);

        techPostsContainer.appendChild(postElement);
    }
    currentIndex = maxIndex;  // Update current index
}

// Setup "Load More" button
function setupLoadMoreButton() {
    if (currentIndex < articles.length) {
        loadMoreButton.style.display = 'block';
        loadMoreButton.addEventListener('click', onLoadMoreClick);
        techPostsContainer.appendChild(loadMoreButton);
    }
}

// Load more posts on "Load More" button click
function onLoadMoreClick() {
    displayTechPosts(additionalPosts);  // Load more posts
    if (currentIndex >= articles.length) {
        loadMoreButton.style.display = 'none';  // Hide button if all posts loaded
    }
}

});
