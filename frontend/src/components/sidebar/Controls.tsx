import './Controls.css'

import OptionsTab from './tabs/options/OptionsTab';
import TabPanel from './tabs/common/TabPanel';

import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import type { TabTypeMap } from '@mui/material/Tab';
import type { DefaultComponentProps } from '@mui/material/OverridableComponent';
import type { ExtendButtonBaseTypeMap, SxProps, Theme } from '@mui/material';

type TabProps = DefaultComponentProps<ExtendButtonBaseTypeMap<TabTypeMap<{}, "div">>>;

const noFocusOutline: SxProps<Theme> = { ":focus": { outline: "none !important" } };

function a11yProps(index: number): TabProps {
    return {
        id: `controls-tab-${index}`,
        'aria-controls': `controls-tabpanel-${index}`,
    };
}

function tabProps(index: number): TabProps {
    return {
        sx: { ...noFocusOutline },
        ...a11yProps(index),
    };
}

export default function ControlsContainer() {
    const [activeTab, setActiveTab] = useState(0);

    return <div className='controls-container'>
        <div className='menu-container'>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} aria-label="Tabs" variant="fullWidth">
                <Tab label="Beállítások" {...tabProps(0)} />
                <Tab label="Útvonal" {...tabProps(1)} />
            </Tabs>
            <TabPanel activeTab={activeTab} index={0}>
                <OptionsTab />
            </TabPanel>
        </div>
    </div>
}
