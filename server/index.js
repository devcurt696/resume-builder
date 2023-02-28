const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const multer = require("multer");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const { text } = require("express");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const generateID = () => Math.random().toString(36).substring(2,10);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fieldSize: 1024 * 1024 * 5}
});

const configuration = new Configuration({
    apiKey: ,
});

const openai = new OpenAIApi(configuration);

const GPTFFunction = async (text) => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.6,
        max_tokens: 250,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
    });

    return response.data.choices[0].text;
};

app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
    const {
        fullName,
        currentPosition,
        currentLength,
        currentTechnologies,
        workHistory,
    } = req.body;

    const workArray = JSON.parse(workHistory);

    let database = [];

    const newEntry = {
        id: generateID(),
        fullName,
        image_url: `http://localhost:4000/uploads/${req.file.filename}`,
        currentPosition,
        currentLength,
        currentTechnologies,
        workHistory: workArray,
    };

    const remainderText = () => {
        let stringText = "";
        for (let i = 0; i < workArray.length; i++ ) {
            stringText += `${workArray[i].name} as a ${workArray[i].position}`;
        }
        return stringText;
    };

    const prompt1 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the tech: ${currentTechnologies}. \nCan you write a 100 word description for the top of the resume(first person writing)?`;
    const prompt2 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the tech: ${currentTechnologies}. \nCan you write 10 points about what I am good at?`;
    const prompt3 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the tech: ${currentTechnologies}. \nDuring my years I worked at ${workArray.length} companies. ${remainderText()} \n Can you write me 50 words for each company separated in numbers of my succession in the company (in first person)`;

    const objective = await GPTFFunction(prompt1);
    const keypoints = await GPTFFunction(prompt2);
    const jobResponsibilities = await GPTFFunction(prompt3);

    const chatGptData = { objective, keypoints, jobResponsibilities };

    console.log(chatGptData);

    const data = { ...newEntry, ...chatGptData };
    database.push(data);

    res.json({
		message: "Request successful!",
		data,
	});
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}.`);
});
