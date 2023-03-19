import Loading from "@/components/LoadingIcon";
import {useState} from "react";

export default function Home() {
	const s = process.env.SECRET_KEY;
	const [loading, setLoading] = useState(false);
	const [answer, setAnswer] = useState("");

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		let letters = [];
		for (let i = 0; i < e.target.elements.num_letters.value; i++) {
			letters.push("");
		}
		try {
			setLoading(true);

			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clue: e.target.elements.clue.value,
					numLetters: e.target.elements.num_letters.value,
					letters,
				}),
			});

			const data = await response.json();
			if (response.status !== 200) {
				throw (
					data.error ||
					new Error(`Request failed with status ${response.status}`)
				);
			}

			setLoading(false);
			setAnswer(data?.result?.choices[0]?.message?.content?.trim());
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6 mb-g6 md:grid-cols-2">
					<div>
						<label className="block mb-1 mt-3 text-med font-medium text-gray-900 dark:text-white">
							Crossword Clue
						</label>
						<input
							type="text"
							id="clue"
							className="text-input"
							required
						></input>
						<label className="block mb-1 mt-3 text-med font-medium text-gray-900 dark:text-white">
							Number of Letters
						</label>
						<input
							type="number"
							id="num_letters"
							className="text-input"
							required
						></input>
						<input
							type="submit"
							className="text-lg text-white font-thin bg-blue-900 mt-3 p-0.5 px-1 rounded"
						/>
					</div>
				</div>

				<div className="p-1 pt-3">
					{loading ? Loading() : answer && <p>{answer}</p>}
				</div>
			</form>
		</>
	);
}
