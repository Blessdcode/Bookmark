/** @format */

const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarkContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

// Show Modal
function showModal() {
	modal.classList.add("show-modal");
	websiteNameEl.focus();
}

modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
	modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
	e.target === modal ? modal.classList.remove("show-modal") : false
);

// validate form
function validate(nameValue, urlValue) {
	const expression =
		/(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
	const regex = new RegExp(expression);
	if (!nameValue || !urlValue) {
		alert("Please submit values for both fields.");
		return false;
	}
	if (!urlValue.match(regex)) {
		alert("Please provide a valid web address.");
		return false;
	}
	return true;
}

// Build bookmarks dom
function buildBookmarks() {
	bookmarkContainer.textContent = "";
	Object.keys(bookmarks).forEach((id) => {
		const { name, url } = bookmarks[id];
		const item = document.createElement("div");
		item.classList.add("item");
		const closeIcon = document.createElement("div");
		closeIcon.classList.add("delete-bookmark");
		closeIcon.setAttribute("title", "Delete Bookmark");
		closeIcon.setAttribute("onClick", `deleteBookmark('${url}')`);
		const linkInfo = document.createElement("div");
		linkInfo.classList.add("name");
		const favicon = document.createElement("img");
		favicon.setAttribute(
			"src",
			`https://s2.googleusercontent.com/s2/favicons?domain=${url}`
		);
		favicon.setAttribute("alt", "Favicon");
		const link = document.createElement("a");
		link.setAttribute("href", `${url}`);
		link.setAttribute("target", "_blank");
		link.textContent = name;
		linkInfo.append(favicon, link);
		item.append(closeIcon, linkInfo);
		bookmarkContainer.appendChild(item);
	});
}

// Fetch Bookmarks
function fetchBookmarks() {
	if (localStorage.getItem("bookmarks")) {
		bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
	} else {
		const id = `https://google.com`;
		(bookmarks[id] = {
			name: "Google",
			url: "https://google.com",
		}),
			localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	}
	// console.log(bookmarks);
	buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(id) {
	if (bookmarks[id]) {
		delete bookmarks[id];
	}
	localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	fetchBookmarks();
}

// Handle Data
function storeBookmark(e) {
	e.preventDefault();
	const nameValue = websiteNameEl.value;
	let urlValue = websiteUrlEl.value;
	if (!urlValue.includes("http://", "https://")) {
		urlValue = `${urlValue}`;
	}
	if (!validate(nameValue, urlValue)) {
		return false;
	}
	const bookmark = {
		name: nameValue,
		url: urlValue,
	};

	bookmarks[urlValue] = bookmark;
	localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	fetchBookmarks();
	bookmarkForm.reset();
	websiteNameEl.focus();
}

//  Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

fetchBookmarks();
