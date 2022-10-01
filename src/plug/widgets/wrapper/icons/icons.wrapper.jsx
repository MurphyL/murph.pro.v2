import SvgIcon from '@mui/material/SvgIcon';

export function SimpleIconWrap({ viewBox, color, fontSize, sx, ...si }) {
    return (
        <SvgIcon sx={sx} viewBox={viewBox} color={color} fontSize={fontSize} titleAccess={si.title}>
            <title data-slug={si.slug}>{si.title}</title>
            <path d={si.path} />
        </SvgIcon>
    );
};