// src/pages/questions.js
import { FaHtml5, FaCss3Alt, FaJsSquare, FaPython, FaJava } from "react-icons/fa";
import { SiC } from "react-icons/si";

export const quizData = {
  HTML: [
    {
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Markup Language"],
      answer: "Hyper Text Markup Language"
    },
    {
      question: "Which HTML tag is used to define an internal style sheet?",
      options: ["<style>", "<script>", "<css>", "<link>"],
      answer: "<style>"
    },
    {
      question: "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?",
      options: ["src", "alt", "title", "href"],
      answer: "alt"
    },
    {
      question: "Which doctype is correct for HTML5?",
      options: ["<!DOCTYPE html>", "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN'>", "<!DOCTYPE HTML>", "<!DOCTYPE HTML5>"],
      answer: "<!DOCTYPE html>"
    },
    {
      question: "Which HTML element is used to specify a footer for a document or section?",
      options: ["<bottom>", "<footer>", "<section>", "<foot>"],
      answer: "<footer>"
    }
  ],
  CSS: [
    {
      question: "What does CSS stand for?",
      options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
      answer: "Cascading Style Sheets"
    },
    {
      question: "Which property is used to change the background color?",
      options: ["color", "bgcolor", "background-color", "background"],
      answer: "background-color"
    },
    {
      question: "Which CSS property is used to change the text color of an element?",
      options: ["fgcolor", "text-color", "color", "font-color"],
      answer: "color"
    },
    {
      question: "Which property is used to change the font of an element?",
      options: ["font-style", "font-weight", "font-family", "font-size"],
      answer: "font-family"
    },
    {
      question: "Which property is used to create space between the element's border and its content?",
      options: ["padding", "margin", "spacing", "border-spacing"],
      answer: "padding"
    }
  ],
  JavaScript: [
    {
      question: "Inside which HTML element do we put the JavaScript?",
      options: ["<scripting>", "<javascript>", "<js>", "<script>"],
      answer: "<script>"
    },
    {
      question: "How do you write 'Hello World' in an alert box?",
      options: ["msg('Hello World');", "alert('Hello World');", "alertBox('Hello World');", "msgBox('Hello World');"],
      answer: "alert('Hello World');"
    },
    {
      question: "How do you create a function in JavaScript?",
      options: ["function:myFunction()", "function = myFunction()", "function myFunction()", "create function myFunction()"],
      answer: "function myFunction()"
    },
    {
      question: "How do you call a function named 'myFunction'?",
      options: ["call function myFunction()", "call myFunction()", "myFunction()", "execute myFunction()"],
      answer: "myFunction()"
    },
    {
      question: "How to write an IF statement in JavaScript?",
      options: ["if i = 5 then", "if (i == 5)", "if i == 5", "if i = 5"],
      answer: "if (i == 5)"
    }
  ],
  Python: [
    {
      question: "Which type of programming does Python support?",
      options: ["object-oriented programming", "structured programming", "functional programming", "all of the mentioned"],
      answer: "all of the mentioned"
    },
    {
      question: "Is Python case sensitive when dealing with identifiers?",
      options: ["no", "yes", "machine dependent", "none of the mentioned"],
      answer: "yes"
    },
    {
      question: "Which of the following is the correct extension of the Python file?",
      options: [".python", ".pl", ".py", ".p"],
      answer: ".py"
    },
    {
      question: "All keywords in Python are in _________.",
      options: ["Capitalized", "lower case", "UPPER CASE", "None of the mentioned"],
      answer: "None of the mentioned"
    },
    {
      question: "Which keyword is used for function in Python language?",
      options: ["Function", "def", "Fun", "Define"],
      answer: "def"
    }
  ],
  Java: [
    {
      question: "Who invented Java Programming?",
      options: ["Guido van Rossum", "James Gosling", "Dennis Ritchie", "Bjarne Stroustrup"],
      answer: "James Gosling"
    },
    {
      question: "Which statement is true about Java?",
      options: ["Java is a sequence-dependent programming language", "Java is a code dependent programming language", "Java is a platform-dependent programming language", "Java is a platform-independent programming language"],
      answer: "Java is a platform-independent programming language"
    },
    {
      question: "Which component is used to compile, debug and execute the java programs?",
      options: ["JRE", "JIT", "JDK", "JVM"],
      answer: "JDK"
    },
    {
      question: "Which of these cannot be used for a variable name in Java?",
      options: ["identifier & keyword", "identifier", "keyword", "none of the mentioned"],
      answer: "keyword"
    },
    {
      question: "What is the extension of java code files?",
      options: [".js", ".txt", ".class", ".java"],
      answer: ".java"
    }
  ],
  C: [
    {
      question: "Who is the father of C language?",
      options: ["Steve Jobs", "James Gosling", "Dennis Ritchie", "Rasmus Lerdorf"],
      answer: "Dennis Ritchie"
    },
    {
      question: "Which of the following is not a valid C variable name?",
      options: ["int number;", "float rate;", "int variable_count;", "int $main;"],
      answer: "int $main;"
    },
    {
      question: "All keywords in C are in ____________",
      options: ["LowerCase letters", "UpperCase letters", "CamelCase letters", "None of the mentioned"],
      answer: "LowerCase letters"
    },
    {
      question: "Which is valid C expression?",
      options: ["int my_num = 100,000;", "int my_num = 100000;", "int my num = 10000;", "int $my_num = 10000;"],
      answer: "int my_num = 100000;"
    },
    {
      question: "What is an example of iteration in C?",
      options: ["for", "while", "do-while", "all of the mentioned"],
      answer: "all of the mentioned"
    }
  ]
};

export const languageIcons = {
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  JavaScript: FaJsSquare,
  Python: FaPython,
  Java: FaJava,
  C: SiC
};
