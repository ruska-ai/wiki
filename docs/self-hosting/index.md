---
title: Self-Hosting Guide
sidebar_position: 3
---

# Self-Hosting Orchestra

This guide covers environment configuration for self-hosting Orchestra with various AI providers.

## Prerequisites

- Docker and Docker Compose
- PostgreSQL database
- (Optional) S3-compatible storage (MinIO)

## Environment Configuration

Orchestra uses environment variables to configure AI providers. Copy the example environment file and configure your providers:

```bash
cp backend/.example.env ~/.env/orchestra/.env.backend
```

### AI Provider Configuration

Orchestra supports multiple AI providers. Enable providers by setting their respective environment variables.

#### OpenAI

```bash
OPENAI_API_KEY=sk-your-openai-api-key
```

#### Anthropic (Claude)

```bash
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
```

#### Google (Gemini)

```bash
GOOGLE_API_KEY=your-google-api-key
```

#### xAI (Grok)

```bash
XAI_API_KEY=your-xai-api-key
```

#### Groq

```bash
GROQ_API_KEY=your-groq-api-key
```

#### AWS Bedrock

AWS Bedrock requires AWS credentials and a region configuration. Bedrock models are enabled when `AWS_BEDROCK_REGION` is set.

```bash
# Enable Bedrock by setting the region
AWS_BEDROCK_REGION=us-east-1

# AWS credentials (choose one method)
# Method 1: Environment variables
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Method 2: AWS credentials file (~/.aws/credentials)
# Method 3: IAM roles (for EC2/ECS/Lambda deployments)
```

**Available Bedrock Models:**

| Model | ID |
|-------|-----|
| Claude 4.5 Sonnet | `bedrock_converse:anthropic.claude-sonnet-4-5-20250929-v1:0` |
| Claude 4.5 Haiku | `bedrock_converse:anthropic.claude-haiku-4-5-20251001-v1:0` |
| Claude 4.5 Opus | `bedrock_converse:anthropic.claude-opus-4-5-20251101-v1:0` |
| Kimi K2 Thinking | `bedrock_converse:moonshot.kimi-k2-thinking` |
| Claude 3.5 Sonnet | `bedrock_converse:anthropic.claude-3-5-sonnet-20241022-v2:0` |
| Claude 3.5 Haiku | `bedrock_converse:anthropic.claude-3-5-haiku-20241022-v1:0` |
| Titan Text Premier | `bedrock_converse:amazon.titan-text-premier-v1:0` |
| Llama 3.2 90B | `bedrock_converse:meta.llama3-2-90b-instruct-v1:0` |
| Mistral Large | `bedrock_converse:mistral.mistral-large-2407-v1:0` |

**IAM Policy Requirements:**

Your AWS credentials need permissions for Bedrock model invocation:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/*"
    }
  ]
}
```

#### Ollama (Local Models)

For local model inference using Ollama:

```bash
OLLAMA_BASE_URL=http://localhost:11434
```

### Database Configuration

```bash
POSTGRES_CONNECTION_STRING=postgresql://admin:password@localhost:5432/orchestra
```

### Storage Configuration (Optional)

For file uploads and RAG capabilities:

```bash
MINIO_HOST=localhost:9000
S3_REGION=us-east-2
ACCESS_KEY_ID=minio-access-key
ACCESS_SECRET_KEY=minio-secret-key
BUCKET=orchestra
```

## Running Orchestra

### Development Mode

```bash
cd backend
make dev
```

### Production with Docker

```bash
docker compose up -d
```

## Verifying Configuration

After starting Orchestra, verify your configured providers appear in the model selector:

1. Navigate to your Orchestra instance
2. Click the model dropdown at the top of the chat interface
3. Verify models from your configured providers appear in the list

For AWS Bedrock specifically, you should see models prefixed with `bedrock_converse:` in the dropdown.

## Troubleshooting

### AWS Bedrock Models Not Appearing

1. Verify `AWS_BEDROCK_REGION` is set
2. Check AWS credentials are configured (env vars, credentials file, or IAM role)
3. Ensure your AWS account has Bedrock model access enabled in the AWS Console
4. Verify the IAM policy includes `bedrock:InvokeModel` permissions

### Model Invocation Errors

- **AccessDeniedException**: Check IAM permissions
- **ResourceNotFoundException**: The model may not be available in your region
- **ThrottlingException**: You've hit API rate limits; implement backoff or request limit increase

## Next Steps

- [Configure Tools & Integrations](../tools/tools.md)
- [Set up MCP Servers](../tools/mcp.md)
- [Enable A2A Protocol](../tools/a2a.md)
