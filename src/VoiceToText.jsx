/* eslint-disable react/no-unescaped-entities */
import 'regenerator-runtime/runtime';
import { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import micOff from './assets/mic-off.svg'
import micOn from './assets/mic-on.svg'
import copy from './assets/copy.svg'
import reset from './assets/reset.svg'
import tips from './assets/tips.svg'
import wave from './assets/pulse.gif'

const VoiceToText = () => {
    const [output, setOutput] = useState('');
    const [tip, setTip] = useState('Try saying - sum 0f 5 and 10')
    const [intervalID, setIntervalID] = useState(null);
    const [search, setSearch] = useState(null);

    const changeListening = ()=> {
        listening ? stopListening() : startListening();
    }

    const tipsArr = [
        'Try saying - sum 0f 5 and 10',
        'Try saying - open google.com',
        'Try saying - multiply 5 and 10',
        'Try saying - clear console',
        'Try saying - divide 50 by 5',
        'Try saying - subtract 10 from 20',
    ]

    const commands = [
        {
            command: 'clear console',
            callback: () => {
                clearStates();
                setOutput('Console cleared...')
            }
        },
        {
            command: 'open *',
            callback: (site) => {
                window.open(`https://${site}`)
            }
        },
        {
            command: 'search *',
            callback: (params) => {
                setSearch(params)
            }
        },
        {
            command: ['sum of * and *', 'add * and *'],
            callback: (num1, num2) => {
                setOutput(parseInt(num1) + parseInt(num2))
            }
        },
        {
            command: 'multiply * and *',
            callback: (num1, num2) => {
                setOutput(parseInt(num1) * parseInt(num2))
            }
        },
        {
            command: 'divide * by *',
            callback: (num1, num2) => {
                setOutput(parseInt(num1) / parseInt(num2))
            }
        },
        {
            command: 'copy text',
            callback: () => {
                copyText();
                setOutput('Text copied to clipboard...')
            }
        },
        {
            command: 'stop recording',
            callback: () => {
                stopListening()
                setOutput('Please turn on microphone...')
            }
        }
    ]

    const {
        listening,
        transcript,
        resetTranscript,
        isMicrophoneAvailable,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });

    const stopListening = () => SpeechRecognition.stopListening();

    const copyText = () => navigator.clipboard.writeText(transcript)

    const clearStates = ()=> {
        setOutput('')
        setSearch(null)
        resetTranscript();
    }

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            console.log("Browser doesn't support speech recognition.");
        } else if (!isMicrophoneAvailable) {
            console.log("Please allow microphone.");
        }
    }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

    useEffect(() => {
        let i = 1;
        const id = setInterval(() => {
            // setOutput(tipsArr[Math.floor(Math.random() * 4)])
            setTip(tipsArr[i % 5])
            i++
        }, 7000);
        setIntervalID(id);
        return () => clearInterval(intervalID)
    }, [])

    return (
        <section className="main-container">
            <h4>Speech To Text Recognization</h4>
            <div className="container">
                <div className="view-state">
                    <div className="control-buttons">

                        <div className="input-group">
                            <input type="radio" name="mic" id="micOn" checked={listening} onChange={changeListening} />
                            <label htmlFor='micOn'><img src={micOn} alt="mic-on" width={20}/></label>
                        </div>
                        
                        <div className="input-group">
                            <input type="radio" name="mic" id="micOff" checked={!listening} onChange={changeListening} />
                            <label htmlFor='micOff'><img src={micOff} alt="mic-on" width={20}/></label>
                        </div>
                                                
                        <button onClick={copyText}><img src={copy} alt="copy" /></button>
                        <button onClick={clearStates}><img src={reset} alt="clear" /></button>
                    </div>
                    <div className="tips-section">
                        <img src={tips} alt="tips" style={{ marginLeft: 'auto' }} />
                        <p className='fadeInOut' style={{ marginRight: 'auto' }} key={tip}>{tip}</p>
                    </div>
                    <div className="image-group">
                        {listening && <img className='pulse' src={wave} alt="wave" />}
                        {listening && <img className='pulse' src={wave} alt="wave" />}
                    </div>
                </div>

                <div className="speech-body">
                    {transcript}
                </div>

                <div className="output-section">
                    <p>Output: </p>
                    <p>{output}</p>
                </div>

                {search &&
                    <div className="table-section">
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Product Code</th>
                                <th>Product Name</th>
                                <th>Generic Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Product Code</td>
                                <td>Product Name</td>
                                <td>Generic Name</td>
                            </tr>
                            <tr>
                                <td>Product Code</td>
                                <td>Product Name</td>
                                <td>Generic Name</td>
                            </tr>
                            <tr>
                                <td>Product Code</td>
                                <td>Product Name</td>
                                <td>Generic Name</td>
                            </tr>
                            <tr>
                                <td>Product Code</td>
                                <td>Product Name</td>
                                <td>Generic Name</td>
                            </tr>
                            <tr>
                                <td>Product Code</td>
                                <td>Product Name</td>
                                <td>Generic Name</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                }

            </div>
        </section>
    )
}

export default VoiceToText
