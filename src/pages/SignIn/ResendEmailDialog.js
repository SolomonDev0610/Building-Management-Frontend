import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@material-ui/core";

export default class ResendEmailDialog extends Component {
  render() {
    const {
      onResendEmailShow,
      onResendEmailClose,
      onResendEmailClicked
    } = this.props;

    return (
      <Dialog
        open={onResendEmailShow}
        onClose={onResendEmailClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Resend Activation E-mail
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kindly write your email address here so we can resend your
            activation.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onResendEmailClose} color="secondary" variant="contained" style={{backgroundColor:"#757575 !important"}}>
            Cancel
          </Button>
          <Button onClick={onResendEmailClicked} color="primary" variant="contained">
            Resend
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
