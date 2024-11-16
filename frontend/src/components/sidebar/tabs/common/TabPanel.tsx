import Box, { type BoxProps } from "@mui/material/Box";

interface TabPanelProps extends BoxProps {
    children?: React.ReactNode;
    index: number;
    activeTab: number;
}

export default function TabPanel(props: TabPanelProps) {
    const { children, activeTab, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={activeTab !== index}
            id={`controls-tabpanel-${index}`}
            aria-labelledby={`controls-tab-${index}`}
            {...other}
            sx={{ overflowY: 'hidden', height: '100%', padding: '1rem' }}>
            {
                activeTab === index &&
                <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1rem', height: '100%' }}>
                    {children}
                </Box>
            }
        </Box>
    );
}
