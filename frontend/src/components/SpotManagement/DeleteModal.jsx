

const DeleteModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="delete-btn" onClick={onConfirm}>
          Yes (Delete)
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          No (Keep)
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;