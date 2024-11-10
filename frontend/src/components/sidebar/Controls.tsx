import { useState } from 'react';
import './Controls.css'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import OptionsTab from './tabs/options/OptionsTab';
import TabPanel from './tabs/TabPanel';

import type * as React from 'react';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function ControlsContainer() {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return <div className='controls-container'>
        <div className='menu-container'>
            <Tabs value={value} onChange={handleChange} aria-label="lab API tabs example" variant="fullWidth">
                <Tab label="Beállítások" {...a11yProps(0)} />
                <Tab label="Útvonal" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <OptionsTab />
            </TabPanel>
        </div>
    </div>
}
