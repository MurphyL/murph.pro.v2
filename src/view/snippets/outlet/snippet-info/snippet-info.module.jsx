import { useParams } from "react-router-dom";

export default function SnippetList() {
    const { fileType, fileName } = useParams();
    return (
        <div>Snippet: { fileType } - { fileName }</div>
    );
}