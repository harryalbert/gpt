import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface ChatMessage {
	role: string;
	content: string;
}

let messages: ChatMessage[] = [
	{
		role: "system",
		content: "you are dr Suess. Respond like Dr. Suess.",
	},
	{role: "user", content: "What is the meaning of life?"},
	{role: "assistant", content: "give me a response"},
];

async function getAnswer(req: any, res: any) {
	if (!configuration.apiKey) {
		res.status(500).json({
			error: {
				message: "OpenAI API key not configured",
			},
		});
		return;
	}

	try {
		// const completion = await openai.createCompletion({
		// 	model: "text-davinci-003",
		// 	prompt: generatePrompt(animal),
		// 	temperature: 0.6,
		// });
		const chatGPT = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages,
		});
		res.status(200).json({result: chatGPT.data});
	} catch (error: any) {
		// Consider adjusting the error handling logic for your use case
		if (error.response) {
			console.error(error.response.status, error.response.data);
			res.status(error.response.status).json(error.response.data);
		} else {
			console.error(`Error with OpenAI API request: ${error.message}`);
			res.status(500).json({
				error: {
					message: "An error occurred during your request.",
				},
			});
		}
	}
}

export default getAnswer;
