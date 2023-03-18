export default function Home() {
	const s = process.env.SECRET_KEY;

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		// console.log(e.target.elements.first_name.value);

		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clue: "Merry air",
					numLetters: 4,
					letters: ["", "", "", ""],
				}),
			});

			const data = await response.json();
			if (response.status !== 200) {
				throw (
					data.error ||
					new Error(`Request failed with status ${response.status}`)
				);
			}

			console.log(data.result);
		} catch (error) {
			console.error(error);
		}
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
