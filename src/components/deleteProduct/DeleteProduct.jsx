import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function DeleteProduct({ name, open, itemName, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Удалить {name}</DialogTitle>
      <DialogContent>
        <Typography>Вы действительно хотите удалить {name ? name : 'этот продукт'}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отменить</Button>
        <Button onClick={onConfirm} color="secondary">Удалить</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteProduct;
