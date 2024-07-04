/* eslint-disable no-unused-vars */
import './index.css'
import 'regenerator-runtime/runtime';
import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useDataContext } from "../../context/geminiAI"
import jsPDF from "jspdf"
import "jspdf-autotable"

import trash from "../../assets/reset.svg"
import loading from "../../assets/loading.gif"


const reportObject = {
    registration_no: Date.now(),
    ticket_no: Math.floor(Math.random() * 100),
    patient_name: 'SK Imtiaj Uddin',
    symptoms_duration: 'Past 1 week',
    symptoms: ['fever', 'headache'],
    possible_diseases: ['fever'],
    medicines: ['paracetamol'],
    tests: ['blood test']
}


const Prescription = () => {
    const [reportData, setReportData] = useState(reportObject);
    const [inputData, setInputData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { parseData } = useDataContext();

    const {
        listening,
        transcript,
        resetTranscript,
        isMicrophoneAvailable,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({});


    const generatePDF = async()=> {
        let pdf = new jsPDF('portrait', 'px');
        pdf.setProperties({
            title: 'Prescription PDF',
            author: 'SK Imtiaj Uddin',
            date: new Date().toISOString().slice(0, 10)
        })

        pdf.autoTable({
            theme: 'plain',
            tableWidth: 340,
            startY: 100,
            head: [['Prescription']],
            headStyles: {
                fontSize: 12,
                fillColor: [0, 80, 255],
                textColor: [255, 255, 255],
                halign: 'center'
            },
            margin: { top: 20, left: 53 },
        });

        let table = [
            ['Reg. No.', reportData.registration_no],
            ['Ticket No', reportData.ticket_no],
            ['Patient Name', reportData.patient_name],            
            ['Symptoms', reportData.symptoms.reduce((prev, cur) => `${prev}, ${cur}` )],
            ['Duration', reportData.symptoms_duration],
            ['Diseases', reportData.possible_diseases.reduce((prev, cur) => `${prev}, ${cur}` )],
            ['Medicines', reportData.medicines.reduce((prev, cur) => `${prev}, ${cur}` )],
            ['Tests', reportData.tests.reduce((prev, cur) => `${prev}, ${cur}` )],
            ['Date', new Date().toISOString().slice(0, 10)]
        ];

        pdf.autoTable({
            theme: 'grid',
            tableWidth: 340,
            startY: 130,
            body: table,
            bodyStyles: {
                fontSize: 11,
                fontSytle: 'bold',
                textColor: 0,
                cellPadding: { top: 5, left: 15, bottom: 5 }
            },
            margin: { top: 20, left: 53 },
            alternateRowStyles: { fillColor: [247, 247, 247] },
        });

        pdf.save(`prescription-${reportData.registration_no}.pdf`);
    }

    const handleOnClick = async () => {   
        try {
            setIsLoading(true)     
            console.log(inputData)
            const res = await parseData(inputData);
            setReportData({
                ...reportData,
                ...res
            });
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    const handleSingleInputs = (e)=> {
        const field = e.target.name;
        setReportData({
            ...reportData,
            [field]: e.target.value,
        })
    }

    const handleArrayInput = (e)=> {
        const index = parseInt(e.target.getAttribute('data-index'));
        const field = e.target.name;

        const updatedArray = [...reportData[field]]; 
        updatedArray[index] = e.target.value; 

        setReportData({
            ...reportData,
            [field]: updatedArray, 
        });
    }

    const handleAddNewField = (e) => {
        const field = e.target.getAttribute('data-name');
        let updatedArray = reportData[field];
        updatedArray.push('');

        setReportData((prevState) => ({
            ...prevState,
            [field]: updatedArray,
        }));
    };

    const handleRemoveField = (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        const field = e.target.getAttribute('data-name');
        const updatedArray = reportData[field].filter((_, i) => i !== index);    
        setReportData({
            ...reportData,
            [field]: updatedArray,
        });
    };

    const startListening = () => {
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    }

    const stopListening = () => {
        SpeechRecognition.stopListening();
    }


    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            console.log("Browser doesn't support speech recognition.");
        } else if (!isMicrophoneAvailable) {
            console.log("Please allow microphone.");
        }
    }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);



    return (
        <section id="prescription">
            <div className="container">

                <div className="col-6">
                    <div className="wrapper">
                        <h3>Information</h3>
                        <hr />
                        <div className="button-group">
                            <button className="btn" type="button" onClick={startListening} >Start</button>
                            <button className="btn" type="button" onClick={stopListening} >Stop</button>
                            <button className="btn" type="button" onClick={resetTranscript} >Clear</button>
                            <button className="btn" type="button" onClick={resetTranscript} >Reset</button>
                        </div>

                        {isLoading && 
                            <div className="loading-container">
                                <img src={loading} alt="loading" width={200} height={200} />
                            </div>
                        }
                        <textarea className="speech-container" value={transcript} onChange={()=> setInputData(transcript)}></textarea>

                        <button className="btn btn-lg" type="button" onClick={handleOnClick}>Parse Content</button>
                    </div>
                </div>

                <div className="col-6">
                    <div className="wrapper">
                        <h3>Prescription</h3>
                        <hr />
                        {
                            reportData &&
                            <form action="#" method="get">
                                <div className="form-body">
                                    <div className="form-group">
                                        <label htmlFor="name">Registration No</label>
                                        <input type="text" name="registration_no" id="regNo" value={reportData.registration_no} onChange={handleSingleInputs} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name">Ticket No</label>
                                        <input type="text" name="ticket_no" id="ticket" value={reportData.ticket_no} onChange={handleSingleInputs} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name">Patient Name</label>
                                        <input type="text" name="patient_name" id="name" value={reportData.patient_name} onChange={handleSingleInputs} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name">Duration</label>
                                        <input type="text" name="symptoms_duration" id="duration" value={reportData.symptoms_duration} onChange={handleSingleInputs} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name">Symptoms</label>
                                        {reportData.symptoms.map((ele, index) => {
                                            return (
                                                <div key={ele} className="input-group">
                                                    <input type="text" name="symptoms" id={ele} data-index={index} value={ele} onChange={handleArrayInput} />
                                                    <img src={trash} alt="remove" data-name="symptoms" data-index={index} onClick={handleRemoveField} />
                                                </div>
                                            )
                                        })}
                                        <p className="add-more" data-name="symptoms" onClick={handleAddNewField} >+ add more</p>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name">Possible Dieseases</label>
                                        {reportData.possible_diseases.map((ele, index) => {
                                            return (
                                                <div key={ele} className="input-group">
                                                    <input type="text" name="possible_diseases" data-index={index} id={ele} value={ele} onChange={handleArrayInput} />
                                                    <img src={trash} alt="remove" data-name="possible_diseases" data-index={index} onClick={handleRemoveField} />
                                                </div>
                                            )
                                        })}
                                        <p className="add-more" data-name="possible_diseases" onClick={handleAddNewField} >+ add more</p>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name">Medicines</label>
                                        {reportData.medicines.map((ele, index) => {
                                            return (
                                                <div key={ele} className="input-group">
                                                    <input type="text" name="medicines" data-index={index} id={ele} value={ele} onChange={handleArrayInput} />
                                                    <img src={trash} alt="remove" data-name="medicines" data-index={index} onClick={handleRemoveField} />
                                                </div>
                                            )
                                        })}
                                        <p className="add-more" data-name="medicines" onClick={handleAddNewField} >+ add more</p>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name">Tests</label>
                                        {reportData.tests.map((ele, index) => {
                                            return (
                                                <div key={ele} className="input-group">
                                                    <input type="text" name="tests" data-index={index} id={ele} value={ele} onChange={handleArrayInput} />
                                                    <img src={trash} alt="remove" data-name="tests" data-index={index} onClick={handleRemoveField} />
                                                </div>
                                            )
                                        })}
                                        <p className="add-more" data-name="tests" onClick={handleAddNewField} >+ add more</p>
                                    </div>
                                </div>

                            </form>
                        }
                        <button type="button" className="btn btn-lg" onClick={generatePDF} >Generate PDF</button>
                    </div>
                </div>

            </div>

        </section>

    )
}

export default Prescription





