export interface BotEvent<Context> {
    name: string;
    once?: boolean;
    execute(context: Context, ...args: any[]): Promise<void> | void;
}
