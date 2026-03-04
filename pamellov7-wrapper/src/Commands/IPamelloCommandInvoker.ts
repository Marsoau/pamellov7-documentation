export interface IPamelloCommandInvoker {
    executeCommandPathAsync(commandPath: string): Promise<string>;
    executeCommandPathAsyncT<TType>(commandPath: string): Promise<TType>;
}
