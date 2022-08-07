/* DISPLAY TABS ON OPEN */
document.addEventListener('DOMContentLoaded', async() => {
    // Get tabs via chrome query
    const tabs = await chrome.tabs.query({});
    
    // Create table and header row
    const table = document.createElement('table');
    table.id = "tabs-table";
    //const headerRow = document.createElement('tr');
    
    //table.appendChild(headerRow);
 
    // Add Tabs, URL and Title to the table
    for (const tab of tabs) {
        index = tab.index + 1;
        // create row
        const row = (document.createElement('tr'));
        row.id = tab.id;
        
        // Create a column including tab index e.g. 1, 2, 3, 4
        const indexColumn = document.createElement('td');
        indexColumn.textContent = index;
        
        row.appendChild(indexColumn);
        
        (() => {
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
                
            row.appendChild(titleColumn);
        })();

        (() => {
            // remove column
            const removeColumn = document.createElement('td');
            const remove_button = document.createElement('a');
            
            // Create a button to allow the removal of its row
            const remove_icon = document.createElement('i');
            remove_icon.id = "remove-icon" + index;
             
            // Properties
            remove_button.id = "remove-button" + index;
            remove_button.href = "#";
            remove_button.classList.add("removebutton");
            remove_button.classList.add("close");
            
            remove_button.appendChild(remove_icon);
            
            // Append hyperlink (anchor tag) to savedColumn
            removeColumn.appendChild(remove_button);
            row.appendChild(removeColumn);
        })();

        
        (() => {
            // 'save tab' column
            const saveColumn = document.createElement('td');
            const save_button = document.createElement('a');
            
            // Create a button to allow the removal of its row
            const save_icon = document.createElement('i');
            save_icon.id = "save-icon" + index;
             
            // Set the savebutton's id to itself plus its index.
            save_button.id = "save-button" + index;
            save_button.href = "#";
            save_button.classList.add("savebutton");
            save_button.classList.add("fa-solid", "fa-download");
            
            save_button.appendChild(save_icon);
            
            // Append hyperlink (anchor tag) to savedColumn
            saveColumn.appendChild(save_button);
            row.appendChild(saveColumn);
        })();

        table.appendChild(row);
    }
    // Append the table
    document.body.appendChild(table);
});

document.addEventListener('click', function(e) {
    // Set the table element to saved-table
    table = document.getElementById("tabs-table");
    
    // Iterate through rows in order to determine if any is clicked
    for (var i = 0, row; row = table.rows[i]; i++) {
        var remove_button = table.rows[i].getElementsByTagName('a')[1];
        var save_button = table.rows[i].getElementsByTagName('a')[2];
       
        // Refers to the row of the index clicked.
        var tab_row = remove_button.parentNode.parentNode;
        
        // Detect whether or not remove_button has been pressed
        if(e.target && e.target.id == remove_button.id){
            // Obtain the <tr> element containing the anchor tag
            // remove tab via id of tab_row
            chrome.tabs.remove(Number(tab_row.id));

            // reindex & Remove the HTML from the page
            reIndex(table, remove_button);
            row.parentNode.removeChild(row);
        }
        
        // If the save button has been pressed, save the corresponding tab
        else if(e.target && e.target.id == save_button.id){
            // <td> containing title and href
            const tabInfo = tab_row.getElementsByTagName('a')[0];

            const tname = tabInfo.textContent;
            const thref = tabInfo.href;
            
            chrome.storage.sync.set({ [tname] : thref }, function() {
                var error = chrome.runtime.lastError;
                if (error) { console.error(error); }
            });
        }
    }
});

/* ReIndex function */
function reIndex(table, indexRow) {
    // Get the index of the deleted tab
    deleted_index = indexRow.parentNode.previousSibling.previousSibling.textContent;

    for (i = Number(deleted_index); i < table.rows.length; i++){
        var unindexed_tab = table.rows[i].cells[0];
        
        unindexed_tab.id = "index-" + i;
        unindexed_tab.textContent = i;
    }
}

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
