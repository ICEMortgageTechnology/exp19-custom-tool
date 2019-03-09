# Task 5: Transpiling for Legacy Browser Support
Your code is working and your Custom Tool behaves as you expect, but one of your users calls to complain that it doesn't work at all for them. You come to find out they are using Internet Explorer 11, which doesn't support many of the ES6 language features we've bee using, such as Promises, async/await, arrow functions, etc. This task shows how you can *transpile* your JavaScript into IE-compatible ES5 files.

## Prerequisites
This task assumes you have already completed Task #4 as it will leverage those files. In addition, the following tools are required:

* [Nodejs](https://nodejs.org/en/)
* [Node Package Manager (NPM)](https://www.npmjs.com/get-npm)

# Instructions
Follow the steps below to complete this task. The files in this folder provide a set of completed reference code for you if you get stuck or just want to skip to the solution.

1. Launch a Command Prompt or terminal window, depending on your OS. Confirm that you have NodeJS and NPM isntalled and in your path by running the following command:

    ```
    PROMPT> npm -v
    6.1.0
    ```

    You should see the NPM version printed after the prompt. If you do not get a version number, use the links above to install NodeJS and NPM on your system.

2. In your Command Prompt, "cd" into the folder holding your project files. For example:

    ```
    PROMPT> cd \exp19-custom-tool
    ```

3. Install the Ell-CLI tool into your project using the NPM install command:

    ```
    PROMPT> npm i @ellimae/elli-cli
    ```

    When the command completes, you should have a `node_modules` folder within your project folder.

4. You're now ready to run the CLI to transpile your code. At the Command Prompt run the following command:

    ```
    PROMPT> node_modules\.bin\elli build customtool.js
    ```

    The command above invokes the `elli` tool with the `build` command option. Following the command, you can list one or more JS files to be transpiled, separated by spaces. As output, the tool generates new files by appending "-es5" to the root file name. After running the command above, you should find a file named `customtool-es5.js` in your project folder.

    Note: if you have the `npx` package installed, you can invoke this tool by running `npx elli build ...`.

5. In your HTML file, replace the reference to your `customtool.js` file with a reference to your new, transpiled `customtool-es5.js`:

    ```html
    <script src="customtool-es5.js"></script>        
    ```

6. Deploy your new JS file and the HTML to your web server and launch the Custom Tool.

Ideally, your tool should work just as it did before. If you're using Windows and have Internet Explorer 11 installed, try it out! Once you're done, you can move on to Task #6, which is meant for *advanced* developers who want to be able to call Ellie Mae's REST APIs from within their Custom Tool.

