import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
	if (req.body.type != "Hint" && req.body.type != "Answer") {
		res.status(400).json({
			error: {
				message: "Bad clue type",
			},
		});
		return;
	}

	let prompt;
	if (req.body.type == "Hint") {
		prompt =
			"I want you to give me a hint for the following crossword clue. Please do not give me the answer. I just want a clue which will lead me in the right direction. Also, more concise is better. Thank you so much!";
	} else {
		prompt =
			"I want you to give me the answer for the following crossword clue. A small explanation would be nice, but please be as concise as possible. Thank you so much!";
	}
	prompt += `The clue is ${req.body.clue}, and it has ${req.body.numLetters} letters`;
	for (let i = 0; i < req.body.letters.length; i++) {
		if (req.body.letters[i] !== "") {
			prompt += `The ${i + 1} letter is ${req.body.letters[i]}`;
		}
	}

	let messages: ChatCompletionRequestMessage[] = [
		{
			role: "user",
			content: prompt,
		},
	];

	try {
		const completion = await openai.createChatCompletion({
			model: "gpt-4",
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
