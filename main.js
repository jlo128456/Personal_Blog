document.addEventListener('DOMContentLoaded', function() {
    const accessKey = '8e158407220a6527b191e43fff9d75b4'; 
    const query = 'programming and coding'; 
    const apiUrl = `https://api.serpstack.com/search?access_key=${accessKey}&query=${query}&engine=google&type=web&device=desktop&location=Australia&google_domain=google.com&gl=us&hl=en&page=1&num=25&output=json`;

    const techPostsContainer = document.getElementById('tech-post');

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Clear the container before adding new content
            techPostsContainer.innerHTML = '';

            if (data.organic_results && data.organic_results.length > 0) {
                data.organic_results.forEach(result => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('post-item');

                    const titleElement = document.createElement('h3');
                    titleElement.textContent = result.title || 'No title available';
                    postElement.appendChild(titleElement);

                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = result.snippet || 'No description available';
                    postElement.appendChild(descriptionElement);

                    const linkElement = document.createElement('a');
                    linkElement.textContent = 'Read more';
                    linkElement.href = result.url;
                    linkElement.target = '_blank';
                    postElement.appendChild(linkElement);

                    techPostsContainer.appendChild(postElement);
                });
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
        });
});
