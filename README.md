# Jeff's Reflections & Technical Blog

Welcome to my personal space where I share my thoughts, reflections, and technical insights. This blog is divided into two main sections: **Personal Reflections** and **Technical Blog**. Feel free to explore, learn, and engage with the content. 

---

## Table of Contents

- [Personal Reflections](#personal-reflections)
  - [Recent Entries](#recent-entries)
- [Technical Blog](#technical-blog)
  - [Latest Posts](#latest-posts)
- [Setup & Installation](#setup--installation)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Using Webpack](#using-webpack)
- [Contributing](#contributing)
- [Contact Me](#contact-me)

---

## Personal Reflections

### Recent Entries

Here, I share my personal thoughts, experiences, and reflections on various topics that matter to me. This is a space for introspection, life lessons, and candid stories.
<!-- Added permanent posts with function and local storage to make post persistent -->
  - **Permanent Entry 1: [Title of Reflection]**
    - A brief description or excerpt from the reflection.
  
  - **Permanent Entry 2: [Title of Reflection]**
    - A brief description or excerpt from the reflection.

---

<!-- Add your personal journal entries below as sub-bullets -->

- **Entry 1: [Title of Reflection]**
  - A brief description or excerpt from the reflection.
  
- **Entry 2: [Title of Reflection]**
  - A brief description or excerpt from the reflection.

---

## Technical Blog

### Latest Posts

In this section, I dive into the technical world, where you'll find a variety of technical posts designed to inform and inspire.

<!-- Add your technical blog posts below as sub-bullets -->

- **Post 1: [Title of Post]**
  - A brief summary or key takeaways from the post.
  
- **Post 2: [Title of Post]**
  - A brief summary or key takeaways from the post.

---

## Setup & Installation

### Prerequisites

Before setting up the project, ensure that you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/) (includes `npm`)
- A modern web browser

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name


 ### Using Webpack

Webpack is used to bundle the JavaScript files and manage project dependencies.

### Installing Webpack

Webpack and Webpack CLI are already included in the project's `package.json`. To install them, just run the following command:
     
   
    npm install --save-dev webpack webpack-cli

### Webpack Configuration

The `webpack.config.js` file is pre-configured to bundle the JavaScript files and handle environment variables. Here’s an example:

    ```javascript
    const path = require('path');
    const Dotenv = require('dotenv-webpack');

    module.exports = {
      entry: './src/main.js',
      output: 
      {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
     },
     plugins: [
        new Dotenv()
     ],
    };

### Running Webpack

To bundle the JavaScript files, use the following command:

     
     npx webpack --mode development

This will generate the bundled bundle.js file in the dist directory.

## Explanation: Why the API Key is Hardcoded
In this project, I've hardcoded the API key for fetching tech news from a third-party API. While hardcoding API keys is generally discouraged in production environments due to security risks, this decision was made to simplify the setup for local testing and demo purposes.

For personal or non-critical projects, this approach can work, but in real-world applications, it’s best to store sensitive information like API keys in environment variables or a backend server to prevent exposure.

If you'd like to run the project locally without a backend, you can continue to use the hardcoded key as provided in the current configuration. However, once the project is hosted, I highly recommend switching to a more secure method for handling sensitive information.

## Contributing

Contributions are always welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## Contact Me

I'm always open to connecting with readers, fellow developers, and anyone interested in tech or the topics I write about. You can reach out to me via email.

**Email:** [j.lo128456@gmail.com](mailto:j.lo128456@gmail.com)

---

Thank you for visiting my blog! I hope you find the content both useful and thought-provoking. Don't hesitate to leave comments or reach out to me if you have any questions or feedback.


