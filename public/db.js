// const { response } = require("express");
// When the site is offline, I want to grab all of the cached data and save it into an object.
const indexedDB = 
window.indexedDB ||
window.mozIndexedDB ||
window.webkitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;


let db;

let request = window.indexedDB.open('budget', 1);

// When the page is refreshed and still offline, I want it to keep showing all the cached data.


    
    
    request.onerror = function() {
        console.log('Database failed to open.')
    };
    
    request.onsuccess = function() {
        console.log('Database opened successfully.');
        db = request.result;
        if (navigator.onLine) {
            addData();
          }
    }
    


// Setting up database tables if it hasn't been set up already.

request.onupgradeneeded = function(e) {
    let db = e.target.result;
    
    let objectStore = db.createObjectStore('budget', { keyPath: 'id', autoIncrement: true });
    
    objectStore.createIndex('title', 'title', { unique: false });
    objectStore.createIndex('body', 'body', { unique: false });
    
    console.log('Database setup complete');
}
    

// When the add or subtract buttons are pushed, I want to save each entry.



function addData() {

    let newItem = { title: titleInput.value, body: bodyInput.value };
    let transaction = db.transaction(['budget'], 'readwrite');
    let objectStore = transaction.objectStore('budget');
    let request = objectStore.add(newItem);

    request.onsuccess = function() {
        titleInput.value = '';
        bodyInput.value = '';
    };

    transaction.oncomplete = function() {
        console.log('Transaction completed.');
    };

    transaction.onerror = function() {
        console.log('Transaction not completed.')
    };

}

// When the page is back online, I want all the data inputted while offline to remain on the page.

function displayData() {
    const transaction = db.transaction(["budget"], "readwrite");
    const store = transaction.objectStore("budget");
    const getAll = store.getAll();

    if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            }
    })
    .then(response => {        
        return response.json();
      })
      .then(() => {
        const transaction = db.transaction(["budget"], "readwrite");
        const store = transaction.objectStore("budget");
        store.clear();
      });
}}

window.addEventListener("online", displayData());