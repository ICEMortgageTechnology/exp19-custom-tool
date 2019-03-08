# Task 3: Writing Loan Data & Running Calcs
Having read data from the Loan and binding it to the Tool's control, we need to complete the binding so that any changes to the controls within the Custom Tool get written back to the Loan object. We'll also learn how to force LO Connect to invoke calculations and triggers to ensure that all side effects of our change are reflected in the UI.

## Prerequisites
This task assumes you have already completed Task #2 as you will conitnue to build on those files. 

# Instructions
Follow the steps below to complete this task. The files in this folder provide a set of completed reference code for you if you get stuck or just want to skip to the solution.

1. When the user modifies a value in one of the tool's TextBox elements, we need to write that value back to the Loan object opened within LO Connect. To achieve this, we need to listen for the `change` event on the HTML `<input>` element. Modify the `bindToControls()` function in your JS file to add the following logic immediately after the last line of the `for` loop:

    ```javascript
    // Bind to the contol's change event to update the field
    // back to the loan object
    elm.addEventListener("change", event => {
        // Create a name/value map with the field ID/value
        loan.setFields({
            [fieldId]: event.target.value
        });
    });
    ```

    The code above subscribes to the control's `change` event and uses an ES6 "arrow function" to create an inline callback that will be invoked for the event. The callback uses the same `loan` object retrieved earlier in the call to invoke the `loan.setFields()` function. This function can be used to update multiple fields in a single call, but we will only be updating one field at a time.

2. Save your JS file and reload your Custom Tool in LO Connect. Modify the Borrower's First Name and tab out of the field. Note that the Borrower's name should be updated in the summary bar at the top of the screen. Similarly, modify the Loan Amount field and note the behavior. Additionally, if you navigate to a form, such as the Borrower Summary, you should see your changes reflected.

3. When you modified the Loan Amount field, you likely noticed that the application "spinner" was shown as LO Connect invoked calculations and triggers associated with that field. However, modifying the borrower's name generally will not cause this behavior (depending on your system configuration). LO Connect makes decisions based on the calculations and rules defined in your system to determine if/when to re-compute the data in the UI.

    There may be times when you want to force this behavior, i.e. when you want LO Connect to reflect any effects of a field change in the UI immediately. You can directly invoke this behavior using the `loan.calculate()` function. Add this function call to your "change" event handler after setting the value of the field. The updated code should look as follows:

    ```javascript
    // Bind to the contol's change event to update the field
    // back to the loan object
    elm.addEventListener("change", event => {
        // Create a name/value map with the field ID/value
        loan.setFields({
            [fieldId]: event.target.value
        });

        loan.calculate();
    });
    ```

4. Save and re-test your Custom Tool. Now, when you change the Borrower Name, you should see the spinner as LO Connect posts this data back to the Ellie Mae servers to evaluate against your rules. Note that this process causes a loss of responsiveness for the user while the calculations are running. You should limit the cases in which your force calculations to only those that are really necessary to ensure you do not negatively impact usability of your Custom Tool.

You're now ready for the next task, which will show how to access the entire Loan object in a single function call.

