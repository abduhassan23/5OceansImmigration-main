import OpenAI from 'openai';

export const dynamic = 'force-dynamic'; // Ensures dynamic server rendering

function getOpenAIInstance() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing OpenAI API Key");
    }
    return new OpenAI({ apiKey });
}

const openai = getOpenAIInstance();

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 50, // Adjust as needed
            temperature: 0,
        });

        return new Response(
            JSON.stringify({ text: completion.choices[0].message.content }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error("Error in OpenAI API request:", error);

        let status = 500;
        let message = 'Something went wrong';

        if (error.code === 'insufficient_quota') {
            status = 429;
            message = 'Quota exceeded. Please check your OpenAI billing details.';
        }

        return new Response(
            JSON.stringify({ error: message }),
            {
                status: status,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
