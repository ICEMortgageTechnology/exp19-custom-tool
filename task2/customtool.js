
// Hook up the initialization function
window.addEventListener("load", () => {
    elli.script.connect();
    bindToControls();
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
    }
}

