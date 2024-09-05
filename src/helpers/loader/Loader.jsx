// src/components/Loader.js
import './loader.css';
import { CircularProgress, Box } from '@mui/material';

function Loader() {
    return (
        <Box
            className="loader-item"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80%',
                width: '83.5%',
                position: 'fixed',
            }}
        >
            <CircularProgress className='loading' color="primary" />
        </Box>
    );
}

export default Loader;
