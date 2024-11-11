import './TabPanel.css';

import Box from "@mui/material/Box";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    activeTab: number;
}

export default function TabPanel(props: TabPanelProps) {
    const { children, activeTab, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={activeTab !== index}
            id={`controls-tabpanel-${index}`}
            aria-labelledby={`controls-tab-${index}`}
            {...other}
        >
            {activeTab === index && <Box className='tab-panel'>{children}</Box>}
        </div>
    );
}
