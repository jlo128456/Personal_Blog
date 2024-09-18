document.addEventListener('DOMContentLoaded', function() {
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
            addReflectionEntry(reflection.title, reflection.author, reflection.date, reflection.text, false);
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
            reflections.push({ title, author, date, text });
        });
        localStorage.setItem('reflections', JSON.stringify(reflections));
    }
     // Variables for permanent post counters
     let permLikes = 0;
     let permDislikes = 0;

     // Like button functionality for the permanent post
     document.getElementById('perm-like-button').addEventListener('click', function() {
         permLikes++;
         this.textContent = `👍 Like (${permLikes})`;
     });

     // Dislike button functionality for the permanent post
     document.getElementById('perm-dislike-button').addEventListener('click', function() {
         permDislikes++;
         this.textContent = `👎 Dislike (${permDislikes})`;
     });

     // Edit button functionality for the permanent post
     document.getElementById('perm-edit-button').addEventListener('click', function() {
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

     // Delete button functionality for the permanent post
     document.getElementById('perm-delete-button').addEventListener('click', function() {
         if (confirm('Are you sure you want to delete this post?')) {
             document.querySelector('.permanent-post').remove();
         }
     });

     // Variables for permanent post 2 counters
let perm2Likes = 0;
let perm2Dislikes = 0;

// Like button functionality for permanent post 2
document.getElementById('perm2-like-button').addEventListener('click', function() {
    perm2Likes++;
    this.textContent = `👍 Like (${perm2Likes})`;
});

// Dislike button functionality for permanent post 2
document.getElementById('perm2-dislike-button').addEventListener('click', function() {
    perm2Dislikes++;
    this.textContent = `👎 Dislike (${perm2Dislikes})`;
});

// Edit button functionality for permanent post 2
document.getElementById('perm2-edit-button').addEventListener('click', function() {
    const newTitle = prompt('Edit Title:', document.getElementById('perm2-title').textContent);
    const newAuthor = prompt('Edit Author:', document.getElementById('perm2-author').textContent.replace('Author: ', ''));
    const newDate = prompt('Edit Date:', document.getElementById('perm2-date').textContent.replace('Date: ', ''));
    const newText = prompt('Edit Reflection:', document.getElementById('perm2-text').textContent);

    if (newTitle && newAuthor && newDate && newText) {
        document.getElementById('perm2-title').textContent = newTitle;
        document.getElementById('perm2-author').textContent = `Author: ${newAuthor}`;
        document.getElementById('perm2-date').textContent = `Date: ${newDate}`;
        document.getElementById('perm2-text').textContent = newText;
    }
});

// Delete button functionality for permanent post 2
document.getElementById('perm2-delete-button').addEventListener('click', function() {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
        document.querySelector('.permanent-post:nth-of-type(2)').remove();
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

    // Increment Like Counter
    likeButton.addEventListener('click', function() {
        likes++;
        likeButton.textContent = `👍 Like (${likes})`;
        saveReflections(); // Save updated like count to localStorage
    });

    // Increment Dislike Counter
    dislikeButton.addEventListener('click', function() {
        dislikes++;
        dislikeButton.textContent = `👎 Dislike (${dislikes})`;
        saveReflections(); // Save updated dislike count to localStorage
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        editReflectionEntry(entryElement, titleElement, authorElement, dateElement, textElement);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
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

// Load reflections from localStorage
function loadReflections() {
    const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
    reflections.forEach(reflection => {
        addReflectionEntry(reflection.title, reflection.author, reflection.date, reflection.text, reflection.likes, reflection.dislikes, false);
    });
}

// Function to handle the add reflection button click
addReflectionButton.addEventListener('click', function() {
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

    // Function to edit a reflection entry
    function editReflectionEntry(entryElement, titleElement, authorElement, dateElement, textElement) {
        const newTitle = prompt('Edit Title:', titleElement.textContent);
        const newAuthor = prompt('Edit Author:', authorElement.textContent.replace('Author: ', ''));
        const newDate = prompt('Edit Date:', dateElement.textContent.replace('Date: ', ''));
        const newText = prompt('Edit Reflection:', textElement.textContent);

        if (newTitle && newAuthor && newDate && newText) {
            titleElement.textContent = newTitle;
            authorElement.textContent = `Author: ${newAuthor}`;
            dateElement.textContent = `Date: ${newDate}`;
            textElement.textContent = newText;
            saveReflections(); // Save updated reflections to localStorage
        }
    }

    // Function to delete a reflection entry
    function deleteReflectionEntry(entryElement) {
        const confirmDelete = confirm("Are you sure you want to delete this reflection?");
        if (confirmDelete) {
            reflectionEntriesContainer.removeChild(entryElement);
            saveReflections(); // Save updated reflections to localStorage after deletion
        }
    }

    // Load reflections on page load
    loadReflections();

    // Check if the localStorage has been cleared in this session
     if (!sessionStorage.getItem('localStorageCleared')) 
        {
    // Clear localStorage
       localStorage.clear();
       console.log('Local storage cleared on page refresh.');
    
    // Set a flag in sessionStorage to prevent clearing localStorage again in the same session
       sessionStorage.setItem('localStorageCleared', 'true');
       }
       
    
    //Fetching news Post from Serpstack.com
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
