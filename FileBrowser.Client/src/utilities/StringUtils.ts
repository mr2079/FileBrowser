export function formatString(template: string, ...args: Array<string | number | boolean>) : string {
    return template.replace(/\{(\d+)\}/g, (match, index) => {
        const parsedIndex = parseInt(index, 10);
        return parsedIndex < args.length ? String(args[parsedIndex]) : match;
    })
}