import React, { useState } from 'react';
import axios from 'axios';
import EditorComponent from './Components/EditorComponent';
// ÷mport ModernSingleColumnTemplate from './Components/TemplateGen';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedData, setGeneratedData] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/newsletter/generate-template', { prompt });
      console.log('API Response:', response.data); // Debugging line
      
      const { heading, subheading, articles } = response.data;

      // Check if articles is an array
      if (!Array.isArray(articles)) {
        throw new Error('Articles should be an array ');
      }

      setGeneratedData([...generatedData, { heading, subheading, articles }]);
    } catch (error) {
      console.error('Error fetching generated content:', error);
    }
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
  };

  const handleClose = () => {
    setSelectedContent(null);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(); // Call the generate function when Enter is pressed
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
        setIsClicked(false);
    }, 2000);
};

const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleClick();
    }
};

  return (
    <div className="min-h-screen bg-gray-100 p-10"> <h1 className='text-center text-5xl mb-4 font-weight: 200 font-sans hover:font-serif'>News-Spark</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-2 w-full"
          placeholder="Enter prompt for content generation"
        />
         <button
            type="submit"
            className={`border text-black font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400  ${isClicked ? 'bg-green-900' : 'bg-blue-500'} transition-colors duration-300`}
            onClick={handleClick}
            onKeyPress={handleKeyPress}
            tabIndex={0} // To make it focusable
        >
            Generate Content
        </button>
      </form>

      {/* Display generated content in a grid */}
      <div className="h-40 grid grid-cols-3 gap-6 mt-10 ">
        {
        generatedData.map((content, index) => (
          <div 
            key={index}
            className="p-4 bg-white shadow-md rounded-md hover:cursor-pointer"
            onClick={() => handleContentClick(content)}
          >
            <h1 className="text-lg font-bold">{content.heading.replace(/[\*#]/g, '')}</h1>
            <h2 className="text-md">{content.subheading.replace(/[\*#]/g, '')}</h2>
            <p>{content.articles[1].replace(/[\*#]/g, '') || ''}</p>
          </div>
        ))}
      </div>

      {/* Show the full content in modal when clicked */}
      {selectedContent && (
        <div className="w-1/2  inset-0  bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-2 border-3 border-black rounded-md ">
            <button onClick={handleClose} className="mb-4 text-red-500">Close</button>
            <EditorComponent data={selectedContent} />
            {/* <ModernSingleColumnTemplate data={selectedContent}/> */}
            
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
