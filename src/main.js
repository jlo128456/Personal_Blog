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
        { title: "Researching API Key Hiding", author: "Jeff", date: "2024-09-01", text: "After a few hours of researching on Google and Stack Overflow, I was able to learn how to hide my API key from the outside world using an environment file. After a few attempts, I achieved my objective.", likeCount: 0, dislikeCount: 0 },
        { title: "Writing a Blog", author: "Jeff", date: "2024-09-18", text: "Over the past two days, I started writing my technical blog and posted it on Dev.to. I believe I did the best I could on the topic of 'Why you should hide your API key.", likeCount: 0, dislikeCount: 0 }
    ];

    let permanentPosts = storage.load('permanentPosts').length ? storage.load('permanentPosts') : defaultPermanentPosts;
    let reflections = storage.load('reflections');
    let allTechPosts = [];
    let filteredTechPosts = [];
    let postsPerPage = 5;
    let currentIndex = postsPerPage;

    const createEl = (tag, props) => Object.assign(document.createElement(tag), props);
    const clearContainer = container => container.replaceChildren();
    const saveData = (key, data) => storage.save(key, data);

    const handleLikeDislike = (btn, post, type, isReflection) => {
        post[type === 'like' ? 'likeCount' : 'dislikeCount'] += 1;
        btn.textContent = `${type === 'like' ? '👍 Like' : '👎 Dislike'} (${post[type === 'like' ? 'likeCount' : 'dislikeCount']})`;
        saveData(isReflection ? 'reflections' : 'permanentPosts', isReflection ? reflections : permanentPosts);
    };

    const createButton = (text, className, onclick) => createEl('button', { textContent: text, className, onclick });

    // Ensure that like/dislike buttons are appended properly
    const addPostEntry = (post, container, id = null, isTech = false, isReflection = false) => {
        const entry = createEl('div', { className: 'post-entry' });
        
        // Create like and dislike buttons
        const likeDislike = ['👍 Like', '👎 Dislike'].map((txt, i) => createButton(
            `${txt} (${i === 0 ? post.likeCount || 0 : post.dislikeCount || 0})`,
            i === 0 ? 'like-button' : 'dislike-button',
            () => handleLikeDislike(event.target, post, i === 0 ? 'like' : 'dislike', isReflection)
        ));

        // Append the post details and buttons
        entry.append(
            createEl('h3', { textContent: post.title }),
            createEl('p', { textContent: post.date || 'No Date' }),
            createEl('p', { textContent: post.text || post.description }),
            ...likeDislike // Spread the like/dislike buttons into the entry
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
    const reloadPosts = (container, posts, isTech = false, isReflection = false) => { clearContainer(container); loadPosts(posts, container, isTech, isReflection); };

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
        filteredTechPosts = allTechPosts.filter(post => {
            const matchesDate = filterDate ? post.date === filterDate : true;
            return matchesDate;
        });
        displayTechPosts(0, postsPerPage);
    };

    const toggleModal = (show) => {
        containers.reflectionModal.style.display = show ? 'block' : 'none';
    };

    containers.homeButton.addEventListener('click', showMainContent);
    containers.modalClose.addEventListener('click', () => toggleModal(false));

    containers.addNewReflection.addEventListener('click', () => {
        containers.modalForm.reset();
        toggleModal(true);
    });

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

    containers.techDateFilter.addEventListener('change', filterTechPosts);

    loadPosts(reflections, containers.reflectionEntries, false, true);
    reloadPosts(containers.permanentPosts, permanentPosts);
    fetchTechPosts();
});
