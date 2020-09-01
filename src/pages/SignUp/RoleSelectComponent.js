import React, { Component } from 'react'
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    TextField,
    Button, 
    DialogActions 
} from '@material-ui/core';

export default class RoleSelectComponent extends Component {

  render() {
    let {
        onOpenDialog,
        onTransistionDialog,
        onCloseDialog,
        onValueBuildingInfo,
        onChangeValueBuildingInfo
    }  = this.props
    return (
    <div>
        <Dialog
            open={onOpenDialog}
            TransitionComponent={onTransistionDialog}
            aria-labelledby="form-dialog-title"
            fullWidth
        >
            <DialogTitle id="form-dialog-title">
                Assign Building
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="building"
                    name="building_name"
                    label="Select or Add Building *"
                    onChange={onChangeValueBuildingInfo}
                    value={onValueBuildingInfo}
                    type="text"
                    fullWidth
                 />
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant="contained">
                    Submit
                </Button>
                <Button color="secondary" variant="contained" onClick={onCloseDialog}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </div>
    )
  }
}
