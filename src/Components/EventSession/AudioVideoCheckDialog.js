import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
// import { createNewRoom } from "../../Modules/eventSessionOperations";
// import { useSnackbar } from "material-ui-snackbar-provider";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import { getMuteAudioOnEnter, getMuteVideoOnEnter, setMuteVideo, setMuteAudio } from "../../Redux/eventSession";
// import { Paper } from "@material-ui/core";
import { Switch } from "@material-ui/core";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(0),
    // margin: 0,
  },
  dialogTitle: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    textAlign: "center",
  },
  dialogContent: {
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between"
  },
  button: ({ loading }) => ({
    opacity: loading ? 0.5 : 1,
    width: "90%",
    alignSelf: "center",
    marginTop: theme.spacing(4)
  }),
  cameraContainer: {
    height: "100%",
    width: "100%",
  },
  switchesContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginTop: theme.spacing(4),
    justifyContent: "space-around",
  },
  switchWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
}));

const AudioVideoCheckDialog = ({ handleSubmit, sessionId,  audioSwitchRender, videoSwitchRender }) => {
  const styles = useStyles();

  const dispatch = useDispatch();
  const muteVideo = useSelector(getMuteAudioOnEnter)
  const muteAudio = useSelector(getMuteVideoOnEnter);

  const handleVideoToggle = () => {
    // setMuteVideo(!muteVideo)
    dispatch(setMuteVideo())
  }

  const handleAudioToggle = () => {
    // setMuteAudio(!muteAudio)
    dispatch(setMuteAudio())
  }

  const VideoSwitch = () => {
    return (
      <div className={styles.switchWrapper}>
        {!muteVideo && <VideocamIcon />}
        {muteVideo && <VideocamOffIcon />}
        <Switch
          checked={!muteVideo}
          onChange={handleVideoToggle}
          name="checkedB"
          color="primary"
        >
        </Switch>
      </div>
    )
  }

  const AudioSwitch = () => {
    return (
      <div className={styles.switchWrapper}>
        {muteAudio && <MicOffIcon />}
        {!muteAudio && <MicIcon />}
        <Switch
          checked={!muteAudio}
          onChange={handleAudioToggle}
          name="checkedB"
          color="primary"
        >
        </Switch>
      </div>
    )
  }

  return (
    // <Paper>
      <Dialog open className={styles.dialog} fullWidth maxWidth="xs">
        <DialogTitle className={styles.dialogTitle} id="form-dialog-title">

          You are about to join {sessionId}
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          
          <div className={styles.cameraContainer}>
            <Webcam 
              height="100%"
              width="100%"
            />
          </div>

          <div className={styles.switchesContainer}>
            <VideoSwitch />
            <AudioSwitch />
          </div>
          
          <Button
            className={styles.button}
            onClick={handleSubmit}
            // type="submit"
            variant="contained"
            color="primary"
          >
            Join Event
          </Button>

        </DialogContent>
      </Dialog>
    // </Paper>
  )
}

export default AudioVideoCheckDialog;