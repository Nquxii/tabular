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
         
         
        // Options column ('management' menu)
        const optionsColumn = document.createElement('td');

        // Button / anchortag
        const remove_button = document.createElement('a');
        
        // Create a button to allow the removal of its row
        const remove_icon = document.createElement('i');
        remove_icon.id = "remove-icon" + index;
         
        // Set the remove button's id to itself plus its index.
        remove_button.id = "remove-button" + index;
        //remove_button.textContent = "remove"; 
        remove_button.href = "#"; remove_button.classList.add("removebutton");
        remove_button.classList.add("fa-solid", "fa-xmark", "fa-lg");
        
        remove_button.appendChild(remove_icon);
        // Append hyperlink (anchor tag) to savedColumn
        optionsColumn.appendChild(remove_button);
          
        // Append columns to the row it belongs in 
        tabrow.appendChild(indexCol);
        tabrow.appendChild(savedColumn);
        tabrow.appendChild(optionsColumn);
          
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

/* Remove a saved tab */
document.addEventListener('click', function(e) {
    // Set the table element to saved-table
    table = document.getElementById("saved-table");
    
    // Iterate through rows in order to determine if any is clicked
    for (var i = 0, row; row = table.rows[i]; i++) {
        // set the remove button as its element id
        var removebutton = row.getElementsByTagName('a')[1];
        console.log("RemoveButton:", removebutton);
        
        // Detect whether or not a button has been pressed
        if(e.target && e.target.id == removebutton.id){
            // Obtain the button referring to the row
            const savedTab = document.getElementById(removebutton.id);
             
            // Obtain the <td> element containing the anchor tag
            var tabInfo = savedTab.parentNode.previousSibling;
            console.log("tabInfo", tabInfo);
            
            // Get the title of the tab which will be used to remove it
            var removalTab = tabInfo.getElementsByTagName('a')[0].innerHTML;
            
            // Remove the requested tab from chrome's localstorage.
            chrome.storage.sync.remove(removalTab, function() {
                var error = chrome.runtime.lastError;
                if (error) { console.error(error); }
            });

            // ReIndex the table 
            reIndex(table, savedTab);
            
            // Remove the HTML from the page
            row.parentNode.removeChild(row);
        }
    }
});

/* ReIndex function */
function reIndex(table, indexRow) {
    // Get the index of the deleted tab
    deleted_index = indexRow.parentNode.previousSibling.previousSibling.textContent;
    console.log("Deleted Index:", deleted_index);

    for (i = Number(deleted_index); i < table.rows.length; i++){
        var unindexed_tab = document.getElementById('saved-table').rows[i].cells[0];
        
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
