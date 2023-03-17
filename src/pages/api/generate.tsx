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
		content: "you will be asked about crossword clues.",
	},
	{
		role: "user",
		content:
			'give me an answer to this crossword question. the clue is "commoner", it starts with p',
	},
	{role: "assistant", content: "give me the answer"},
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
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages,
		});
		// const completion = await openai.createCompletion({
		// 	model: "text-davinci-003",
		// 	prompt: 'give me an answer to this crossword question. the clue is "commoner", it is 4 letters',
		// 	temperature: 0.6,
		// });
		res.status(200).json({result: completion.data});
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
