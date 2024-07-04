/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";


const DataContext = createContext();


const DataProvider = (props) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const parseData = async (data) => {
        const chatSession = model.startChat({
            history: chatHistory,
            generationConfig: {
                temperature: 2,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 200,
                responseMimeType: "application/json",
            },
        });

        const prompt = `parse this text and give me the following details [patient_name, symptoms_duration, symptoms in array format, possible_diseases in array format, medicines in array format, tests in array format], all in JSON string format. the text is - ${data}`;

        const result = await chatSession.sendMessage(prompt);
        const text = result.response.text();
        console.log(text);
        return JSON.parse(text);
    }

    return (
        <DataContext.Provider value={{ parseData }}>
            {props.children}
        </DataContext.Provider>
    )
}

const useDataContext = () => {
    return useContext(DataContext);
}

const chatHistory = [
    {
        role: "user",
        parts: [
            {
                text: `parse this text and give me the following details [patient_name, symptoms_duration, symptoms in array format, possible_dieseases in array format, medicines in array format, tests in array format], all in JSON string format. the text is - 
                Doctor: Good morning, Mr. Johnson. How are you feeling today?
                Patient: Not great, doctor. I've been experiencing persistent headaches and fatigue for the past couple of weeks.
                Doctor: I'm sorry to hear that. Let’s start by understanding your symptoms better. Besides headaches and fatigue, have you noticed any other issues, like dizziness, nausea, or visual disturbances?
                Patient: I sometimes feel dizzy, and my vision gets a bit blurry occasionally.
                Doctor: Thank you for sharing that. Based on your symptoms, I’d like to start with some basic tests to rule out common causes. I'll order a complete blood count (CBC) to check for anemia or infection, and a comprehensive metabolic panel (CMP) to evaluate your liver and kidney function, as well as your electrolytes. We should also check your thyroid function with a TSH test.
                Patient: That sounds thorough. What about the headaches?
                Doctor: For the headaches, I'll prescribe you a mild pain reliever like ibuprofen. Take it with food to avoid any stomach upset. Additionally, I recommend you keep a headache diary, noting the frequency, duration, and intensity of your headaches, as well as any potential triggers like stress, certain foods, or lack of sleep.
                Patient: Okay, I can do that.
                Doctor: Great. If your symptoms persist or worsen, we might consider further imaging studies, such as an MRI of your brain. But let’s start with these initial tests and the diary, and we’ll follow up in a week to review your results and see how you’re feeling.
                Patient: Thank you, doctor. I appreciate your help.
                Doctor: You’re welcome. Take care, and we’ll see you soon.`
            },
        ],
    },
    {
        role: "model",
        parts: [
            {
                text: `
                {
                    "patient_name": "Mr. Johnson",
                    "symptoms_duration": "couple of weeks",
                    "symptoms": [
                        "headaches",
                        "fatigue",
                        "dizziness",
                        "blurred vision"
                    ],
                    "possible_diseases": [
                        "anemia",
                        "infection",
                        "liver problems",
                        "kidney problems",
                        "thyroid problems"
                    ],
                    "medicines": [
                        "ibuprofen"
                    ],
                    "tests": [
                        "complete blood count (CBC)",
                        "comprehensive metabolic panel (CMP)",
                        "TSH test",
                        "MRI of the brain" 
                    ]
                }`
            },
        ],
    },
    {
        role: "user",
        parts: [
            {
                text: `parse this text and give me the following details [patient_name, symptoms_duration, symptoms in array format, possible_dieseases in array format, medicines in array format, tests in array format], all in JSON string format. the text is - 
                Doctor: Good afternoon, Mrs. Smith. How can I help you today?
                Patient: Hello, Doctor. I've been having a lot of trouble with my stomach lately—bloating, cramps, and frequent diarrhea. It's been going on for a few weeks now.
                Doctor: I'm sorry to hear that. Have you noticed if certain foods make it worse, or if there are any other symptoms like fever, weight loss, or blood in your stool?
                Patient: I haven't noticed a particular pattern with foods, but I have lost a few pounds, and there was blood in my stool once.
                Doctor: Thank you for letting me know. Given your symptoms, I'd like to run some tests to get a clearer picture. We'll start with a stool sample to check for infections or inflammation. I'll also order a complete blood count (CBC) to look for signs of infection or anemia and a comprehensive metabolic panel (CMP) to check your overall health and organ function.
                Patient: Okay, that makes sense. What should I do in the meantime?
                Doctor: For now, I recommend you follow a bland diet—avoid spicy foods, dairy, and high-fiber foods, which can aggravate your symptoms. I'll also prescribe an antispasmodic medication, such as dicyclomine, to help with the cramping. If you experience severe pain or notice more blood in your stool, please contact me immediately.
                Patient: I will. How soon will we get the test results?
                Doctor: We should have the results in a few days. Once we have them, we can determine the best course of action. We might need to do further testing, such as a colonoscopy, depending on the initial results.
                Patient: Thank you, Doctor. I appreciate your help.
                Doctor: You're welcome, Mrs. Smith. Take care, and we'll follow up once we have your test results.`
            },
        ],
    },
    {
        role: "model",
        parts: [
            {
                text: `
                {
                    "patient_name": "Mrs. Smith",
                    "symptoms_duration": "few weeks",
                    "symptoms": [
                        "bloating",
                        "cramps",
                        "frequent diarrhea",
                        "weight loss",
                        "blood in stool"
                    ],
                    "possible_diseases": [
                        "infection",
                        "inflammation",
                        "anemia",
                        "intestinal problems"
                    ],
                    "medicines": [
                        "dicyclomine" 
                    ],
                    "tests": [
                        "stool sample",
                        "complete blood count (CBC)",
                        "comprehensive metabolic panel (CMP)",
                        "colonoscopy" 
                    ]
                }`
            },
        ],
    },
];

export { DataProvider, useDataContext }
