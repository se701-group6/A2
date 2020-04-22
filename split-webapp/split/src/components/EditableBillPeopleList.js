import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import ClearIcon from "@material-ui/icons/Clear";
import DragHandleIcon from "@material-ui/icons/DragHandle";

import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";

import styles from "./EditableBillPeopleList.module.css";

const DragHandle = SortableHandle(props => (
  // Wrapper span element to provide a
  // nice comfortable square area that can
  // accept drag events, and to center the icon.
  //
  // react-sortable-hoc need to pass in some
  // props to the span, so we spread it here.
  /* eslint-disable react/jsx-props-no-spreading */
  //
  // We provide a zero tab index so that the span
  // can be tabbed into and be used with the keyboard
  // shortcuts to sort the list:
  //   space = pick up / drop
  //   arrows = move up / down
  //   escape = cancel
  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  <span {...props} tabIndex={0}>
    <DragHandleIcon />
  </span>
  /* eslint-enable react/jsx-props-no-spreading */
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
));

const PersonRow = SortableElement(
  ({ person, hasPaid, onTogglePaid, onNameChange, onRemove, ...other }) => (
    // react-sortable-hoc needs to pass in some
    // props to the <li>, so we spread it here.
    /* eslint-disable react/jsx-props-no-spreading */
    <li {...other}>
      <div className={styles.personRow}>
        <DragHandle className={styles.dragHandle} />

        <TextField
          value={person.name}
          onChange={onNameChange}
          placeholder="Enter person’s name..."
          fullWidth
          className={styles.personNameTextField}
          InputProps={{
            inputProps: {
              className: styles.personNameInput
            },

            // We don't want their fancy rippled underline as
            // it is hard to customize.
            disableUnderline: true
          }}
        />

        <ToggleButtonGroup
          value={hasPaid ? "payee" : "payer"}
          size="small"
          exclusive
          onChange={onTogglePaid}
          className={styles.personPayeeToggleGroup}
        >
          <ToggleButton
            value="payer"
            classes={{
              root: styles.personIsPayerButton,
              selected: styles.personIsPayerButtonSelected
            }}
          >
            Payer
          </ToggleButton>
          <ToggleButton
            value="payee"
            classes={{
              root: styles.personIsPayeeButton,
              selected: styles.personIsPayeeButtonSelected
            }}
          >
            Payee
          </ToggleButton>
        </ToggleButtonGroup>

        <Button onClick={onRemove} className={styles.personRemoveButton}>
          <ClearIcon />
        </Button>
      </div>
    </li>
    /* eslint-enable react/jsx-props-no-spreading */
  )
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

const PeopleList = SortableContainer(
  ({ people, paidPersonId, onPayeeChange, onNameChange, onRemovePerson }) => {
    return (
      <ul className={styles.peopleList}>
        {people.allIds.map((id, i) => (
          <PersonRow
            index={i}
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
  }
);

const EditableBillPeopleList = ({
  people,
  paidPersonId,
  onPayeeChange,
  onNameChange,
  onRemovePerson,
  onSwapOrder
}) => {
  const handleSortStart = () => {
    // Dragging has started. Show a grabbing cursor.
    // This is done globally rather than applying
    // CSS local to the element, because we want the
    // cursor to stay "grabbing" even when the cursor
    // leaves the bounding box of the person row to be
    // dragged.
    document.body.style.cursor = "grabbing";
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    // Dragging is over. Don't show the grabbing cursor.
    document.body.style.cursor = "";

    onSwapOrder(oldIndex, newIndex);
  };

  return (
    <PeopleList
      lockAxis="y"
      lockToContainerEdges
      lockOffset={["0%", "0%"]}
      useDragHandle
      onSortStart={handleSortStart}
      onSortEnd={handleSortEnd}
      people={people}
      paidPersonId={paidPersonId}
      helperClass={styles.peopleListDragHelper}
      onPayeeChange={onPayeeChange}
      onNameChange={onNameChange}
      onRemovePerson={onRemovePerson}
    />
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
  onRemovePerson: PropTypes.func.isRequired,
  onSwapOrder: PropTypes.func.isRequired
};

EditableBillPeopleList.defaultProps = {
  paidPersonId: null
};

export default EditableBillPeopleList;
