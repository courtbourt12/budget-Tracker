// When the site is offline, I want to grab all of the cached data and save it into an object.

const { request } = require("express");
const { format } = require("morgan");

let db;


// When the page is refreshed and still offline, I want it to keep showing all the cached data.

window.onload = function () {
    
    let request = window.indexedDB.open('budget', 1);
    
    request.onerror = function() {
        console.log('Database failed to open.')
    };
    
    request.onsuccess = function() {
        console.log('Database opened successfully.');
        db = request.result;
    }
    
};

// Setting up database tables if it hasn't been set up already.

request.onupgradeneeded = function(e) {
    let db = e.target.result;
    
    let objectStore = db.createObjectStore('budget', { keyPath: 'id', autoIncrement: true });
    
    objectStore.createIndex('title', 'title', { unique: false });
    objectStore.createIndex('body', 'body', { unique: false });
    
    console.log('Database setup complete');
    
}

// When the add or subtract buttons are pushed, I want to save each entry.

form.onsubmit = addData;

function addData(e) {

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

    transaction.onerror = function {
        console.log('Transaction not completed.')
    };

}

// When the page is back online, I want all the data inputted while offline to remain on the page.

function displayData() {
    if (objectStore.result.length > 0) {
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
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore("pending");
        store.clear();
      });
}}

window.addEventListener("online", displayData());