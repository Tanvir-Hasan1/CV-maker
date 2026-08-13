import { ParsedDocument, ParseResult, ResumeParser } from '../../types/extraction';

/**
 * AIResumeParser Stub (V2 Ready)
 * Ready to connect to Gemini API, OpenAI, or OpenRouter in V2.
 * The application architecture seamlessly swaps this implementation via the ResumeParser interface.
 */
export class AIResumeParser implements ResumeParser {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async parse(doc: ParsedDocument): Promise<ParseResult> {
    if (!this.apiKey) {
      throw new Error(
        'V2 AI Resume Extraction requires an active API key or backend proxy endpoint. Falling back to local rule-based parsing.'
      );
    }
    // Future V2 implementation: API call to Gemini/OpenAI with JSON schema response
    throw new Error('AI parser method not implemented in V1 offline mode.');
  }
}
