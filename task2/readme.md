# Task 2: Accessing Scripting Objects
In this task, we will extend the Custom Tool by adding code that populates the tool's elements with data from the Loan opened in LO Connect. This integration requires the use of *Scripting Objects* exposed to your code thru the Ellie Mae JavaScript Framework (EMJSF). The files in this folder provide a reference implementation for this task.

## Prerequisites
This task assumes you have already completed Task #1 as you will conitnue to build on those files. Additionally, this task requires:
* A *basic* knowledge of JavaScript (ES6)

# Instructions
Follow the steps below to complete this task. The files in this folder provide a set of completed reference code for you if you get stuck or just want to skip to the solution.

1. Create a new file in the same folder as your HTML page named `customtool.js` and, for now, leave the file empty. This file will be used for all of the JavaScript code you will be creating in this project. Once created, add a `<script>` tag reference within the `<head>` section of your HTML file to reference this JS file:

    ```html
    <script src="customtool.js"></script>        
    ```

2. Next, we need to include a reference to the Ellie Mae JavaScript Framework (EMJSF) into our page. The EMJSF enables communication between your Custom Tool and the LO Connect application. To load the framework, add a `<script>` tag into the `<head>` region of your HTML page that loads the "guest" portion of the EMJSF:

    ```html
    <script src="https://cdn.elliemae.io/elliemae/core/ssf/1.0/elli.ssf.guest-with-polyfill.js"></script>
    ```

    Note that the `src` of the script references the officially published version on Ellie Mae's Content Delivery Network (CDN) site, `cdn.elliemae.io`. By referencing this version, you will be sure to receive any bug fixes or enhancements that may be released over time.

3. Now we'll add the only bit of *required* JavaScript to our JS file, which will initialize the connection between our tool and the host application (LO Connect). Within your JS file, add the following code, which listens for the window's load event before calling the `elli.script.connect()` function.

    ```javascript
    // Hook up the initialization function
    window.addEventListener("load", () => {
        elli.script.connect();
    });
    ```

    It's important to wait for the window.load event before initializing the EMJSF framework as this will ensure the libraries are properly loaded.

4. Next, we will add the code necessary to populate the textboxes on the HTML page with the data from the appropriate Loan fields. Note that the `<input>` elements in the HTML have been extended with a custom attribute named `data-field-id`, e.g.

    ```html
    <input type="text" data-field-id="4000">
    ```

    We will use this custom attribute to tell our Custom Tool the Field ID for each field on the screen. In the JS file, add the following function:

    ```javascript
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
    ```

    The code above retrieves the `loan` Scripting Object from the EMJSF using the `elli.script.getObject()` call. This call will be used throughout your code to retrieve object references from the host application.

    After retrieving the Loan object, the code loops over all HTML elements that include a `data-field-id` attribute (i.e. our `<input>` tags) and, for each, retrieves the value of the corresponding field using the `loan.getField()` function.

5. Finally, we need to invoke this new function as part of the `load` event in our JS file. Add a call to our new function to the `window.load` event handler, with the resulting handler looking as follows:

    ```javascript
    // Hook up the initialization function
    window.addEventListener("load", () => {
        elli.script.connect();
        bindToControls();
    });
    ```

6. Return to your browser and log back in to LO Connect if necessary. Navigate to your Custom Tool.

If the form control elements in your tool load with the proper field data, then you have sucecssfully completed this task. Move to Task #3 to learn how to write the user's changes back to the Loan object.
