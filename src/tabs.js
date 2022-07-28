/* DISPLAY TABS ON OPEN */
document.addEventListener('DOMContentLoaded', async() => {
    // Get tabs via chrome query
    const tabs = await chrome.tabs.query({});
    
    // Create table and header row
    const table = document.createElement('table');
    table.id = "tabs-table";
    const headerRow = document.createElement('tr');
    
    table.appendChild(headerRow);
 
    // Add Tabs, URL and Title to the table
    for (const tab of tabs) {
        // create row
        const row = (document.createElement('tr'));
          
        // Create a column including tab index e.g. 1, 2, 3, 4
        const indexColumn = document.createElement('td');

        // Index plus one will start tab list at 1
        indexColumn.textContent = tab.index + 1;
        
        // create column including tab title
        const titleColumn = document.createElement('td');
        titleColumn.classList.add("opened-tab");

        // Create anchor tag including links
        const tabLink = document.createElement('a');
         
        // set both textcontent and href to tab.title and url respectively.
        tabLink.textContent = tab.title; 
        tabLink.href = tab.url;
        tabLink.setAttribute('target', '_blank');
         
        // Append anchor tab to urlColumn (not row)
        titleColumn.appendChild(tabLink);
         
        // Append the columns
        row.appendChild(indexColumn);
        row.appendChild(titleColumn);
          
        table.appendChild(row);
    }
    // Append the table
    document.body.appendChild(table);
});

/* Save page function*/
savePage.addEventListener("click", async () => {
    // Declare variable tab as the user's active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
     
    // Add page to storage
    chrome.storage.sync.set({ [tab.title] : tab.url }, function() {
        var error = chrome.runtime.lastError;
        if (error) { console.error(error); }
    });
});

/* Save window function */
saveWindow.addEventListener("click", async () => {
    // obtain window's tabs
    const tabs = await chrome.tabs.query({});
    
    // Iterate through tabs and save them
    for (const tab of tabs){
        // Add page to storage
        chrome.storage.sync.set({ [tab.title] : tab.url }, function() {
            var error = chrome.runtime.lastError;
            if (error) { console.error(error); }
        });
    }
});
