import React, { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Media, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const EditorComponent = ({ data }) => {
    const [images, setImages] = useState([null, null]); // State for two images
    const [imageFiles, setImageFiles] = useState([null, null]); // Store image files
    const [editingContent, setEditingContent] = useState(data.articles);
    const [bgColor, setBgColor] = useState('#964B00'); // Background color state
    const [textColor, setTextColor] = useState('#000000'); // Text color state
    const [imageSizes, setImageSizes] = useState([{ width: 200, height: 200 }, { width: 200, height: 200 }]); // State for image sizes
    const componentRef = useRef(null);

    

    // Handle image upload
    const handleImageUpload = (index, e) => {
      const file = e.target.files[0];
      if (file) {
          const updatedImages = [...images];
          const updatedImageFiles = [...imageFiles];
          updatedImages[index] = URL.createObjectURL(file); // Create object URL for preview
          updatedImageFiles[index] = file; // Store the actual file for docx generation
          setImages(updatedImages);
          setImageFiles(updatedImageFiles);
      }
  };

  
  
  // Convert image to base64
  const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
      });
  };
  
  // Handle download as a Word Document
  // Handle download as a Word Document
  const handleDownloadDocx = async () => {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: data.heading, bold: true, size: 32, color: textColor.replace('#', '') })],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: data.subheading, bold: true, size: 28, color: textColor.replace('#', '') })],
                        alignment: AlignmentType.CENTER,
                    }),
                    ...editingContent.map((content) => 
                        new Paragraph({
                            children: [new TextRun({ text: content, size: 24, color: textColor.replace('#', '') })],
                            alignment: AlignmentType.LEFT,
                        })
                    ),
                    // Process images and add them to the document
                    ...(await Promise.all(imageFiles.map(async (file, index) => {
                        if (file) {
                            try {
                                const base64Image = await convertToBase64(file);
                                const image = Media.addImage(doc, base64Image, 400, 400); // Adjust size as needed
                                return new Paragraph({
                                    children: [image],
                                    alignment: AlignmentType.CENTER,
                                });
                            } catch (error) {
                                console.error(`Error converting image at index ${index}:`, error);
                                return null;
                            }
                        }
                        return null;
                    }))).filter(Boolean),
                ],
            },
        ],
    });

    try {
        const blob = await Packer.toBlob(doc);
        saveAs(blob, 'template.docx');
    } catch (error) {
        console.error('Error creating DOCX file:', error);
    }
};

    // Handle download as PDF
    const handleDownloadPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const component = componentRef.current;
    
        // Capture the main component as a canvas
        const canvas = await html2canvas(component, {
            scale: 2,
            backgroundColor: bgColor, // Set the background color from the template
        });
    
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
    
        // If the image height exceeds the page height, we need to split the content into multiple pages
        if (imgHeight > pageHeight) {
            const pages = Math.ceil(imgHeight / pageHeight);
            for (let i = 0; i < pages; i++) {
                const startY = -(i * pageHeight);
                pdf.addImage(imgData, 'PNG', 0, startY, imgWidth, imgHeight);
                if (i < pages - 1) {
                    pdf.addPage(); // Add new page if there's more content
                }
            }
        } else {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        }
    
        pdf.save('newsletter.pdf');
    };
    

    // Update article content
    const handleContentChange = (value, index) => {
        setEditingContent((prevContent) => {
            const newContent = [...prevContent];
            if (newContent[index] !== value) {
                newContent[index] = value;
                return newContent;
            }
            return prevContent; // No change, return previous state
        });
    };

    return (
      <div style={{ backgroundColor: bgColor }} className="w-full h-fit p-3 rounded-lg shadow-md mx-auto">
      <div className="flex h-fit items-center mb-4">
          <label className="mr-2 text-white"><h3 style={{ color: textColor }}>Background Color:</h3></label>
          <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="border rounded"
          />
          <label className="ml-4 mr-2 text-white"><h3 style={{ color: textColor }}>Text Color:</h3></label>
          <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="border rounded"
          />
      </div>

            {/* Grid Layout for heading, subheading, and articles with images */}
            <div className="w-full h-fit p-4 rounded-lg" ref={componentRef}>
                <div className="mb-5 border-b-2 pb-2">
                    <h1 className="text-center text-3xl font-bold mb-2 text-gradient" style={{ background: `linear-gradient(90deg, ${textColor}, #ffffff)` }}>
                        {data.heading.replace(/[\*#]/g, '')}
                    </h1>
                    <h2 className="text-center text-2xl text-gray-600" style={{ color: textColor }}>
                        {data.subheading.replace(/[\*#]/g, '')}
                    </h2>
                </div>

                {/* Article 1 and Image 1 */}
                <div className="w-full grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col justify-between p-2">
                        <p className="text-gray-800 overflow-y-auto    first-line:uppercase first-line:tracking-widest
  first-letter:text-5xl first-letter:font-bold first-letter:{ color: textColor }
  first-letter:mr-3 first-letter:float-left" style={{ color: textColor }}>{editingContent[1]}</p>
                        {!images[0] && (
                            <input
                                type="file"
                                onChange={(e) => handleImageUpload(0, e)}
                                accept="image/*"
                                className="mt-2"
                            />
                        )}
                    </div>

                    <div className="flex justify-center items-center">
                        {images[0] ? (
                            <div style={{ position: 'relative', display: 'inline-block', maxWidth: '90%', maxHeight: '90%' }}>
                                <img
                                    src={images[0]}
                                    alt="Uploaded Image 1"
                                    className="rounded-lg cursor-pointer"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                                    onClick={() => setImages([null])}
                                />
                            </div>
                        ) : (
                            <p className="text-gray-500">Click to upload an image.</p>
                        )}
                    </div>
                </div>

                {/* Article 2 and Image 2 */}
                <div className="m-2 h-fit w-full grid grid-cols-2 gap-4 mb-4">
                    <div className="flex-shrink-0 flex justify-center items-center">
                        {!images[1] && (
                            <input
                                type="file"
                                onChange={(e) => handleImageUpload(1, e)}
                                accept="image/*"
                                className="mb-2"
                            />
                        )}
                        {images[1] && (
                            <div style={{ position: 'relative', display: 'inline-block',  maxWidth: '90%', maxHeight: '90%' }}>
                                <img
                                    src={images[1]}
                                    alt="Uploaded Image 2"
                                    className="rounded-lg cursor-pointer"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                                    onClick={() => setImages([null])}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between p-2">
                        <p className="text-gray-800 overflow-y-auto" style={{ color: textColor }}>{editingContent[3]}</p>
                    </div>
                </div>
                <div className="flex flex-col justify-between p-4">
                    <p className="text-gray-800 overflow-y-auto " style={{ color: textColor }}>{editingContent[5]}</p>
                </div>
            </div>

            {/* Download Buttons */}
            <div className="mt-4">
                <button
                    onClick={handleDownloadDocx}
                    className="hover:bg-green-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400 mr-2"
                >
                    <h3 style={{ color: textColor }}>Download as Docx</h3>
                </button>
                <button
                    onClick={handleDownloadPDF}
                    className="hover:bg-green-900 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    <h3 style={{ color: textColor }}> Download as PDF</h3>
                </button>
            </div>
        </div>
    );
};

export default EditorComponent;
