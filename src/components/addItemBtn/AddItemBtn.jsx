import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function AddItemBtn({ name, onClick }) {
    return (
        <Button
            variant="outlined"
            color="primary"
            onClick={onClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: name ? 'center' : 'start',
                textAlign: 'center',
                
            }}
        >
            {name || <AddIcon />}
        </Button>
    );
}

export default AddItemBtn;
