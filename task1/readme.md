# Task 1: Creating and Launching a Custom Tool
In this task, you will walk thru the process of creating a brand new Custom Tool from scratch and learn how to onboard the tool into the LO Connect UI by configuring it in the Encompass Web Admin portal.

## Prerequisites
This task requires: 
* A *basic* knowledge of HTML, CSS
* A web server with a valid SSL certificate to which you can deploy your code (note: a self-signed certificate is sufficient if using "localhost"). 
* An administrator Encompass Login that can be used to access LO Connect (https://www.encompassloconnect.com)

# Instructions
Follow the steps below to complete this task. The files in this folder provide a set of completed reference code for you if you get stuck or just want to skip to the solution.

1. Create an `index.html` file that will house your HTML code. In the file, paste the following code:

    ```html
    <html>
        <body>
            <div class="title">Custom Tool Demo</div><br>

            <div class="layoutBox">
                <div class="layoutItem">
                    <table class="fieldGroup">
                        <tr><td colspan="2" class="groupHeader">Borrower Info</td></tr>
                        <tr>
                            <td class="fieldName">First Name</td>
                            <td class="fieldValue"><input type="text" data-field-id="4000"></td>
                        </tr>
                        <tr>
                            <td class="fieldName">Last Name</td>
                            <td class="fieldValue"><input type="text" data-field-id="4002"></td>
                        </tr>
                    </table>
                </div>
                <div class="layoutItem">
                    <table class="fieldGroup">
                        <tr><td colspan="2" class="groupHeader">Loan Info</td></tr>
                        <tr>
                            <td class="fieldName">Loan Amount</td>
                            <td class="fieldValue"><input type="text" data-field-id="1109"></td>
                        </tr>
                        <tr>
                            <td class="fieldName">Note Rate</td>
                            <td class="fieldValue"><input type="text" data-field-id="3"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </body>
    </html>
    ```

2. In the same folder as your HTML file, create a second file named `customtool.css` and paste in the following stylesheet content:

    ```css
    body {
        font-family: 'Lucida Sans', 'Lucida Sans Regular';
        font-size: 16px;
        padding: 10px;
    }
    .title {
        font-size: 2em;
        color: firebrick;
    }
    .layoutBox {
        display: flex;
        flex-wrap: wrap;
    }
    .layoutItem {
        padding: 5px;
    }
    .layoutFill {
        flex: 1 1 auto;
    }
    .fieldGroup {
        border-spacing: 0px;
        border: 2px solid steelblue;
        width: 100%;
    }
    .groupHeader {
        padding: 3px;
        height: 20px;
        color: whitesmoke;
        background-color: steelblue;
        font-style: italic;
    }
    .fieldName {
        padding: 3px;
    }
    .fieldValue {
        padding: 3px;
    }
    .jsonBox {
        font-family: 'Courier New', Courier, monospace;
    }
    .vscroll {
        height: 400px;
        overflow: scroll;
    }
    ```

3. In your HTML file, create a `<head>` section above the `<body>` and add a reference to your stylesheet:

    ```html
    <head>
        <link rel="stylesheet" type="text/css" href="customtool.css">
    </head>
    ```

5. Deploy your HTML and CSS files to your web server so they are accessible via HTTPS.

6. Open your browser and log into [LO Connect](https://www.encompassloconnect.com/) using your administrator credentials.

7. On the left-hand menu, select `Customizations > Custom Tools` from the left-hand menu.

8. Click `New Custom Tool` and enter a name for your tool. Enter the URL of your tool based on the location you deployed your files in Step #5 above. Click `Save`.

9. Click the `Pipeline` tab at the top of the LO Connect interface. Pick any loan from the lis and click it to open.

10. Once the Loan is open, select `Tools > Custom Tools` from the left-hand navigation. Select your Custom Tool from the list to load your tool.

If your tool loads successfully, then you have successfully completed Task #1! Move on to Task #2 to begin adding code to your tool.
