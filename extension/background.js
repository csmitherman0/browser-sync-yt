chrome.runtime.onStartup.addListener(() => {
    fetch("http://localhost:8080/bookmarks", {
        method: "GET"
    })
        .then(res => res.json())
        .then(syncedBookmarks => {
            console.log("SERVER: ", syncedBookmarks)
            chrome.bookmarks.getTree((bookmarkTree) => {
                const currBookmarks = bookmarkTree[0].children[0].children;
                console.log("BROWSER: ", currBookmarks)

                for (syncedBookmark of syncedBookmarks) {

                    if (syncedBookmark.removed) {
                        chrome.bookmarks.remove(String(syncedBookmark.bookmarkId));
                    }

                    // If title and URL from server does not match any local bookmark, the server bookmark could either be new or simply updated.
                    if (!currBookmarks.find(el => {
                        return (el.title === syncedBookmark.title && el.url === syncedBookmark.url)
                    })) {

                        // If the ID is also different, then the bookmark is new.
                        if (!currBookmarks.find(el => el.id == syncedBookmark.bookmarkId)) {
                            console.log("NEW BOOKMARK FROM SERVER: ", syncedBookmark)
                            chrome.bookmarks.create({
                                title: syncedBookmark.title,
                                url: syncedBookmark.url,

                            });
                        } else { // If the ID is the same, it is simply updated.
                            chrome.bookmarks.update(
                                String(syncedBookmark.bookmarkId),
                                {
                                    title: syncedBookmark.title,
                                    url: syncedBookmark.url
                                }
                            );
                        }
                    }
                }
            })
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