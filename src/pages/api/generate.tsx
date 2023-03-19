import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function generateQuestion(clue: string, numLetters: number, letters: string[]) {
	let question = `answer to crossword clue "${clue}", must be exactly ${numLetters} letters.`;
	for (let i = 0; i < letters.length; i++) {
		if (letters[i] !== "") {
			question += ` Letter ${i + 1} is ${letters[i]}.`;
		}
	}
	return question;
}

async function getAnswer(req: any, res: any) {
	if (!configuration.apiKey) {
		res.status(500).json({
			error: {
				message: "OpenAI API key not configured",
			},
		});
		return;
	}

	if (!req.body.clue || !req.body.numLetters || !req.body.letters) {
		res.status(400).json({
			error: {
				message: "Missing required parameters",
			},
		});
		return;
	}

	let messages: ChatCompletionRequestMessage[] = [
		{
			role: "user",
			content: generateQuestion(
				req.body.clue,
				req.body.numLetters,
				req.body.letters
			),
		},
	];

	try {
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages,
		});
		res.status(200).json({result: completion.data});
	} catch (error: any) {
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
