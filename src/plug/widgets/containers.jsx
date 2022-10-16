import React from 'react';

import Split from 'react-split'

import { styled, Box, Typography } from '@mui/material';


export function Group({ title, children, sx = {}, direction, Component = Box, ...restOptions }) {
    return (
        <Box component="fieldset" sx={{ p: 1, border: `1px solid #efefef`, borderRadius: 1, ...sx }}>
            <Typography component="legend" variant="subtitle2" sx={{ px: 0.6, color: '#455a64', userSelect: 'none' }}>{title}</Typography>
            <Component sx={{ p: 0.5 }} direction={direction} {...restOptions}>{children}</Component>
        </Box >
    );
}

export const Splitter = styled(Split)(({ direction = 'row' }) => ({
    display: 'flex',
    flexDirection: direction,
    height: '100%',
    '& .gutter': {
        border: '1px solid var(--border-color)',
        opacity: 0.8,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50%'
    },
    '& .gutter-horizontal': {
        cursor: 'col-resize',
        borderTop: 'none',
        borderBottom: 'none',
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==")'
    },
    '& .gutter-vertical': {
        cursor: 'row-resize',
        borderLeft: 'none',
        borderRight: 'none',
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=")'
    }
}))

