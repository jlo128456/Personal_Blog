document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);

    const containers = {
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
        mainContent: $('main-content'),
        techDateFilter: $('tech-date-filter'),
        addNewReflection: $('add-new-reflection')
    };

    const storage = {
        save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
        load: key => JSON.parse(localStorage.getItem(key)) || []
    };

    const defaultPermanentPosts = [
        { title: "Researching API Key Hiding", author: "Jeff", date: "2024-09-01", text: "After a few hours of researching on Google and Stack Overflow, I was able to learn how to hide my API key from the outside world using an environment file. After a few attempts, I achieved my objective.", likeCount: 3, dislikeCount: 3 },
        { title: "Writing a Blog", author: "Jeff", date: "2024-09-18", text: "Over the past two days, I started writing my technical blog and posted it on Dev.to. I believe I did the best I could on the topic of 'Why you should hide your API key.'", likeCount: 0, dislikeCount: 0 },
        { title: "Completing Phase-1 Review", author: "Jeff", date: "2024-10-12", text: "I just completed my Phase-1 project review. After some feedback, I had to add additional functionality and I am now waiting for another review to move forward.", likeCount: 0, dislikeCount: 0 }
    ];
    

    let permanentPosts = storage.load('permanentPosts').length ? storage.load('permanentPosts') : defaultPermanentPosts;
    let reflections = storage.load('reflections');
    let allTechPosts = [];
    let filteredTechPosts = [];
    let postsPerPage = 9;
    let currentIndex = postsPerPage;
//use .foreach() to create elements
    const createEl = (tag, props) => Object.assign(document.createElement(tag), props);
    const clearContainer = container => {
        [...container.children].forEach(child => {
            if (child.id !== 'add-new-reflection') {
                child.remove();
            }
        });
    };
    const saveData = (key, data) => storage.save(key, data);

    const handleLikeDislike = (btn, post, type, isReflection) => {
        post[type === 'like' ? 'likeCount' : 'dislikeCount'] += 1;
        btn.textContent = `${type === 'like' ? '👍 Like' : '👎 Dislike'} (${post[type === 'like' ? 'likeCount' : 'dislikeCount']})`;
        saveData(isReflection ? 'reflections' : 'permanentPosts', isReflection ? reflections : permanentPosts);
    };

    const createButton = (text, className, onclick) => createEl('button', { textContent: text, className, onclick });

    const createLikeDislikeButtons = (post, isReflection) => {
        // Create like and dislike buttons
        const likeButton = createButton(
            `👍 Like (${post.likeCount || 0})`,
            'like-button',
            () => handleLikeDislike(likeButton, post, 'like', isReflection)
        );

        const dislikeButton = createButton(
            `👎 Dislike (${post.dislikeCount || 0})`,
            'dislike-button',
            () => handleLikeDislike(dislikeButton, post, 'dislike', isReflection)
        );

        const likeDislikeContainer = createEl('div', { className: 'like-dislike-container' });
        likeDislikeContainer.append(likeButton, dislikeButton);

        return likeDislikeContainer;
    };

    const addPostEntry = (post, container, id = null, isTech = false, isReflection = false) => {
        const entry = createEl('div', { className: 'post-entry' });
        const likeDislikeContainer = createLikeDislikeButtons(post, isReflection);

        entry.append(
            createEl('h3', { textContent: post.title }),
            createEl('p', { textContent: post.date || 'No Date' }),
            createEl('p', { textContent: post.text || post.description }),
            likeDislikeContainer // Add the like/dislike buttons
        );

        if (isTech) {
            entry.append(createEl('a', {
                textContent: 'Read More', href: '#', className: 'read-more-link',
                onclick: e => { e.preventDefault(); openReadMorePage(post.url); }
            }));
        } else {
            ['Edit', 'Delete'].forEach(action => {
                const actionFn = action === 'Edit' ? () => editPost(post, id, isReflection) : () => deletePost(id, entry, isReflection);
                entry.append(createButton(action, `${action.toLowerCase()}-button`, actionFn));
            });
        }

        container.appendChild(entry);
    };

    const loadPosts = (posts, container, isTech = false, isReflection = false) => posts.forEach((post, id) => addPostEntry(post, container, id, isTech, isReflection));
    const reloadPosts = (container, posts, isTech = false, isReflection = false) => {
        clearContainer(container);
        loadPosts(posts, container, isTech, isReflection);
    };

    const showMainContent = () => {
        containers.postDetailView.style.display = 'none';
        containers.mainContent.style.display = 'block';
        reloadPosts(containers.permanentPosts, permanentPosts);
        reloadPosts(containers.reflectionEntries, reflections);
        displayTechPosts(0, postsPerPage);
        document.body.style.backgroundColor = 'aquamarine';
        window.scrollTo(0, 0);
        window.location.reload();
    };

    const openReadMorePage = url => {
        containers.mainContent.style.display = 'none';
        containers.postDetailView.style.display = 'block';
        fetch(url)
            .then(res => res.ok ? res.text() : Promise.reject(`Error: ${res.status}`))
            .then(data => containers.readMoreContent.innerHTML = data)
            .catch(err => containers.readMoreContent.innerHTML = `<p>Error: ${err}</p>`);
    };
//use of .map to fetch tech post 
    const fetchTechPosts = () => {
        const tags = ['javascript', 'web-development', 'html', 'css'];
        const fetchPromises = tags.map(tag =>
            fetch(`https://dev.to/api/articles?tag=${tag}`).then(res => res.json()).catch(() => [])
        );

        Promise.all(fetchPromises).then(results => {
            allTechPosts = results.flat().map(post => ({
                title: post.title,
                date: post.published_at.split('T')[0],
                text: post.description,
                url: post.url,
                likeCount: 0,
                dislikeCount: 0
            }));
            filteredTechPosts = allTechPosts;
            displayTechPosts(0, postsPerPage);
        }).catch(() => containers.techPosts.append(createEl('p', { textContent: 'Failed to load tech posts.' })));
    };

    const displayTechPosts = (start, count) => {
        reloadPosts(containers.techPosts, filteredTechPosts.slice(start, start + count), true);
        updateButtons();
    };

    const updateButtons = () => {
        let loadMoreBtn = containers.techPosts.querySelector('.load-more');
        let loadLessBtn = containers.techPosts.querySelector('.load-less');

        if (!loadMoreBtn) {
            loadMoreBtn = createButton('Load More', 'load-more', loadMorePosts);
            containers.techPosts.append(loadMoreBtn);
        }
        if (!loadLessBtn) {
            loadLessBtn = createButton('Load Less', 'load-less', loadLessPosts);
            containers.techPosts.append(loadLessBtn);
        }

        loadMoreBtn.style.display = currentIndex >= filteredTechPosts.length ? 'none' : 'block';
        loadLessBtn.style.display = currentIndex > postsPerPage ? 'block' : 'none';
    };

    const loadMorePosts = () => {
        currentIndex = Math.min(currentIndex + postsPerPage, filteredTechPosts.length);
        displayTechPosts(0, currentIndex);
    };

    const loadLessPosts = () => {
        currentIndex = Math.max(currentIndex - postsPerPage, postsPerPage);
        displayTechPosts(0, currentIndex);
    };

    const filterTechPosts = () => {
        const filterDate = containers.techDateFilter.value;
        filteredTechPosts = allTechPosts.filter(post => post.date === filterDate);
        displayTechPosts(0, postsPerPage);
    };

    const toggleModal = (show) => {
        containers.reflectionModal.style.display = show ? 'block' : 'none';
    };

    const deletePost = (id, entry, isReflection) => {
        const postsArray = isReflection ? reflections : permanentPosts;
        postsArray.splice(id, 1);
        saveData(isReflection ? 'reflections' : 'permanentPosts', postsArray);
        entry.remove();
        reloadPosts(isReflection ? containers.reflectionEntries : containers.permanentPosts, postsArray, false, isReflection);
    };

    const editPost = (post, id, isReflection) => {
        containers.modalTitle.value = post.title;
        containers.modalAuthor.value = post.author;
        containers.modalDate.value = post.date;
        containers.modalText.value = post.text;
        toggleModal(true);

        const handleSubmit = e => {
            e.preventDefault();
            post.title = containers.modalTitle.value;
            post.author = containers.modalAuthor.value;
            post.date = containers.modalDate.value;
            post.text = containers.modalText.value;

            saveData(isReflection ? 'reflections' : 'permanentPosts', isReflection ? reflections : permanentPosts);
            reloadPosts(isReflection ? containers.reflectionEntries : containers.permanentPosts, isReflection ? reflections : permanentPosts, false, isReflection);
            toggleModal(false);
            containers.modalForm.removeEventListener('submit', handleSubmit);
        };

        containers.modalForm.addEventListener('submit', handleSubmit);
    };
//event listner "click"
    containers.homeButton.addEventListener('click', showMainContent);
    containers.modalClose.addEventListener('click', () => toggleModal(false));

    containers.addNewReflection.addEventListener('click', () => {
        containers.modalForm.reset();
        toggleModal(true);
    });
// event listner "submit"
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
        saveData('reflections', reflections);
        addPostEntry(reflection, containers.reflectionEntries, reflections.length - 1, false, true);
        toggleModal(false);
        containers.modalForm.reset();
    });
//event listner change to filter tech post
    containers.techDateFilter.addEventListener('change', filterTechPosts);

    loadPosts(reflections, containers.reflectionEntries, false, true);
    reloadPosts(containers.permanentPosts, permanentPosts);
    fetchTechPosts();
});
