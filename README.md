# Encompass Custom Tool Demo/Exercise
Encompass Custom Tools allow a developer to extend the functionality of LO Connect by adding external web pages/sites into the Loan Tools menu. These tools can interact with the Loan using via JavaScript, using the objects and functions exposed thru the Ellie Mae JavaScript Framework.

This demo project is meant to show how to create a Custom Tool from scratch that leverages the JavaScript integration features to read/write data from/to the Loan object as well as to invoke REST APIs from the Encompass Lending Platform. The project is broken into several folders, one per task, that are meant to be followed in order to learn how to create your tool from scratch. However, you can always jump to the "final" folder to see the completed custom tool if you prefer not to go thru the individual tasks.

## Custom Tool Tasks
The following table of contents list the different tasks included here as well as the objective of each. Each task includes a complete set of steps within the task folder's readme file. The tasks here assume that you are already familiar with HTML, CSS and JavaScript (ES6).

### Task 1: Creating and Launching a Custom Tool (Basic)
The first step in building your Custom Tool is to set up a basic HTML page and make it available thru LO Connect as a Custom Tool. In this task, you'll learn how to expose your tool to users before we start making it functional.

### Task 2: Accessing Scripting Objects (Basic)
In this task, you will set up your basic HTML page, stylesheet and JS file for the project and add the needed reference to the EMJS framework. You'll then connect your JS code to the framework, retrieve the Loan scripting object, and make your first invocation to retrieve data from the loan.

### Task 3: Writing Loan Data & Running Calcs (Basic)
The third task extends the sample to write changes made to data in your Custom Tool back to the Loan file opened in LO Connect. Additionally, it will show how you can force the LO Connect application to invoke calculations/triggers after setting the field value.

### Task 4: Accessing the Full Loan Object (Basic)
Next, we'll access the entire Loan object as a single JSON document and demonstrate how to extract data from the object. This alternative to the Field ID-based approach demonstrated above allows for a more object-centric view of the Loan that is often useful (and mirrors what is exposed thru the Encompass REST APIs).

### Task 5: Transpiling for Legacy Browser Support (Basic)
The prior tasks have leveraged features of a modern JavaScript version called ES6. Unfortunately, some legacy browsers (specifically, Internet Explorer), do not support this standard. To support these older browsers, we will *transpile* our ES6 code into ES5-compatible code using the Elli-CLI tool.

### Task 6: Invoking REST APIs via Token Exchange (Advanced)
Accessing the Encompass REST APIs is a likely need for many Custom Tools, and doing so is fully supported by the framework. However, in order to maintain security controls, your must implement a process called Token Exchange, which allows your code to obtain an OAuth access token tied to the logged in user's identity in a secure manner. This task shows how to build a token exchange process to call an Encompass REST API.
