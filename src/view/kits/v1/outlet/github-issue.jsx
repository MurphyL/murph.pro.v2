import Stack from "@mui/material/Stack";

export function GithubIssueCreator({ title = 'Issue 标题' }) {
    return (
        <Stack spacing={2} sx={{ p: 3 }}>
            <div>Bug - 模块实现</div>
            <div>{title}</div>
        </Stack>
    );
}