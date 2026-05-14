import PropTypes from 'prop-types';

/**
 * Reusable IconButton component that enforces accessibility by requiring an aria-label.
 */
const IconButton = ({ icon: Icon, onClick, className, 'aria-label': ariaLabel, ...props }) => {
    return (
        <button
            onClick={onClick}
            className={`p-2 flex items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neon ${className || ''}`}
            aria-label={ariaLabel}
            {...props}
        >
            <Icon size={20} />
        </button>
    );
};

IconButton.propTypes = {
    icon: PropTypes.elementType.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    'aria-label': PropTypes.string.isRequired, // Enforce accessibility
};

export default IconButton;
