function addGift() {
let name = prompt("What is the gift called?");
if (!name || !name.trim()) return;

let price = prompt("What is the price?");
let image = prompt("Paste a picture URL of the gift:");
let link = prompt("Paste the shopping link:");

let card = document.createElement("div");
card.className = "gift-card";

if (image) {
let photo = document.createElement("img");
photo.src = image;
photo.alt = name;
card.appendChild(photo);
}

let title = document.createElement("h3");
title.textContent = name;
card.appendChild(title);

let cost = document.createElement("p");
cost.textContent = price ? "$" + price.replace("$", "") : "";
card.appendChild(cost);

if (link && /^https?:\/\//i.test(link)) {
let shop = document.createElement("a");
shop.href = link;
shop.target = "_blank";
shop.rel = "noopener noreferrer";
shop.textContent = "View at Store ↗";
card.appendChild(shop);
}

document.getElementById("giftList").appendChild(card);
}

async function addGiftFromLink() {
const link = prompt("Paste your product link 🎀");
if (!link) return;

try {
const response = await fetch("/api/product?url=" + encodeURIComponent(link));
const product = await response.json();

if (!response.ok) {
alert("Couldn't find this product. Try another link!");
return;
}

const card = document.createElement("div");
card.className = "gift-card";

if (product.image) {
const photo = document.createElement("img");
photo.src = product.image;
photo.alt = product.name;
card.appendChild(photo);
}

const title = document.createElement("h3");
title.textContent = product.name;
card.appendChild(title);

const price = document.createElement("p");
price.textContent = product.price
? "$" + product.price
: "Price not available";
card.appendChild(price);

const shop = document.createElement("a");
shop.href = product.url;
shop.target = "_blank";
shop.rel = "noopener noreferrer";
shop.textContent = "Shop This Gift 🛍️";
card.appendChild(shop);
const deleteButton = document.createElement("button");
deleteButton.textContent = "🗑️ Remove Gift";
deleteButton.className = "delete-button";
deleteButton.onclick = function() {
deleteGift(this);
};
card.appendChild(deleteButton);
document.getElementById("giftList").appendChild(card);
saveGifts();
} catch (error) {
alert("Couldn't load the product. Make sure your server is running!");
}
}

function saveGifts() {
const giftList = document.getElementById("giftList");
localStorage.setItem("myChristmasGifts", giftList.innerHTML);
}

const savedGifts = localStorage.getItem("myChristmasGifts");

if (savedGifts) {
document.getElementById("giftList").innerHTML = savedGifts;
}

function deleteGift(button) {
const card = button.closest(".gift-card");

if (card && confirm("Remove this gift from your wishlist? 💗")) {
card.remove();
saveGifts();
}
}
document.querySelectorAll(".gift-card").forEach(function(card) {
if (!card.querySelector(".delete-button")) {
const button = document.createElement("button");
button.textContent = "🗑️ Remove Gift";
button.className = "delete-button";

button.onclick = function() {
deleteGift(this);
};

card.appendChild(button);
}
});

function shareList() {
const giftList = document.getElementById("giftList");
const gifts = [];

giftList.querySelectorAll(".gift-card").forEach(function(card) {
const name = card.querySelector("h3")?.textContent || "";
const price = card.querySelector("p")?.textContent || "";
const image = card.querySelector("img")?.src || "";
const link = card.querySelector("a")?.href || "";

gifts.push({ name, price, image, link });
});

const data = encodeURIComponent(JSON.stringify(gifts));
const shareLink = window.location.origin + "/shared.html?gifts=" + data;
alert("Share link length: " + shareLink.length);

navigator.clipboard.writeText(shareLink).then(function() {
alert("Your wishlist link was copied! 💗🔗");
}).catch(function() {
prompt("Copy your wishlist link:", shareLink);
});
}
