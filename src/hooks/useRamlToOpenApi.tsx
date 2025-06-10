import { useState, useEffect } from 'react';
import { WebApiParser as parser } from 'webapi-parser';
import { HookResponse } from '../types';

/**
 * Custom hook to parse a RAML API definition into OpenApi 2.0 specification.
 *
 * @param definition - The RAML API definition as a string.
 * @returns An object containing the parsed OpenApi definition, loading state, and any errors.
 */
export function useRamlToOpenApi(definition: string): HookResponse<string> {
  const initialState: HookResponse<string> = {
    data: '',
    isLoading: true,
  };

  const [state, setState] = useState<typeof initialState>(initialState);

  useEffect(() => {
    let isCancelled = false;

    const parseDefinition = async () => {
      try {
        const ramlParser = definition.startsWith('#%RAML 0.8') ? parser.raml08 : parser.raml10;
        const openApiDef = await ramlParser.parse(definition).then(parser.oas20.generateString);

        if (!isCancelled) {
          setState({ data: openApiDef, isLoading: false });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({ data: '', isLoading: false, error: error as Error });
        }
      }
    };
    parseDefinition();

    return () => {
      isCancelled = true;
    };
  }, [definition]);

  return state;
}
