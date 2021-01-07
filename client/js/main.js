window.addEventListener('load', () => {
    const authManager = new AuthManager();
    const contentManager = new ContentManager(authManager);
});
