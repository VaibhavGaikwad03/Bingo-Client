export default function Settings({ onClose }) {
  return (
    <div className="settings-sidebar ">
      <i className="bi bi-x-lg settings-close-icon" onClick={onClose}></i>

      <h5 className="mb-4 mt-2"></h5>

      <ul className="list-group list-group-flush">
        <li className="list-group-item">Change Password</li>

        <li className="list-group-item">Option 1 </li>

        <li className="list-group-item">Option 2</li>

        <li className="list-group-item">Option 3</li>
      </ul>
    </div>
  );
}
