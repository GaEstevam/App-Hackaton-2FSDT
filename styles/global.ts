import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
    outline:0;
  }

  body {
    background: #FFF ;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility !important;
  }

  body, input, button {
    font: 16px "Montserrat", sans-serif;
    font-weight:300;
  }

  h1,h2,h3,h4,strong{
    font-weight: 500;
  }

  a{
    text-decoration:none;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
    border: 0;
  }

  @media (max-width: 1024px) {
    body, input, button {
    font: 14px "Montserrat", sans-serif;
    font-weight:300;
  }
  }
  @media (max-width: 768px) {
    body, input, button {
    font: 12px "Montserrat", sans-serif;
    font-weight:300;
  }
  }

`;
