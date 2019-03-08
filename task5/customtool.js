
// Hook up the initialization function
window.addEventListener("load", () => {
    elli.script.connect();
    bindToControls();
    displayLoanJSON();
});

// Bind the form controls to the loan fields
async function bindToControls() {
    // Get the Loan object from the application
    let loan = await elli.script.getObject("loan");

    // Retrieve all input elements on the page
    let inputs = document.querySelectorAll("[data-field-id]");
    
    for (let i = 0; i < inputs.length; i++) {
        let elm = inputs[i];

        // Read the custom field ID attribute -- this
        // will contain the loan Field ID for the box
        let fieldId = elm.getAttribute("data-field-id");
        let fieldValue = await loan.getField(fieldId);
        if (fieldValue) elm.value = fieldValue.toString();

        // Bind to the contol's change event to update the field
        // back to the loan object
        elm.addEventListener("change", event => {
            // Create a name/value map with the field ID/value
            loan.setFields({
                [fieldId]: event.target.value
            });

            // Force an invocation of all calcs for the field
            loan.calculate().then(() => {
                displayLoanJSON();
            });
        });
    }
}

// Retrieves the full Loan JSON and displays it into the form
async function displayLoanJSON() {
    // Use the Loan.all() method to retrieve the entire loan as
    // as JSON object
    let loan = await elli.script.getObject("loan");
    let loanData = await loan.all();
    
    document.getElementById("loanJson")
        .innerText = JSON.stringify(loanData, null, 3);
}

