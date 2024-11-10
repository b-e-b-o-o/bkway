import './Controls.css'

import { useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import OptionsTab from './tabs/options/OptionsTab';
import TabPanel from './tabs/common/TabPanel';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function ControlsContainer() {
    const [activeTab, setActiveTab] = useState(0);

    return <div className='controls-container'>
        <div className='menu-container'>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} aria-label="Tabs" variant="fullWidth">
                <Tab label="Beállítások" {...a11yProps(0)} />
                <Tab label="Útvonal" {...a11yProps(1)} />
            </Tabs>
            <TabPanel activeTab={activeTab} index={0}>
                <OptionsTab />
            </TabPanel>
        </div>
    </div>
}
