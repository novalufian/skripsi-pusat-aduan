// background.js

chrome.action.onClicked.addListener((tab) => {
  console.log("Ekstensi diklik pada tab:", tab.id);

  // Injeksi skrip ke halaman web saat tombol ekstensi diklik
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});