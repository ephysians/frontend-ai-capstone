declare module '*.css';

declare module 'resend' {
  export class Resend {
    constructor(apiKey?: string);
    emails: {
      send(payload: {
        from: string;
        to: string | string[];
        subject: string;
        text?: string;
        html?: string;
        reply_to?: string;
        replyTo?: string;
      }): Promise<{ data: { id: string } | null; error: Error | null }>;
    };
  }
}

declare module '@vercel/analytics/next' {
  export function Analytics(): JSX.Element;
}
