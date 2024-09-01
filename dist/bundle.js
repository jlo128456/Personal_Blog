/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ (() => {

eval("document.addEventListener('DOMContentLoaded', function() {\n    const accessKey = \"8e158407220a6527b191e43fff9d75b4\"; \n    \n    const apiUrl = `https://api.serpstack.com/search?access_key=${accessKey}&query=html,javascript,css,react,programming,coding&engine=google&type=web&device=desktop&location=new york&google_domain=google.com&gl=us&hl=en&page=1&num=25&output=json`;\n\n    const techPostsContainer = document.getElementById('tech-posts'); \n    const loadMoreButton = document.createElement('button');\n    const loadingIndicator = document.createElement('div');\n    let articles = [];\n    let currentIndex = 0;\n    const initialPosts = 10;\n    const additionalPosts = 15;\n\n    loadMoreButton.textContent = 'Load More';\n    loadMoreButton.className = 'load-more';\n    loadMoreButton.style.display = 'none'; // Initially hide the button\n\n    loadingIndicator.textContent = 'Loading...';\n    loadingIndicator.className = 'loading-indicator';\n    techPostsContainer.appendChild(loadingIndicator); // Show loading indicator\n\n    fetch(apiUrl)\n        .then(response => {\n            if (!response.ok) {\n                throw new Error(`HTTP error! status: ${response.status}`);\n            }\n            return response.json();\n        })\n        .then(data => {\n            // Remove existing children from the container\n            while (techPostsContainer.firstChild) {\n                techPostsContainer.removeChild(techPostsContainer.firstChild);\n            }\n\n            if (data.organic_results && data.organic_results.length > 0) {\n                articles = data.organic_results;\n                displayTechPosts(initialPosts); // Display initial 10 posts\n                setupLoadMoreButton();\n            } else {\n                const noResultsElement = document.createElement('p');\n                noResultsElement.textContent = 'No results found for the given query.';\n                techPostsContainer.appendChild(noResultsElement);\n            }\n        })\n        .catch(error => {\n            console.error('Error fetching data:', error);\n            const errorElement = document.createElement('p');\n            errorElement.textContent = 'Failed to load the technical blog. Please try again later.';\n            techPostsContainer.appendChild(errorElement);\n        })\n        .finally(() => {\n            if (loadingIndicator.parentNode) {\n                techPostsContainer.removeChild(loadingIndicator); // Hide the loading indicator\n            }\n        });\n\n    function displayTechPosts(postsToDisplay) {\n        const maxIndex = Math.min(currentIndex + postsToDisplay, articles.length);\n        for (let i = currentIndex; i < maxIndex; i++) {\n            const post = articles[i];\n            const postElement = document.createElement('div');\n            postElement.classList.add('tech-post');\n\n            const titleElement = document.createElement('h3');\n            titleElement.textContent = post.title || 'No title available';\n            postElement.appendChild(titleElement);\n\n            const dateElement = document.createElement('p');\n            dateElement.classList.add('post-date');\n            const publishDate = post.published_at || post.published_date || post.date || 'Date not available'; // Adjust to correct field name\n            dateElement.textContent = `Published on: ${publishDate}`;\n            postElement.appendChild(dateElement);\n\n            const descriptionElement = document.createElement('p');\n            descriptionElement.textContent = post.snippet || 'No description available';\n            postElement.appendChild(descriptionElement);\n\n            const linkElement = document.createElement('a');\n            linkElement.textContent = 'Read more';\n            linkElement.href = post.url;\n            linkElement.target = '_blank';\n            postElement.appendChild(linkElement);\n\n            techPostsContainer.appendChild(postElement);\n        }\n        currentIndex = maxIndex;\n    }\n\n    function setupLoadMoreButton() {\n        if (currentIndex < articles.length) {\n            loadMoreButton.style.display = 'block'; // Show the button if there are more posts to load\n            \n            loadMoreButton.removeEventListener('click', onLoadMoreClick);\n            loadMoreButton.addEventListener('click', onLoadMoreClick);\n\n            techPostsContainer.appendChild(loadMoreButton);\n        }\n    }\n\n    function onLoadMoreClick() {\n        displayTechPosts(additionalPosts); // Load 15 more posts\n        if (currentIndex >= articles.length) {\n            loadMoreButton.style.display = 'none'; // Hide the button if no more posts\n        }\n    }\n});\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/main.js"]();
/******/ 	
/******/ })()
;