import React, { useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import ParticipantCard from "../EventSession/ParticipantCard";
import ProfileChips from "./ProfileChips";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import uuidv1 from "uuid/v1";
import { getUserDb, updateUser } from "../../Modules/userOperations";
import { useRouteMatch } from "react-router-dom";
import routes from "../../Config/routes";
import { useSnackbar } from "material-ui-snackbar-provider";

const styles = theme => ({
  row: {
    flexDirection: "row"
  },
  button: {
    marginTop: theme.spacing(2)
  },
  bottom: {
    textAlign: "center",
    marginTop: 16
  },
  textField: {
    marginTop: 16
    // marginBottom: 16
  }
});

const getUserDefaultValues = user => {
  let { displayName, isAnonymous } = user;
  if (!displayName) {
    return { firstName: "", lastName: "" };
  }
  let splitted = displayName.split(" ");
  let firstName = splitted[0];
  let lastName = splitted[splitted.length - 1];
  return {
    id: user.uid,
    firstName,
    lastName,
    email: user.email ? user.email : "",
    linkedin: "",
    twitter: "",
    emailPublic: false,
    avatarUrl: user.photoURL,
    interest: "",
    twitterUrl: null,
    linkedinUrl: null,
    interestsChips: [],
    company: "",
    companyTitle: "",
    isAnonymous
  };
};

const linkedinUrlStatic = "https://linkedin.com/in/";
const twitterUrlStatic = "https://twitter.com/";

function EditProfileForm(props) {
  const { classes, user, sessionId, profileUpdatedCallback } = props;
  if (!user && !sessionId) {
    return <p>No session available...</p>;
  }
  let [values, setValues] = React.useState(getUserDefaultValues(user));
  let [errors, setErrors] = React.useState({});
  const [interestsChips, setInterestsChips] = React.useState([]);
  const [updating, setUpdating] = React.useState(false);
  const snackbar = useSnackbar();

  const handleUpdateField = name => e => {
    let value = e.target.value;
    let newValues = { ...values };
    newValues[name] = value;
    if (name === "linkedin") {
      newValues.linkedinUrl = value.trim() !== "" ? linkedinUrlStatic + value : null;
    }

    if (name === "twitter") {
      newValues.twitterUrl = value.trim() !== "" ? twitterUrlStatic + value : null;
    }
    setValues(newValues);
  };

  const fetchUser = async () => {
    let userDb = await getUserDb(user.uid);
    console.log(userDb);

    if (userDb) {
      let {
        firstName,
        lastName,
        email,
        linkedin,
        twitter,
        emailPublic,
        avatarUrl,
        twitterUrl,
        linkedinUrl,
        interestsChips,
        company,
        companyTitle
      } = userDb;

      const x = str => (str ? str : "");

      setValues({
        ...values,
        firstName: x(firstName),
        lastName: x(lastName),
        email: x(email),
        linkedin: x(linkedin),
        twitter: x(twitter),
        emailPublic: emailPublic === true,
        avatarUrl: x(avatarUrl),
        twitterUrl: x(twitterUrl),
        linkedinUrl: x(linkedinUrl),
        interestsChips: interestsChips ? interestsChips : [],
        company: x(company),
        companyTitle: x(companyTitle)
      });

      setInterestsChips(interestsChips ? interestsChips : []);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  const handleAddInterest = _ => {
    if (values.interest.trim() !== "") {
      let label = values.interest;
      let key = uuidv1();
      let newInterests = [...interestsChips];
      newInterests.push({ key, label });

      setInterestsChips(newInterests);
      setValues({ ...values, interest: "", interestsChips: newInterests });
    }
  };

  const handleEmailPrivacy = event => {
    setValues({ ...values, emailPublic: event.target.checked });
  };

  const handleUpdateProfile = async () => {
    if (values.firstName.trim() === "") {
      setErrors({ firstName: "First name can't be empty" });
      return;
    }

    setUpdating(true);
    await updateUser(user.uid, sessionId, values);
    await fetchUser();
    snackbar.showMessage("Your profile has been updated successfuly");
    if (profileUpdatedCallback) {
      profileUpdatedCallback();
    }
    setUpdating(false);
  };
  return (
    <React.Fragment>
      <div style={{ marginBottom: 32 }}>
        <ParticipantCard participant={values} />
      </div>
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          variant="outlined"
          value={values.firstName}
          required
          style={{ width: "48%" }}
          onChange={handleUpdateField("firstName")}
          helperText={errors.firstName ? errors.firstName : null}
          error={errors.firstName !== undefined}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          variant="outlined"
          value={values.lastName}
          style={{ width: "48%" }}
          onChange={handleUpdateField("lastName")}
        />
      </Grid>
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          variant="outlined"
          value={values.email}
          style={{ width: 380 }}
          onChange={handleUpdateField("email")}
        />
        <FormGroup row>
          <Tooltip
            title={
              values.emailPublic
                ? "Your email will be shared with the participants of this event"
                : "Your email will only be shared with the organizers"
            }
          >
            <FormControlLabel
              control={
                <Switch
                  checked={values.emailPublic}
                  onChange={handleEmailPrivacy}
                  name="emailPrivacy"
                  color="primary"
                />
              }
              label={values.emailPublic ? "Public" : "Private"}
            />
          </Tooltip>
        </FormGroup>
      </Grid>
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="Job Title"
          name="companyTitle"
          variant="outlined"
          // inputRef={register()}
          value={values.companyTitle}
          style={{ width: "48%" }}
          // className={clsx(classes.flexGrow, classes.textField)}
          onChange={handleUpdateField("companyTitle")}
        />
        <TextField
          fullWidth
          label="Company"
          name="company"
          variant="outlined"
          value={values.company}
          style={{ width: "48%" }}
          onChange={handleUpdateField("company")}
        />
      </Grid>
      {/* <TextField
        fullWidth
        label="Short Bio"
        name="shortBio"
        variant="outlined"
        className={classes.textField}
        value={values.shortBio}
        onChange={handleUpdateField("shortBio")}
      /> */}
      <TextField
        fullWidth
        label="LinkedIn Profile"
        name="linkedin"
        variant="outlined"
        className={classes.textField}
        InputProps={{
          startAdornment: <InputAdornment position="start">{linkedinUrlStatic}</InputAdornment>
        }}
        value={values.linkedin}
        onChange={handleUpdateField("linkedin")}
      />
      <TextField
        fullWidth
        label="Twitter Profile"
        name="twitter"
        variant="outlined"
        className={classes.textField}
        value={values.twitter}
        InputProps={{
          startAdornment: <InputAdornment position="start">{twitterUrlStatic}</InputAdornment>
        }}
        value={values.twitter}
        onChange={handleUpdateField("twitter")}
      />
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="Interests/Hobbies"
          name="interest"
          variant="outlined"
          value={values.interest}
          style={{ width: 435 }}
          onChange={handleUpdateField("interest")}
          onKeyPress={ev => {
            if (ev.key === "Enter") {
              // Do code here
              handleAddInterest();
              ev.preventDefault();
            }
          }}
          helperText={`${interestsChips.length}/5 interests added`}
          disabled={interestsChips.length >= 5}
        />
        <div>
          <Tooltip title="Add interest">
            <IconButton
              color="primary"
              aria-label="add interest"
              onClick={handleAddInterest}
              disabled={interestsChips.length >= 5}
            >
              <AddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </div>
      </Grid>

      <div style={{ marginTop: 8 }}>
        <ProfileChips chips={interestsChips} setChips={setInterestsChips} showDelete={true} />
      </div>
      <div className={classes.bottom}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
          onClick={handleUpdateProfile}
          disabled={updating}
        >
          Update Profile
        </Button>
      </div>
    </React.Fragment>
  );
}

export default withStyles(styles)(EditProfileForm);
