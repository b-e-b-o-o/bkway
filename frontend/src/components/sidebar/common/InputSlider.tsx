import * as React from 'react';
import { Box, Input, Slider, Typography, Grid2 as Grid } from '@mui/material';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface InputSliderProps {
    refValue: React.MutableRefObject<number>;
    min: number;
    max: number;
    step?: number;
    icon?: IconProp;
    caption?: string;
    unit?: string;
}

export default function InputSlider({ refValue, min, max, step = 1, icon, caption, unit }: InputSliderProps) {
    const [value, setValue] = React.useState(refValue.current);
    refValue.current = value;

    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (min && value < min) {
            setValue(min);
        }
        if (max && value > max) {
            setValue(max);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {caption && <Typography id="input-slider" sx={{ textAlign: 'left' }}>
                {caption}
            </Typography>}
            <Grid container spacing={2} sx={{ alignItems: 'center', justifyItems: 'center' }}>
                {icon && <Grid><FontAwesomeIcon icon={icon} /></Grid>}
                <Grid size='grow'>
                    <Slider
                        value={typeof value === 'number' ? value : min}
                        min={min}
                        max={max}
                        step={step}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid>
                    <Input
                        sx={{ display: 'flex' }}
                        value={value}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            min: min,
                            max: max,
                            step: step,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
                {unit && <Grid><Typography>{unit}</Typography></Grid>}
            </Grid>
        </Box>
    );
}
