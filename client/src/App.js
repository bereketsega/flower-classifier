import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { FaGithub } from "react-icons/fa6";

function App() {
    const [data, setData] = useState(null)
    const [res, setRes] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]; // get the file

        // display the image
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const elem = document.createElement('canvas');
            elem.width = 256;
            elem.height = 256;
        }
        setData(img);

        // send the image to the server
        const formData = new FormData();
        formData.append('file', file);

        axios.post('https://flower-classifier-7yed.onrender.com/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then(res => {
            // change the confidence to percentage
            res.data.confidence = (res.data.confidence * 100).toFixed(2);
            setRes(res.data);
            // get the image tag and change the border color
            const img = document.querySelector('img');
            img.style.border = `1px solid ${getColor(res.data.confidence)}`;
        }
        ).catch(err => console.log(err));
    }

    /**
     * Gets the color of the border based on the confidence
     * @param {number} confidence the confidence of the prediction
     * @returns red, yellow or green based on the confidence
     */
    const getColor = (confidence) => {
        // below 50 red , 50-70 yellow, above 70 green
        if (confidence < 50) {
            return 'red';
        } else if (confidence < 70) {
            return 'yellow';
        } else {
            return 'green';
        }
    }


  return (
    <div className="App">
        <header className='header'>
            <h1>Flower Classifier</h1>
            <a href="https://github.com/bereketsega/flower-classifier" target="_blank" rel="noreferrer">
                <FaGithub size={30} />
                <p>GitHub</p>
            </a>
        </header>
        <div className='input-file'>
            <input type="file" onChange={handleFileUpload}/>
            <img src={data ? data.src: null} alt="" width={'400px'} height={'400px'}/>
        </div>

        {res && 
        <div className='prediction'>
            <p>Flower Type: {res.class}</p>
            <p>Confidence: {res.confidence}%</p>
        </div>
        }
    </div>
  );
}

export default App;
