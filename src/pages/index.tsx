import Loading from "@/components/LoadingIcon";
import {useState} from "react";

export default function Home() {
	const s = process.env.SECRET_KEY;
	const [loading, setLoading] = useState(false);
	const [answer, setAnswer] = useState("");
	const [numLetters, setNumLetters] = useState<number | null>(0);
	const [letters, setLetters] = useState([]);

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
						<label className="text-input-title">
							Crossword Clue
						</label>
						<input
							type="text"
							id="clue"
							className="text-input"
							required
						></input>
						<label className="text-input-title">
							Number of Letters
						</label>
						<input
							type="number"
							id="num_letters"
							className="text-input"
							max="20"
							value={numLetters ?? ""}
							onChange={(e) => {
								if (!e.target.value) {
									setNumLetters(null);
									return;
								}

								let val = parseInt(e.target.value);
								if (val < 20) {
									setNumLetters(val);
								}
							}}
							required
						></input>
						<div>
							{(numLetters ?? 0) > 0 &&
								[...Array(numLetters)].map((_, i) => (
									<a key={i}>test</a>
								))}
						</div>
						<input
							type="submit"
							className="text-lg text-black font-thin bg-blue-200 mt-3 p-0.5 px-1 rounded"
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
