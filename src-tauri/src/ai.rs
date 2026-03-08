use serde::{Deserialize, Serialize};
use serde_json::json;
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AiRequest {
    pub messages: Vec<ChatMessage>,
    pub model: String,
    pub max_tokens: u32,
    pub stream: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AiResponse {
    pub choices: Vec<Choice>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Choice {
    pub message: ChatMessage,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GlmResponse {
    pub choices: Vec<GlmChoice>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GlmChoice {
    pub message: GlmMessage,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GlmMessage {
    pub content: String,
}

pub async fn call_ai_api(
    endpoint: &str,
    api_key: &str,
    model: &str,
    messages: Vec<ChatMessage>,
    max_tokens: u32,
) -> Result<String, String> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(60))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

    let request_body = json!({
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "stream": false
    });

    let response = client
        .post(endpoint)
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("API request failed: {}", e))?;

    let status = response.status();
    let response_text = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    if !status.is_success() {
        return Err(format!("API error ({}): {}", status, response_text));
    }

    // Try to parse as GLM response
    if let Ok(glm_resp) = serde_json::from_str::<GlmResponse>(&response_text) {
        if let Some(choice) = glm_resp.choices.first() {
            return Ok(choice.message.content.clone());
        }
    }

    // Try to parse as OpenAI-compatible response
    if let Ok(ai_resp) = serde_json::from_str::<AiResponse>(&response_text) {
        if let Some(choice) = ai_resp.choices.first() {
            return Ok(choice.message.content.clone());
        }
    }

    Err(format!("Failed to parse API response: {}", response_text))
}

pub async fn ai_chat(
    message: &str,
    context: &str,
    config: &crate::config::AiConfig,
) -> Result<String, String> {
    let mut messages = vec![ChatMessage {
        role: "system".to_string(),
        content: "You are a helpful AI assistant for a Markdown editor. Help users with writing, editing, and improving their content.".to_string(),
    }];

    // Add context if provided
    if !context.is_empty() {
        messages.push(ChatMessage {
            role: "user".to_string(),
            content: format!("Context from the document:\n{}\n\nNow, please respond to my request.", context),
        });
    }

    messages.push(ChatMessage {
        role: "user".to_string(),
        content: message.to_string(),
    });

    call_ai_api(
        &config.api_endpoint,
        &config.api_key,
        &config.model,
        messages,
        config.max_tokens,
    )
    .await
}

pub async fn ai_suggest(
    text: &str,
    action: &str,
    config: &crate::config::AiConfig,
) -> Result<String, String> {
    let system_prompt = match action {
        "polish" => "You are a writing assistant. Polish and improve the given text while maintaining its original meaning. Make it more professional, clear, and concise.",
        "expand" => "You are a writing assistant. Expand on the given text with more details, examples, or explanations while maintaining the original tone.",
        "summarize" => "You are a writing assistant. Provide a concise summary of the given text.",
        "tone" => "You are a writing assistant. Adjust the tone of the given text to be more professional and formal.",
        _ => "You are a helpful writing assistant.",
    };

    let messages = vec![
        ChatMessage {
            role: "system".to_string(),
            content: system_prompt.to_string(),
        },
        ChatMessage {
            role: "user".to_string(),
            content: text.to_string(),
        },
    ];

    call_ai_api(
        &config.api_endpoint,
        &config.api_key,
        &config.model,
        messages,
        config.max_tokens,
    )
    .await
}
