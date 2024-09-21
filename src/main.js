document.addEventListener('DOMContentLoaded', function () {
     // Elements for permanent posts
       // Elements for permanent posts
    const permPostElements = [
        {
            likeButton: document.getElementById('perm-like-button'),
            dislikeButton: document.getElementById('perm-dislike-button'),
            editButton: document.getElementById('perm-edit-button'),
            deleteButton: document.getElementById('perm-delete-button'),
            titleElement: document.getElementById('perm-title'),
            authorElement: document.getElementById('perm-author'),
            dateElement: document.getElementById('perm-date'),
            textElement: document.getElementById('perm-text'),
            postElement: document.querySelector('#perm-post')  // Unique ID for the permanent post container
        },
        {
            likeButton: document.getElementById('perm2-like-button'),
            dislikeButton: document.getElementById('perm2-dislike-button'),
            editButton: document.getElementById('perm2-edit-button'),
            deleteButton: document.getElementById('perm2-delete-button'),
            titleElement: document.getElementById('perm2-title'),
            authorElement: document.getElementById('perm2-author'),
            dateElement: document.getElementById('perm2-date'),
            textElement: document.getElementById('perm2-text'),
            postElement: document.querySelector('#perm2-post')  // Unique ID for the second permanent post container
        }
    ];

    // Add event listeners to each permanent post's buttons
    permPostElements.forEach(({ likeButton, dislikeButton, editButton, deleteButton, titleElement, authorElement, dateElement, textElement, postElement }) => {
        let likes = 0;
        let dislikes = 0;

        likeButton.addEventListener('click', function () {
            likes++;
            likeButton.textContent = `👍 Like (${likes})`;
        });

        dislikeButton.addEventListener('click', function () {
            dislikes++;
            dislikeButton.textContent = `👎 Dislike (${dislikes})`;
        });

        editButton.addEventListener('click', function () {
            const newTitle = prompt('Edit Title:', titleElement.textContent);
            const newAuthor = prompt('Edit Author:', authorElement.textContent.replace('Author: ', ''));
            const newDate = prompt('Edit Date:', dateElement.textContent.replace('Date: ', ''));
            const newText = prompt('Edit Reflection:', textElement.textContent);

            if (newTitle && newAuthor && newDate && newText) {
                titleElement.textContent = newTitle;
                authorElement.textContent = `Author: ${newAuthor}`;
                dateElement.textContent = `Date: ${newDate}`;
                textElement.textContent = newText;
            }
        });

        deleteButton.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this post?')) {
                postElement.remove();
            }
        });
    });
    const reflectionEntriesContainer = document.getElementById('reflection-entries');
    const addReflectionButton = document.getElementById('add-reflection');
    const reflectionTitleInput = document.getElementById('reflection-title');
    const reflectionAuthorInput = document.getElementById('reflection-author');
    const reflectionDateInput = document.getElementById('reflection-date');
    const reflectionTextInput = document.getElementById('reflection-text');
    
    // Utility functions for Like, Dislike, Edit, and Delete functionality
    function handleLikeDislike(button, counter, type) {
        button.textContent = type === 'like' ? `👍 Like (${counter})` : `👎 Dislike (${counter})`;
        button.addEventListener('click', function () {
            counter++;
            button.textContent = type === 'like' ? `👍 Like (${counter})` : `👎 Dislike (${counter})`;
            saveReflections();  // Save updated like/dislike count to localStorage
        });
    }

    function handleEditPost(titleElement, authorElement, dateElement, textElement) {
        const newTitle = prompt('Edit Title:', titleElement.textContent);
        const newAuthor = prompt('Edit Author:', authorElement.textContent.replace('Author: ', ''));
        const newDate = prompt('Edit Date:', dateElement.textContent.replace('Date: ', ''));
        const newText = prompt('Edit Reflection:', textElement.textContent);

        if (newTitle && newAuthor && newDate && newText) {
            titleElement.textContent = newTitle;
            authorElement.textContent = `Author: ${newAuthor}`;
            dateElement.textContent = `Date: ${newDate}`;
            textElement.textContent = newText;
            saveReflections();  // Save edited reflection to localStorage
        }
    }

    function handleDeletePost(entryElement) {
        if (confirm('Are you sure you want to delete this post?')) {
            entryElement.remove();
            saveReflections();  // Update localStorage after deletion
        }
    }

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
            const likes = parseInt(entry.querySelector('.like-button').textContent.match(/\d+/)[0]);
            const dislikes = parseInt(entry.querySelector('.dislike-button').textContent.match(/\d+/)[0]);
            reflections.push({ title, author, date, text, likes, dislikes });
        });
        localStorage.setItem('reflections', JSON.stringify(reflections));
    }

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
        const dislikeButton = document.createElement('button');
        handleLikeDislike(likeButton, likes, 'like');
        handleLikeDislike(dislikeButton, dislikes, 'dislike');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => handleEditPost(titleElement, authorElement, dateElement, textElement));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => handleDeletePost(entryElement));

        entryElement.append(titleElement, authorElement, dateElement, textElement, likeButton, dislikeButton, editButton, deleteButton);
        reflectionEntriesContainer.appendChild(entryElement);

        if (save) saveReflections();  // Save to localStorage if save is true
    }

    // Handle reflection add button click
    addReflectionButton.addEventListener('click', function () {
        const title = reflectionTitleInput.value;
        const author = reflectionAuthorInput.value;
        const date = reflectionDateInput.value;
        const text = reflectionTextInput.value;

        if (title && author && date && text) {
            addReflectionEntry(title, author, date, text, 0, 0);  // Initialize with 0 likes and dislikes
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

    // Fetch tech news from currents API
    const apiUrl = 'https://api.currentsapi.services/v1/latest-news?category=programming&apiKey=rkSh-hKTu-WUdJJQvOXX4cHyU6oCfeb82Lf5F8jVR6pX24Qb';
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
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            techPostsContainer.removeChild(loadingIndicator);  // Remove the loading indicator

            if (data.news && data.news.length > 0) {
                articles = data.news;  // Store the articles for pagination
                displayTechPosts(initialPosts);  // Display initial set of posts
                setupLoadMoreButton();  // Setup "Load More" button if there are more posts
            } else {
                const noResultsElement = document.createElement('p');
                noResultsElement.textContent = 'No results found.';
                techPostsContainer.appendChild(noResultsElement);
            }
        })
        .catch(error => {
            console.error('Error fetching tech news:', error);
            const errorElement = document.createElement('p');
            errorElement.textContent = 'Failed to load the tech news. Please try again later.';
            techPostsContainer.appendChild(errorElement);
        });
    
    // Function to display a subset of tech posts
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
            dateElement.textContent = `Published on: ${post.published || 'Date not available'}`;
            postElement.appendChild(dateElement);
    
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = post.description || 'No description available';
            postElement.appendChild(descriptionElement);
    
            const linkElement = document.createElement('a');
            linkElement.href = post.url;
            linkElement.target = '_blank';
            linkElement.textContent = 'Read more';
            postElement.appendChild(linkElement);
    
            // Like and Dislike buttons with counters
            const likeButton = document.createElement('button');
            const dislikeButton = document.createElement('button');
            handleLikeDislike(likeButton, 0, 'like');
            handleLikeDislike(dislikeButton, 0, 'dislike');
    
            const buttonsContainer = document.createElement('div');
            buttonsContainer.appendChild(likeButton);
            buttonsContainer.appendChild(dislikeButton);
            postElement.appendChild(buttonsContainer);
    
            techPostsContainer.appendChild(postElement);
        }
        currentIndex = maxIndex;  // Update the current index
    }
    
    // Setup the "Load More" button
    function setupLoadMoreButton() {
        if (currentIndex < articles.length) {
            loadMoreButton.style.display = 'block';  // Show the button if there are more posts to load
            loadMoreButton.addEventListener('click', onLoadMoreClick);
            techPostsContainer.appendChild(loadMoreButton);
        } else {
            loadMoreButton.style.display = 'none';  // Hide the button if no more posts
        }
    }
    
    // Load more posts when the "Load More" button is clicked
    function onLoadMoreClick() {
        displayTechPosts(additionalPosts);  // Load more posts
        if (currentIndex >= articles.length) {
            loadMoreButton.style.display = 'none';  // Hide the button if all posts are loaded
        }
    }
});
