document.addEventListener('DOMContentLoaded', () => {
    // Helper to select elements by ID
    const $ = id => document.getElementById(id),

    // Store DOM containers and elements
    containers = {
        reflectionEntries: $('reflection-entries'),
        permanentPosts: $('permanent-posts-container'),
        techPosts: $('tech-posts'),
        reflectionModal: $('reflection-modal'),
        modalForm: $('modal-reflection-form'),
        modalTitle: $('modal-reflection-title'),
        modalAuthor: $('modal-reflection-author'),
        modalDate: $('modal-reflection-date'),
        modalText: $('modal-reflection-text'),
        modalClose: $('modal-close'),
        postDetailView: $('post-detail-view'),
        readMoreContent: $('read-more-content'),
        homeButton: $('home-button'),
        mainContent: $('main-content')
    },

    // Utility to load and save data to localStorage
    storage = {
        save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
        load: key => JSON.parse(localStorage.getItem(key)) || []
    };

    // Default permanent posts
    const defaultPermanentPosts = [
        { title: "Researching API Key Hiding", author: "Jeff", date: "2024-09-01", text: "After a few hours of researching on Google and Stack Overflow, I was able to learn how to hide my API key from the outside world using an environment file. After a few attempts, I achieved my objective.", likeCount: 0, dislikeCount: 0 },
        { title: "Writing a Blog", author: "Jeff", date: "2024-09-18", text: "Over the past two days, I started writing my technical blog and posted it on Dev.to. I believe I did the best I could on the topic of 'Why you should hide your API key.'", likeCount: 0, dislikeCount: 0 }
    ];

    // Load posts or set defaults
    let loadedPermanentPosts = storage.load('permanentPosts');
    let permanentPosts = loadedPermanentPosts.length ? loadedPermanentPosts : defaultPermanentPosts;
    let reflections = storage.load('reflections');
    let allTechPosts = []; // Store fetched tech posts
    let postsPerPage = 5; // Posts per page for pagination
    let currentIndex = 0; // Track pagination

    // Create new element helper
    const createEl = (tag, props) => Object.assign(document.createElement(tag), props);

    // Set innerHTML safely
    const safeSetInnerHTML = (element, content) => element ? element.innerHTML = content : console.error('Element not found');

    // Handle Like/Dislike button functionality
    const handleLikeDislike = (btn, post, type, id, isReflection) => {
        post[type === 'like' ? 'likeCount' : 'dislikeCount'] = (post[type === 'like' ? 'likeCount' : 'dislikeCount'] || 0) + 1;
        btn.textContent = `${type === 'like' ? '👍 Like' : '👎 Dislike'} (${post[type === 'like' ? 'likeCount' : 'dislikeCount']})`;
        storage.save(isReflection ? 'reflections' : 'permanentPosts', isReflection ? reflections : permanentPosts);
    };

    // Add post entry (for reflections, permanent, or tech posts)
    const addPostEntry = (post, container, id = null, isTech = false, isReflection = false) => {
        const entry = createEl('div', { className: 'post-entry' }),
        likeDislikeButtons = ['👍 Like', '👎 Dislike'].map((txt, i) => createEl('button', {
            className: i === 0 ? 'like-button' : 'dislike-button',
            textContent: `${txt} (${i === 0 ? post.likeCount || 0 : post.dislikeCount || 0})`,
            onclick: () => handleLikeDislike(likeDislikeButtons[i], post, i === 0 ? 'like' : 'dislike', id, isReflection)
        }));

        entry.append(
            createEl('h3', { textContent: post.title }),
            createEl('p', { textContent: post.date || 'No Date' }),
            createEl('p', { textContent: post.text || post.description }),
            ...likeDislikeButtons
        );

        // For permanent posts and reflections, add Edit/Delete buttons
        if (!isTech) {
            ['Edit', 'Delete'].map((txt, i) => entry.append(createEl('button', {
                textContent: txt, className: i === 0 ? 'edit-button' : 'delete-button',
                onclick: () => i === 0 ? editPost(post, id, isReflection) : deletePost(id, entry, isReflection)
            })));
        } else {
            // For tech posts, add "Read More" button
            entry.append(createEl('a', {
                textContent: 'Read More', href: '#', className: 'read-more-link',
                onclick: e => { e.preventDefault(); openReadMorePage(post.url); }
            }));
        }

        container.appendChild(entry);
    };

    // Load posts into the specified container
    const loadPosts = (posts, container, isTech = false, isReflection = false) => {
        posts.map((post, id) => addPostEntry(post, container, id, isTech, isReflection));
    };

    // Open the "Read More" page for tech posts
    const openReadMorePage = url => {
        containers.mainContent.style.display = 'none'; // Hide main content
        containers.postDetailView.style.display = 'block'; // Show detailed view
        fetch(url).then(res => res.ok ? res.text() : Promise.reject(`Error: ${res.status}`))
            .then(data => safeSetInnerHTML(containers.readMoreContent, data))
            .catch(err => safeSetInnerHTML(containers.readMoreContent, `<p>Error: ${err}</p>`));
    };

    // Edit post functionality (for reflections and permanent posts)
    const editPost = (post, id, isReflection) => {
        ['title', 'author', 'date', 'text'].map(k => containers[`modal${k.charAt(0).toUpperCase() + k.slice(1)}`].value = post[k]);
        toggleModal(true);

        // Remove existing event listener before adding a new one
        containers.modalForm.onsubmit = null;
        containers.modalForm.onsubmit = e => {
            e.preventDefault();
            ['title', 'author', 'date', 'text'].map(k => post[k] = containers[`modal${k.charAt(0).toUpperCase() + k.slice(1)}`].value);
            storage.save(isReflection ? 'reflections' : 'permanentPosts', isReflection ? reflections : permanentPosts);
            reloadPosts(isReflection ? containers.reflectionEntries : containers.permanentPosts, isReflection ? reflections : permanentPosts);
            toggleModal(false);
        };
    };

    // Delete post functionality
    const deletePost = (id, postEl, isReflection) => {
        const targetArray = isReflection ? reflections : permanentPosts;
        targetArray.splice(id, 1);
        if (!targetArray.length && !isReflection) defaultPermanentPosts.forEach(post => permanentPosts.push(post));
        storage.save(isReflection ? 'reflections' : 'permanentPosts', isReflection ? reflections : permanentPosts);
        postEl.remove();
    };

    // Reload posts in the container
    const reloadPosts = (container, posts, isTech = false, isReflection = false) => {
        container.textContent = ''; // Clear container
        loadPosts(posts, container, isTech, isReflection); // Reload posts
    };

    // Fetch tech posts from the API
    const fetchTechPosts = () => {
        fetch('https://api.currentsapi.services/v1/latest-news?category=programming&apiKey=ZZyZV2CXWjXwq_AnBcr_A_CdcRq4K1q4xArsDdaVfTIBNY4-')
            .then(res => res.json())
            .then(data => {
                allTechPosts = data.news || [];
                if (allTechPosts.length) {
                    displayTechPosts(0, postsPerPage);
                } else {
                    containers.techPosts.append(createEl('p', { textContent: 'No tech posts available.' }));
                }
            })
            .catch(err => {
                console.error("Failed to fetch tech posts:", err);
                containers.techPosts.append(createEl('p', { textContent: 'Failed to load tech posts.' }));
            });
    };

    // Display tech posts with pagination
    const displayTechPosts = (start, count) => {
        containers.techPosts.textContent = '';
        loadPosts(allTechPosts.slice(start, start + count), containers.techPosts, true);
        updateButtons();
    };

    // Update pagination buttons
    const updateButtons = () => {
        let loadMoreBtn = containers.techPosts.querySelector('.load-more');
        let loadLessBtn = containers.techPosts.querySelector('.load-less');

        if (!loadMoreBtn && !loadLessBtn) {
            loadMoreBtn = createEl('button', { textContent: 'Load More', className: 'load-more', onclick: loadMorePosts });
            loadLessBtn = createEl('button', { textContent: 'Load Less', className: 'load-less', onclick: loadLessPosts });
            containers.techPosts.append(loadMoreBtn, loadLessBtn);
        }

        loadMoreBtn.style.display = currentIndex >= allTechPosts.length ? 'none' : 'block';
        loadLessBtn.style.display = currentIndex > postsPerPage ? 'block' : 'none';
    };

    // Load more tech posts
    const loadMorePosts = () => displayTechPosts(0, Math.min(currentIndex += postsPerPage, allTechPosts.length));

    // Load fewer tech posts
    const loadLessPosts = () => displayTechPosts(0, Math.max(currentIndex -= postsPerPage, postsPerPage));

    // Toggle modal visibility
    const toggleModal = show => containers.reflectionModal.classList.toggle('active', show);

    // Event listener for Home button
    containers.homeButton.addEventListener('click', () => {
        containers.postDetailView.style.display = 'none';
        containers.mainContent.style.display = 'block';
    });

    // Close modal on close button click
    containers.modalClose.addEventListener('click', () => toggleModal(false));

    // If "Add Reflection" button exists, set up event listener
    const addNewReflectionButton = $('add-new-reflection');
    if (addNewReflectionButton) {
        addNewReflectionButton.addEventListener('click', () => {
            containers.modalForm.reset();
            toggleModal(true);
        });
    }

    // Form submission event listener (add new reflection)
    containers.modalForm.addEventListener('submit', e => {
        e.preventDefault();
        const reflection = {
            title: containers.modalTitle.value,
            author: containers.modalAuthor.value,
            date: containers.modalDate.value,
            text: containers.modalText.value,
            likeCount: 0,
            dislikeCount: 0
        };
        reflections.push(reflection);
        storage.save('reflections', reflections);
        addPostEntry(reflection, containers.reflectionEntries, reflections.length - 1, false, true);
        toggleModal(false);
        containers.modalForm.reset();
    });

    // Log reflection title input changes
    containers.modalTitle.addEventListener('input', e => console.log(`Title changed to: ${e.target.value}`));

    // Log when author field loses focus
    containers.modalAuthor.addEventListener('blur', e => console.log(`Author field lost focus with value: ${e.target.value}`));

    // Load reflections and permanent posts, then fetch tech posts
    loadPosts(reflections, containers.reflectionEntries, false, true);
    reloadPosts(containers.permanentPosts, permanentPosts);
    fetchTechPosts();
});
