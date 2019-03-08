# Task 4: Accessing the Full Loan Object
Retrieveing the loan field-by-field makes sense when you're binding the data to UI controls, but what if you want to send the entire Loan file contents to a remote service? For these use cases, using the full JSON representation of the Loan can be advantageous. In this task, we'll extract the full Loan JSON object from LO Connect and display it in our Custom Tool.

## Prerequisites
This task assumes you have already completed Task #3 as you will conitnue to build on those files. 

# Instructions
Follow the steps below to complete this task. The files in this folder provide a set of completed reference code for you if you get stuck or just want to skip to the solution.

1. We first need to add a new `<div>` tag to our HTML page that will be used to display the Loan JSON document. Open the HTML file and add the following content directly below the last `<div>` element:

    ```html
    <div class="layoutItem layoutFill">
        <table class="fieldGroup">
            <tr><td class="groupHeader">Loan JSON</td></tr>
            <tr>
                <td class="jsonBox"><pre id="loanJson"></pre></td>
            </tr>
        </table>
    </div>   
    ```

2. We'll retrieve the Loan JSON data from LO Connect using the `loan.all()` function. We'll then take that object and *stringify* it for display in the UI. Add the following function to your JS file:

    ```javascript
    // Retrieves the full Loan JSON and displays it into the form
    async function displayLoanJSON() {
        // Use the Loan.all() method to retrieve the entire loan as
        // as JSON object
        let loan = await elli.script.getObject("loan");
        let loanData = await loan.all();
        
        document.getElementById("loanJson")
            .innerText = JSON.stringify(loanData, null, 3);
    }
    ```

    Note that the function retrieves the "loan" Scripting Object as we have in prior functions. Alternatively, you could simply store a reference to this object in a global variable within your Custom Tool.

3. Next, we'll invoke our new function as part of the "load" function of the Custom Tool. Add an invocation to the `window.load` event handler in your JS file, e.g.

    ```javascript
    // Hook up the initialization function
    window.addEventListener("load", () => {
        elli.script.connect();
        bindToControls();
        displayLoanJSON();
    });   
    ```

4. Save and test your Tool. When the tool loads, you should see the new `<div>` section populated with the full JSON representation of the Loan object. 

5. In your Tool, modify the Borrower's Name and tab out of the field. You'll notice that, although calculations run, your JSON is not updated and is now stale. To address this, we'll add a call to our new function after calling the `loan.calculate()` function. However, because calculations run asynchronously, we need to wait for the calculation results before retrieving the JSON document. We'll do this by using the `Promise.then()` function on the `Promise` object returned by the `loan.calculate()` call. 

    In your JavaScript file, replace the call to `loan.calculate()` with the following logic:

    ```javascript
    loan.calculate().then(() => {
        displayLoanJSON();
    });
    ```

6. Save and re-test your Tool. Note that the JSON object now updates each time you modify and tab out of a field, and reflects the new value you entered along with any calculated values based on that change.

At this point, our Tool works well under Chrome, Firefox, Safari or Edge; but a user that's still running Internet Explorer will find it doesn't work at all. The next task will take you through the process of making your code IE-compatible.