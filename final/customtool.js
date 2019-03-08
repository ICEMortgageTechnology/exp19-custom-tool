
// Hook up the initialization function
window.addEventListener("load", () => {
    elli.script.connect();
    bindToControls();
    displayLoanJSON();
    loadCustomDataObject();
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

// Loads a custom data object into a dynamic table
async function loadCustomDataObject() {

    // We need to perform a token exchange to generate the
    // access token required to call Dev Connect APIs
    console.log("Creating auth code...");
    let auth = await elli.script.getObject("auth");

    try
    {
        // Generate the auth code
        let authCode = await auth.createAuthCode();
        console.log("Auth code = " + authCode);

        // Exchange for an access token by calling a custom API
        let resp = await $.ajax({
            method: "POST",
            url: "https://<your_tes_host_here>/tokenexchange/api/token",
            data: { authCode: authCode }
        });

        let accessToken = resp.access_token;

        // Now call the Dev Connect API
        resp = await $.ajax({
            method: "GET",
            url: 'https://api.elliemae.com/encompass/v1/company/customObjects/tool_config.json',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
    
        // Decode the custom data object
        let customObj = JSON.parse(atob(resp.dataObject));

        // Display the custom data object
        document.getElementById("cdoJson")
            .innerText = JSON.stringify(customObj, null, 3);
            
    } catch (ex) {
        // Write the exception to the output area
        document.getElementById("cdoJson")
            .innerText = JSON.stringify(ex, null, 3);
    }
}
