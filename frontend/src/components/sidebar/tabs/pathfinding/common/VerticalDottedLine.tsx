import Box from '@mui/material/Box';

export default function VerticalDottedLine({ dotSize = 8, gap = 8, color = 'white' }) {
    return (
        <Box
            sx={{
                width: '25px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden', // Ensures no overflow for dots
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${gap}px`, // Space between dots
                }}
            >
                {Array(100)
                    .fill(0)
                    .map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: `${dotSize}px`,
                                height: `${dotSize}px`,
                                borderColor: color,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderRadius: '50%', // Circular dots
                            }}
                        />
                    ))}
            </Box>
        </Box>
    );
};
