document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);

    // Store DOM containers and elements
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
        mainContent: $('main-content')
    };

    const storage = {
        save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
        load: key => JSON.parse(localStorage.getItem(key)) || []
    };

    const defaultPermanentPosts = [
        { title: "Researching API Key Hiding", author: "Jeff", date: "2024-09-01", text: "After a few hours of researching...", likeCount: 0, dislikeCount: 0 },
        { title: "Writing a Blog", author: "Jeff", date: "2024-09-18", text: "Over the past two days, I started writing...", likeCount: 0, dislikeCount: 0 }
    ];

    let permanentPosts = storage.load('permanentPosts').length ? storage.load('permanentPosts') : defaultPermanentPosts;
    let reflections = storage.load('reflections');
    let allTechPosts = [];
    let postsPerPage = 5;
    let currentIndex = postsPerPage;

    // Helper functions
    const createEl = (tag, props) => Object.assign(document.createElement(tag), props);
    const clearContainer = container => container.replaceChildren(); // Clear container efficiently
    const saveData = (key, data) => storage.save(key, data);

    const handleLikeDislike = (btn, post, type, isReflection) => {
        post[type === 'like' ? 'likeCount' : 'dislikeCount'] += 1;
        btn.textContent = `${type === 'like' ? '👍 Like' : '👎 Dislike'} (${post[type === 'like' ? 'likeCount' : 'dislikeCount']})`;
        saveData(isReflection ? 'reflections' : 'permanentPosts', isReflection ? reflections : permanentPosts);
    };

    const createButton = (text, className, onclick) => createEl('button', { textContent: text, className, onclick });

    const addPostEntry = (post, container, id = null, isTech = false, isReflection = false) => {
        const entry = createEl('div', { className: 'post-entry' });

        entry.append(
            createEl('h3', { textContent: post.title }),
            createEl('p', { textContent: post.date || 'No Date' }),
            createEl('p', { textContent: post.text || post.description }),
            createEl('div', { className: 'like-dislike-container' }, [
                createButton(`👍 Like (${post.likeCount || 0})`, 'like-button', () => handleLikeDislike(event.target, post, 'like', isReflection)),
                createButton(`👎 Dislike (${post.dislikeCount || 0})`, 'dislike-button', () => handleLikeDislike(event.target, post, 'dislike', isReflection))
            ])
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
    };

    const openReadMorePage = url => {
        containers.mainContent.style.display = 'none';
        containers.postDetailView.style.display = 'block';
        fetch(url)
            .then(res => res.ok ? res.text() : Promise.reject(`Error: ${res.status}`))
            .then(data => containers.readMoreContent.innerHTML = data)
            .catch(err => containers.readMoreContent.innerHTML = `<p>Error: ${err}</p>`);
    };

    const editPost = (post, id, isReflection) => {
        ['title', 'author', 'date', 'text'].forEach(k => containers[`modal${k.charAt(0).toUpperCase() + k.slice(1)}`].value = post[k]);
        toggleModal(true);
        containers.modalForm.onsubmit = e => {
            e.preventDefault();
            ['title', 'author', 'date', 'text'].forEach(k => post[k] = containers[`modal${k.charAt(0).toUpperCase() + k.slice(1)}`].value);
            saveData(isReflection ? 'reflections' : 'permanentPosts', isReflection ? reflections : permanentPosts);
            reloadPosts(isReflection ? containers.reflectionEntries : containers.permanentPosts, isReflection ? reflections : permanentPosts);
            toggleModal(false);
        };
    };

    const deletePost = (id, postEl, isReflection) => {
        const targetArray = isReflection ? reflections : permanentPosts;
        targetArray.splice(id, 1);
        if (!targetArray.length && !isReflection) defaultPermanentPosts.forEach(post => permanentPosts.push(post));
        saveData(isReflection ? 'reflections' : 'permanentPosts', isReflection ? reflections : permanentPosts);
        postEl.remove();
    };

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
            allTechPosts.length ? displayTechPosts(0, postsPerPage) : containers.techPosts.append(createEl('p', { textContent: 'No tech posts available.' }));
        }).catch(() => containers.techPosts.append(createEl('p', { textContent: 'Failed to load tech posts.' })));
    };

    const displayTechPosts = (start, count) => {
        reloadPosts(containers.techPosts, allTechPosts.slice(start, start + count), true);
        updateButtons();
    };

    const updateButtons = () => {
        let loadMoreBtn = containers.techPosts.querySelector('.load-more');
        let loadLessBtn = containers.techPosts.querySelector('.load-less');

        if (!loadMoreBtn && !loadLessBtn) {
            loadMoreBtn = createButton('Load More', 'load-more', loadMorePosts);
            loadLessBtn = createButton('Load Less', 'load-less', loadLessPosts);
            containers.techPosts.append(loadMoreBtn, loadLessBtn);
        }

        loadMoreBtn.style.display = currentIndex >= allTechPosts.length ? 'none' : 'block';
        loadLessBtn.style.display = currentIndex > postsPerPage ? 'block' : 'none';
    };

    const loadMorePosts = () => {
        currentIndex = Math.min(currentIndex + postsPerPage, allTechPosts.length);
        displayTechPosts(0, currentIndex);
    };

    const loadLessPosts = () => {
        currentIndex = Math.max(currentIndex - postsPerPage, postsPerPage);
        displayTechPosts(0, currentIndex);
    };

    const toggleModal = show => containers.reflectionModal.classList.toggle('active', show);

    containers.homeButton.addEventListener('click', showMainContent);
    containers.modalClose.addEventListener('click', () => toggleModal(false));

    const addNewReflectionButton = $('add-new-reflection');
    if (addNewReflectionButton) {
        addNewReflectionButton.addEventListener('click', () => {
            containers.modalForm.reset();
            toggleModal(true);
        });
    }

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

    loadPosts(reflections, containers.reflectionEntries, false, true);
    reloadPosts(containers.permanentPosts, permanentPosts);
    fetchTechPosts();
});
