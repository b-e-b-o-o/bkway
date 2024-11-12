import './Controls.css'

import OptionsTab from './tabs/options/OptionsTab';
import TabPanel from './tabs/common/TabPanel';

import { useMemo, useState } from 'react';

import type { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { Tab, Tabs, type TabTypeMap, type ExtendButtonBaseTypeMap, type SxProps, type Theme } from '@mui/material';
import { usePathfindingContext } from '../../contexts/pathfinding.context';
import BfsVisualizationTab from './tabs/pathfinding/bfs/BfsVisualizationTab';
import { BFSPathfinding } from '../../models/pathfinding/bfs';

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
    const { pathfinding } = usePathfindingContext();
    const [activeTab, setActiveTab] = useState(0);

    const pathfindingTab = useMemo(() => {
        if (pathfinding instanceof BFSPathfinding)
            return <BfsVisualizationTab bfs={pathfinding} />;
        return <></>;
    }, [pathfinding]);

    return <div className='controls-container'>
        <div className='menu-container'>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} aria-label="Tabs" variant="fullWidth">
                <Tab label="Beállítások" {...tabProps(0)} />
                <Tab label="Útvonal" {...tabProps(1)} />
            </Tabs>
            <TabPanel activeTab={activeTab} index={0}>
                <OptionsTab />
            </TabPanel>
            <TabPanel activeTab={activeTab} index={1}>
                {pathfindingTab}
            </TabPanel>
        </div>
    </div>
}
