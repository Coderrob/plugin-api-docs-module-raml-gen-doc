export type HookResponse<T> = {
  data: T;
  isLoading: boolean;
  error?: Error;
};

export interface ParserConfig {
  version: "0.8" | "1.0";
  outputFormat: "oas20";
}
