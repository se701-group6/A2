import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import ClearIcon from "@material-ui/icons/Clear";

import styles from "./EditableBillPeopleList.module.css";

const PersonRow = ({
  person,
  hasPaid,
  onTogglePaid,
  onNameChange,
  onRemove
}) => (
  <li>
    <div className={styles.personRow}>
      <TextField value={person.name} onChange={onNameChange} fullWidth />

      <ToggleButtonGroup
        value={hasPaid ? "payee" : "payer"}
        size="small"
        exclusive
        onChange={onTogglePaid}
      >
        <ToggleButton value="payer">Payer</ToggleButton>
        <ToggleButton value="payee">Payee</ToggleButton>
      </ToggleButtonGroup>

      <Button onClick={onRemove}>
        <ClearIcon />
      </Button>
    </div>
  </li>
);

PersonRow.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  hasPaid: PropTypes.bool.isRequired,
  onTogglePaid: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

const EditableBillPeopleList = ({
  people,
  paidPersonId,
  onPayeeChange,
  onNameChange,
  onRemovePerson
}) => {
  return (
    <ul className={styles.peopleList}>
      {people.allIds.map(id => (
        <PersonRow
          key={id}
          person={people.byId[id]}
          hasPaid={id === paidPersonId}
          onTogglePaid={() => onPayeeChange(id === paidPersonId ? null : id)}
          onNameChange={event => onNameChange(id, event.target.value)}
          onRemove={() => onRemovePerson(id)}
        />
      ))}
    </ul>
  );
};

EditableBillPeopleList.propTypes = {
  people: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string.isRequired),
    byId: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    ).isRequired
  }).isRequired,
  paidPersonId: PropTypes.string,
  onPayeeChange: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onRemovePerson: PropTypes.func.isRequired
};

EditableBillPeopleList.defaultProps = {
  paidPersonId: null
};

export default EditableBillPeopleList;
