import { useState, useEffect, useMemo, useRef } from "react";
import { RamlParser } from "../utils/raml.parser";
import { HookResponse, ParserConfig } from "../types";

/**
 * Parses a RAML api definition to OpenApi 2.0 specification
 * @param definition - The RAML definition string to be parsed.
 * @returns A HookResponse containing the parsed OpenAPI definition, loading state, and any error.
 */
export function useRamlToOpenApi(definition: string): HookResponse<string> {
  const parserRef = useRef(new RamlParser());

  const config: ParserConfig = useMemo(
    () => ({
      version: definition.startsWith("#%RAML 0.8") ? "0.8" : "1.0",
      outputFormat: "oas20",
    }),
    [definition]
  );

  const [state, setState] = useState<{
    data: string;
    isLoading: boolean;
    error?: Error;
  }>({
    data: "",
    isLoading: true,
  });

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const openApiDef = await parserRef.current.parse(definition, config);
        if (!abortController.signal.aborted) {
          setState({ data: openApiDef, isLoading: false });
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setState({ data: "", isLoading: false, error: error as Error });
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [definition, config]);

  return state;
}
