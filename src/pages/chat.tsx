import {Configuration, OpenAIApi} from "openai";

const DEFAULT_PARAMS = {
	model: "text-davinci-002",
	temperature: 0.7,
	max_tokens: 256,
	top_p: 1,
	frequency_penalty: 0,
	presence_penalty: 0,
};

export async function query(params = {}) {
	const {Configuration, OpenAIApi} = require("openai");
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);
	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: "Say this is a test",
		temperature: 0,
		max_tokens: 7,
	});

	return response;
}

export default function Home() {
	const s = process.env.SECRET_KEY;

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		// console.log(e.target.elements.first_name.value);

		const q = await query();
		console.log(q);
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6 mb-g6 md:grid-cols-2">
					<div>
						<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Crossword Clue
						</label>
						<input
							type="text"
							id="first_name"
							className="text-input"
							placeholder="Clue..."
						></input>
					</div>
				</div>
			</form>
		</>
	);
}
