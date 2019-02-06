import React from "react";
import ReactDOM from "react-dom";
import FormContainer from './components/form.jsx'

import Bootstrap from 'bootstrap/dist/css/bootstrap.css'; // eslint-disable-line no-unused-vars
import './styles.css'

const Index = () => {
    return <div>Hello React!</div>;
};

ReactDOM.render(<FormContainer />, document.getElementById("index"));