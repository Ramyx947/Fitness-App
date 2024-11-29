/**
 * A reusable Date Picker component specifically designed for date selection within forms
 * It serves as a custom input for date picker libraries, allowing for consistent styling and behavior across the application
**/
import React from 'react';
import PropTypes from 'prop-types';

const CustomDateInput = React.forwardRef(({ value, onClick, id }, ref) => (
    <button className="date-picker-button" onClick={onClick} id={id} ref={ref}>
        {value}
    </button>
));
CustomDateInput.displayName = 'CustomDateInput';

CustomDateInput.propTypes = {
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default CustomDateInput;