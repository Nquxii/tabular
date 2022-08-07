/* DISPLAY TABS ON OPEN */
document.addEventListener('DOMContentLoaded', async() => {
    // Obtain chrome.localStorage, in this case representing saved tabs
    const stored_tabs = await chrome.storage.sync.get();

    var index = 1; // set an index assigned to the button
    
    // Create a table with an id of saved-table
    const table = document.createElement('table');
    table.id = "saved-table";
    
    // loop through chrome localstorage (saved tabs in this context)
    for (const [key, val] of Object.entries(stored_tabs)) {
        // Create the main row featuring all necessary columns
        const tabrow = document.createElement('tr');
        tabrow.id = "tab-row" + index;

        // Create index column
        const indexCol = document.createElement('td');
        indexCol.textContent = index;
        indexCol.classList.add("indice");
        indexCol.id = "index-" + index;

        // Create column including tab title + hyperlink
        const savedColumn = document.createElement('td');
        savedColumn.classList.add("saved-tab");

        // Create anchor tag including link(s)
        const hyperlink = document.createElement('a');
        
        // Set both textcontent and href to val
        hyperlink.textContent = key; hyperlink.href = val;
        hyperlink.setAttribute('target', '_blank');
        
        // Append anchor tab to savedColumn (not row)
        savedColumn.appendChild(hyperlink);
         
        // removeColumn ('management' menu)
        const removeColumn = document.createElement('td');
        const remove_button = document.createElement('a');
         
        // Create a button to allow the removal of its row
        const remove_icon = document.createElement('i');
        remove_icon.id = "remove-icon" + index;
         
        // Properties
        remove_button.id = "remove-button" + index;
        remove_button.href = "#"; 
        remove_button.classList.add("remove_button");
        remove_button.classList.add("close");
        
        remove_button.appendChild(remove_icon);
        
        // Append hyperlink (anchor tag) to savedColumn
        removeColumn.appendChild(remove_button);
          
        
        // Append columns to the row it belongs in 
        tabrow.appendChild(indexCol);
        tabrow.appendChild(savedColumn);
        tabrow.appendChild(removeColumn);
          
        // Append row consisting of the column info
        table.appendChild(tabrow);
        
        index++; // increase index for next tab
    }
    
    document.body.appendChild(table);
});

/* Clear saved tabs function */
clearSaved.addEventListener("click", async () => {
    // Clear storage on the respective button click
    chrome.storage.sync.clear();
});

/* Remove a saved tab or save a given tab */
document.addEventListener('click', function(e) {
    // Set the table element to saved-table
    table = document.getElementById("saved-table");
    
    // Iterate through rows in order to determine if any is clicked
    for (var i = 0, row; row = table.rows[i]; i++) {
        // set the remove button as its element id
        var remove_button = row.getElementsByTagName('a')[1];
        
        if(e.target && e.target.id == remove_button.id){
            // Obtain the <td> element containing the anchor tag
            var tabInfo = remove_button.parentNode.previousSibling;
            
            // Get the title of the tab which will be used to remove it
            var removalTab = tabInfo.getElementsByTagName('a')[0].innerHTML;
            
            // Remove the requested tab from chrome's localstorage.
            chrome.storage.sync.remove(removalTab, function() {
                var error = chrome.runtime.lastError;
                if (error) { console.error(error); }
            });
            
            // Change index order of tabs & delete HTML from the page
            reIndex(table, remove_button);
            row.parentNode.removeChild(row);
        }
    }
});

/* ReIndex function */
function reIndex(table, indexRow) {
    // Get the index of the deleted tab
    deleted_index = indexRow.parentNode.previousSibling.previousSibling.textContent;

    // Loop through deleted tab to the last tab and set its value as the correct index
    for (i = Number(deleted_index); i < table.rows.length; i++){
        var unindexed_tab = table.rows[i].cells[0];
        
        unindexed_tab.id = "index-" + i;
        unindexed_tab.textContent = i;
    }
}

/* TO-DO
 * - remove superflous comments
 * - code up better UI
 * - add export to csv and export to json features
 * - add save/remove buttons to the tab overview
 * - improve engineering of main features (classes)
 * */
