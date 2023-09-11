const btn = document.querySelector('button');

btn.addEventListener('click', () => {
    chrome.storage.local.get(["bookmarks"])
        .then(result => console.log(result))
});