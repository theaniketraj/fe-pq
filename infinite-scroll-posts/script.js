document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('postsContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const endOfPostsMessage = document.getElementById('endOfPostsMessage');

    let currentPage = 1;
    const postsPerPage = 5; // Number of posts to fetch per "page"
    let isLoading = false;
    let allPostsLoaded = false; // Flag to indicate if all posts have been fetched

    // --- Simulate an API call to fetch posts ---
    // In a real application, this would be an actual AJAX request (e.g., using fetch)
    async function fetchPosts(page) {
        console.log(`Fetching posts for page ${page}...`);
        isLoading = true;
        loadingIndicator.style.display = 'flex'; // Show loading indicator

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newPosts = [];
        // Simulate fetching 'postsPerPage' posts
        // In a real app, the API would handle pagination
        const startId = (page - 1) * postsPerPage + 1;
        for (let i = 0; i < postsPerPage; i++) {
            const postId = startId + i;
            // Simulate running out of posts
            if (postId > 23) { // Let's say we only have 23 posts in total
                allPostsLoaded = true;
                break;
            }
            newPosts.push({
                id: postId,
                title: `Post Title ${postId}`,
                author: `Author ${Math.ceil(postId / 3)}`,
                date: new Date(Date.now() - (24 - postId) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                content: `This is the content for post number ${postId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
            });
        }

        isLoading = false;
        loadingIndicator.style.display = 'none'; // Hide loading indicator
        return newPosts;
    }

    // --- Render posts to the DOM ---
    function renderPosts(posts) {
        if (!posts || posts.length === 0) {
            if (allPostsLoaded && postsContainer.children.length > 0) { // Only show if some posts were already loaded
                endOfPostsMessage.style.display = 'block';
            } else if (postsContainer.children.length === 0) {
                postsContainer.innerHTML = '<p style="text-align:center; color:#777;">No posts available.</p>';
            }
            return;
        }

        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.innerHTML = `
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span>By ${post.author}</span> | <span>${post.date}</span>
                </div>
                <div class="post-content">
                    <p>${post.content.substring(0, 150)}...</p> 
                </div>
            `;
            postsContainer.appendChild(postCard);
        });
    }

    // --- Load more posts function ---
    async function loadMorePosts() {
        if (isLoading || allPostsLoaded) {
            return; // Don't load if already loading or all posts are loaded
        }
        const posts = await fetchPosts(currentPage);
        renderPosts(posts);
        if (!allPostsLoaded) {
            currentPage++;
        } else {
            endOfPostsMessage.style.display = 'block';
        }
    }

    // --- Scroll event listener ---
    function handleScroll() {
        // window.innerHeight: The height of the browser viewport.
        // window.scrollY: The number of pixels that the document is currently scrolled vertically.
        // document.documentElement.scrollHeight: The height of the entire HTML document.
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        // Check if scrolled to near the bottom (e.g., 100px from bottom)
        if (clientHeight + scrollTop >= scrollHeight - 100) {
            console.log("Reached bottom, loading more...");
            loadMorePosts();
        }
    }

    window.addEventListener('scroll', handleScroll);

    // --- Initial load ---
    loadMorePosts(); // Load the first set of posts
});