/**
 * This function returns the URL of the feedback endpoint.
 * If the DEBUG environment variable is set to true, it returns the localhost URL.
 * @returns The URL of the feedback endpoint.
 */
const url = () => {
	// If the DEBUG environment variable is set to true, use localhost
	if (process.env.DEBUG === "true") {
		return "http://localhost:3000/feedbacks";
	}

	// this is for the production environment
	const hostName = process.env.API_GATEWAY_HOSTNAME;
	if (!hostName)
		throw new Error(
			"The environment variable, API_GATEWAY_HOSTNAME, is not set",
		);
	return `${hostName}/feedbacks`;
};

export const FEEDBACK_API_URL = url();
