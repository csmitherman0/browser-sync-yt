chrome.runtime.onStartup.addListener(() => {
    fetch("http://localhost:8080/bookmarks", {
        method: "GET"
    })
        .then(res => res.json())
        .then(data => {
            chrome.storage.local.set({ bookmarks: data })
        })
});

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    const { title, url } = bookmark;

    fetch("http://localhost:8080/bookmarks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            url,
            bookmarkId: id
        })
    })
        .then(res => console.log(res))
        .catch(e => console.log(e));
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
    fetch(`http://localhost:8080/bookmarks/${id}`, {
        method: "DELETE"
    })
        .then(res => console.log(res))
        .catch(e => console.log(e));
});

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
    const { title, url } = changeInfo;
    fetch(`http://localhost:8080/bookmarks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            url
        })
    })
        .then(res => console.log(res))
        .catch(e => console.log(e));
});