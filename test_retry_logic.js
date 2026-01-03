
const MAX_RETRIES = 3;
const BASE_DELAY = 100; // Speed up for test

async function retryWithBackoff(operation, operationName) {
    let attempt = 0;
    let lastError;

    while (attempt <= MAX_RETRIES) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            attempt++;

            console.log(`[Test Log] Attempt ${attempt} failed.`);

            // Check for 429 or 503 errors
            const isRateLimit = error.status === 429 ||
                (error.message && error.message.includes('429')) ||
                (error.message && error.message.toLowerCase().includes('quota')) ||
                (error.message && error.message.toLowerCase().includes('resource exhausted'));

            if (isRateLimit && attempt <= MAX_RETRIES) {
                const delay = BASE_DELAY * Math.pow(2, attempt - 1);
                console.log(`[Test Log] Rate limited. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            // If not a retryable error or max retries reached, break loop
            break;
        }
    }

    // Parse error message before throwing to UI
    let friendlyMessage = "An unexpected error occurred.";
    const rawMessage = lastError?.message || JSON.stringify(lastError);

    if (rawMessage.includes('429') || rawMessage.toLowerCase().includes('quota') || rawMessage.toLowerCase().includes('resource exhausted')) {
        friendlyMessage = "Usage limit exceeded. Please wait a minute and try again.";
    } else if (rawMessage.includes('503') || rawMessage.includes('Overloaded')) {
        friendlyMessage = "Service overloaded. Please try again shortly.";
    } else {
        try {
            const jsonMatch = rawMessage.match(/\{.*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.error && parsed.error.message) {
                    friendlyMessage = parsed.error.message;
                } else if (parsed.message) {
                    friendlyMessage = parsed.message;
                }
            } else {
                friendlyMessage = rawMessage;
            }
        } catch (e) {
            friendlyMessage = rawMessage;
        }
    }

    throw new Error(friendlyMessage);
}

// Mocks
function mockApiCallThatSucceedsAfter2Retries() {
    let calls = 0;
    return async () => {
        calls++;
        if (calls < 3) {
            throw { status: 429, message: "Resource Exhausted: Quota exceeded" };
        }
        return "Success!";
    };
}

function mockApiCallThatFailsForever() {
    return async () => {
        throw { status: 429, message: '{"error": {"code": 429, "message": "You exceeded your current quota..."}}' };
    };
}

async function runTests() {
    console.log("--- Test 1: Success after retries ---");
    try {
        const operation = mockApiCallThatSucceedsAfter2Retries();
        const result = await retryWithBackoff(operation, "Test1");
        console.log("Result:", result);
        if (result === "Success!") console.log("PASSED");
    } catch (e) {
        console.error("FAILED:", e);
    }

    console.log("\n--- Test 2: Fails cleanly with friendly message ---");
    try {
        const operation = mockApiCallThatFailsForever();
        await retryWithBackoff(operation, "Test2");
    } catch (e) {
        console.log("Caught Error:", e.message);
        // The parser logic puts "Usage limit exceeded..." if it detects "quota"
        // Let's check what exactly it produces for the JSON input
        if (e.message.includes("Usage limit exceeded") || e.message.includes("You exceeded your current quota")) {
            console.log("PASSED (Friendly message correct)");
        } else {
            console.log("FAILED (Message content check)");
        }
    }
}

runTests();
