export default function normalizeQuillHtml(html: unknown) {
    if (typeof html !== "string") {
        return html;
    }

    const quillSpace = "\uE000";
    const container = document.createElement("div");
    container.innerHTML = html.replace(/(<[^>]*>|[^<]+)/g, segment =>
        segment.startsWith("<") ? segment : segment.replace(/&nbsp;/gi, quillSpace)
    );

    let currentWord = "";
    const blockElements = new Set([
        "BLOCKQUOTE", "DIV", "H1", "H2", "H3", "H4", "H5", "H6",
        "LI", "OL", "P", "PRE", "UL",
    ]);

    const normalizeNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            let normalizedText = "";
            for (const character of node.textContent ?? "") {
                if (character === quillSpace || character === " ") {
                    normalizedText += /^[aiouwz]$/i.test(currentWord) ? "\u00A0" : " ";
                    currentWord = "";
                } else {
                    normalizedText += character;
                    currentWord = /^\p{L}$/u.test(character)
                        ? currentWord + character.toLowerCase()
                        : "";
                }
            }
            node.textContent = normalizedText;
            return;
        }

        for (const child of node.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE && blockElements.has(child.nodeName)) {
                currentWord = "";
                normalizeNode(child);
                currentWord = "";
            } else if (child.nodeName === "BR") {
                currentWord = "";
            } else {
                normalizeNode(child);
            }
        }
    };

    normalizeNode(container);
    return container.innerHTML;
}

type QuillEditor = {
    root: HTMLElement;
    getSelection: () => {index: number; length: number} | null;
    getText: (index?: number, length?: number) => string;
    getSemanticHTML: (index?: number, length?: number) => string;
};

export function attachQuillClipboardNormalization(quill: QuillEditor) {
    let copiedContent: {text: string; html: string} | null = null;

    const captureRange = () => {
        const range = quill.getSelection();
        if (!range) {
            copiedContent = null;
            return;
        }

        const html = normalizeQuillHtml(quill.getSemanticHTML(range.index, range.length));
        copiedContent = typeof html === "string"
            ? {
                text: normalizePolishTextSpaces(quill.getText(range.index, range.length)),
                html,
            }
            : null;
    };

    const normalizeClipboard = (event: ClipboardEvent) => {
        const content = copiedContent;
        copiedContent = null;

        if (!content || !event.clipboardData) {
            return;
        }

        event.clipboardData.setData("text/plain", content.text);
        event.clipboardData.setData("text/html", content.html);
    };

    quill.root.addEventListener("copy", captureRange, true);
    quill.root.addEventListener("cut", captureRange, true);
    quill.root.addEventListener("copy", normalizeClipboard);
    quill.root.addEventListener("cut", normalizeClipboard);

    return () => {
        quill.root.removeEventListener("copy", captureRange, true);
        quill.root.removeEventListener("cut", captureRange, true);
        quill.root.removeEventListener("copy", normalizeClipboard);
        quill.root.removeEventListener("cut", normalizeClipboard);
    };
}

function normalizePolishTextSpaces(text: string) {
    return text.replace(
        /(^|[^\p{L}])([aiouwz]) (?=\p{L})/giu,
        "$1$2\u00A0"
    );
}
