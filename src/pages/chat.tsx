import Head from "next/head";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from "@/styles/Home.module.css";
import {SyntheticEvent} from "react";

const inter = Inter({subsets: ["latin"]});

export default function Home() {
	const s = process.env.SECRET_KEY;
	const handleSubmit = (e: any) => {
		e.preventDefault();
		console.log(e.target.elements.first_name.value);
		console.log(s);
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
