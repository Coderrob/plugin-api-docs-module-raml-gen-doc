export type HookResponse<T> = {
  data: T;
  isLoading: boolean;
  error?: Error;
};
