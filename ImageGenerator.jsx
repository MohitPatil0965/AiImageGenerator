import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/Cartoon Style Robot-Photoroom.png';

const ImageGenerator = () => {
    const [imageUrl, setImageUrl] = useState("/");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null); // Declared as inputRef (camelCase)

    const imageGenerator = async () => {
        if (inputRef.current.value === "") { // Now using inputRef consistently
            setError("Please enter a description");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                "https://api.openai.com/v1/images/generations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer your api key here`,
                    },
                    body: JSON.stringify({
                        prompt: `${inputRef.current.value}`, // Using inputRef
                        n: 1,
                        size: "512x512",
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            
            if (data.data && data.data[0]?.url) {
                setImageUrl(data.data[0].url);
            } else {
                throw new Error("No image URL found in response");
            }
        } catch (err) {
            setError(err.message);
            console.error("Error generating image:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='ai-image-generator'>
            <div className="header">AI Image <span>Generator</span></div>
            
            <div className="img-loading">
                <div className="image">
                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : (
                        <img 
                            src={imageUrl === "/" ? default_image : imageUrl} 
                            alt={inputRef.current?.value || "AI Generated"} 
                            onError={(e) => {
                                e.target.src = default_image;
                                setError("Failed to load image");
                            }}
                        />
                    )}
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-box">
                <input 
                    type="text" 
                    ref={inputRef} // Using inputRef
                    className='search-input' 
                    placeholder='Describe Your Image'
                    disabled={loading}
                />
                <button 
                    className="generate-btn" 
                    onClick={imageGenerator}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate'}
                </button>
            </div>
        </div>
    )
}

export default ImageGenerator;