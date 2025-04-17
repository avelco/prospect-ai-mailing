import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useLogin } from "../../../hooks/useLoginMutation";
import { useSessionStore } from '../../../stores/authStore';

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { mutate } = useLogin();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setErrorMessage(null);
		mutate(
			{ username: email, password },
			{
				onSuccess: (data) => {
					useSessionStore.setState({ accessToken: data.access_token, user: data.user });
					navigate("/home");
				},
				onError: (err: any) => {
					setSubmitting(false);
					// Try to extract a user-friendly error message
					let message = "Login failed. Please check your credentials.";
					if (err?.response?.data?.detail) {
						if (Array.isArray(err.response.data.detail)) {
							message = err.response.data.detail.map((d: any) => d.msg).join(", ");
						} else if (typeof err.response.data.detail === "string") {
							message = err.response.data.detail;
						}
					}
					setErrorMessage(message);
				},
			}
		);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<div className="flex items-center justify-center mb-6 gap-2">
					<FaRobot className="text-blue-600 text-3xl" />
					<span className="font-bold text-2xl text-gray-800">ProspectAI</span>
				</div>
				{errorMessage && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
						{errorMessage}
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="email"
							className="block text-gray-700 font-medium mb-1"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							required
							className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="username"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-gray-700 font-medium mb-1"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
						/>
					</div>
					<button
						type="submit"
						disabled={submitting}
						className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
					>
						{submitting ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
