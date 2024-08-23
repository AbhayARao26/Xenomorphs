// components/IntroPage.jsx
import React from 'react';
import '../stylesheets/introPage.css';

const IntroPage = ({ onStart }) => {
    return (
        <div className="intro-container">
            <header className="icon-container">
                <h1>Morpho3D</h1>
            </header>
            <div className="content-container">
                <div className="box">
                <div className="box box1">
                <h1 style={{textAlign: 'center'}}>Welcome to Our Cutting-Edge Web-Based 3D Engine</h1>
                    <p>Designed to bring your digital creations to life with unparalleled ease and flexibility. Whether you're a seasoned 3D artist or just getting started, our platform empowers you to:</p>
                    <ul>
                        <li><strong>Import and Customize GLB Models:</strong> Seamlessly bring in your 3D models and take control with our intuitive tools.</li>
                        <li><strong>Animate with Precision:</strong> Add and merge animations, or create entirely new sequences to make your models move exactly how you envision.</li>
                        <li><strong>Tailor Materials:</strong> Change the look and feel of your models by adjusting mesh materials with just a few clicks.</li>
                        <li><strong>Illuminate Your Creations:</strong> Experiment with different lighting setups to find the perfect mood or highlight specific details.</li>
                        <li><strong>Explore Multiple Perspectives:</strong> Set up multiple cameras to capture every angle of your model, offering diverse views and insights.</li>
                        <li><strong>Enhance with Post-Processing:</strong> Apply advanced post-processing effects to add the finishing touches to your project.</li>
                        <li><strong>Export with Confidence:</strong> Once you're done, easily export your work in various formats, ready for presentation or further use.</li>
                    </ul>
                    <p>Our platform is designed for creativity and innovation, giving you all the tools you need to craft stunning 3D visuals and animations directly from your browser. Ready to explore the possibilities? Let’s get started!</p>
                </div>
                <div className="box box2">
                    <button onClick={onStart} className="try-button">Try It Out</button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default IntroPage;