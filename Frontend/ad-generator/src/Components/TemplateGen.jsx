// const ModernSingleColumnTemplate = ({ data }) => {
//     const [images, setImages] = useState([null, null]);
//     const [editingContent, setEditingContent] = useState(data.articles);
//     const [bgColor, setBgColor] = useState('#FFFFFF');
//     const [textColor, setTextColor] = useState('#333333');
//     const componentRef = useRef(null);

//     // Handle functions here (image upload, download DOCX/PDF, etc.)

//     return (
//         <div style={{ backgroundColor: bgColor }} className="w-full p-4 rounded-lg shadow-md mx-auto">
//             <div ref={componentRef}>
//                 <h1 className="text-center text-4xl font-bold mb-4" style={{ color: textColor }}>
//                     {data.heading}
//                 </h1>
//                 <h2 className="text-center text-xl mb-8" style={{ color: textColor }}>
//                     {data.subheading}
//                 </h2>
//                 {editingContent.map((content, index) => (
//                     <div key={index} className="mb-6">
//                         <p style={{ color: textColor }}>{content}</p>
//                         {images[index] && (
//                             <div className="text-center">
//                                 <img src={images[index]} alt={`Uploaded Image ${index + 1}`} />
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//             {/* Download Buttons */}
//             <div className="mt-4 text-center">
//                 <button onClick={handleDownloadDocx} className="btn-download">
//                     Download as Docx
//                 </button>
//                 <button onClick={handleDownloadPDF} className="btn-download">
//                     Download as PDF
//                 </button>
//             </div>
//         </div>
//     );
// };
// export default ModernSingleColumnTemplate;