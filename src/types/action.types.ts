export interface Tool {
    name: string;
    description: string;
    input_schema: InputSchema;
    execute: (params: unknown) => Promise<unknown>;
  }
  
 export interface InputSchema {
    type: 'object';
    properties?: Properties;
    required?: Array<string>
 }

 export interface Properties {
    [key: string]: Propertie;
 }

 export interface Propertie {
    type: 'string' | 'number' | 'bool';
    description?: string
 }
