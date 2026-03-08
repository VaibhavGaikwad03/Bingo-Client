import React, { useState, useMemo } from "react";
import "./css/NewGroup.css";

const NewGroup = ({
  friendsList = [],
  onClose = () => {},
  onCreate = () => {},
}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]); // store ids
  const [search, setSearch] = useState("");

  // filtered list by search
  const filteredFriends = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return friendsList;
    return friendsList.filter(
      (f) =>
        (f.fullname || "").toLowerCase().includes(q) ||
        (f.username || "").toLowerCase().includes(q)
    );
  }, [friendsList, search]);

  // --- NEW SELECT ALL LOGIC ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Get all IDs from the CURRENT filtered list
      const allIds = filteredFriends.map(f => f.user_id);
      setSelectedMembers(allIds);
    } else {
      // Clear all selections
      setSelectedMembers([]);
    }
  };

  // Logic to determine if the "Select All" checkbox should be visually checked
  const isEverythingSelected = filteredFriends.length > 0 && 
                               selectedMembers.length === filteredFriends.length;

  const toggleMember = (friend) => {
    setSelectedMembers((prev) =>
      prev.includes(friend.user_id)
        ? prev.filter((id) => id !== friend.user_id)
        : [...prev, friend.user_id]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (selectedMembers.length === 0) {
      alert("Please select at least one member");
      return;
    }

    const members = friendsList.filter((f) =>
      selectedMembers.includes(f.user_id)
    );

    const newGroup = {
      id: `group_${Date.now()}`,
      groupName: groupName.trim(),
      fullname: groupName.trim(),
      isGroup: true,
      members,
      profilePic: "/images/group.png",
      createdAt: new Date().toISOString(),
    };

    onCreate(newGroup);
    onClose();
  };

  return (
    <div className="newgroup-sidebar">
      <div className="ng-header">
        <div className="ng-header-left">
          <i className="bi bi-arrow-left back-arrow" onClick={onClose}></i>
          <h5 className="ms-5">New group</h5>
        </div>
      </div>

      <div className="ng-body">
        <div className="ng-top">
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="ng-input"
          />
          <div className="ng-selected-members">
            {selectedMembers.length === 0 ? (
              <small className="text-muted">No members selected</small>
            ) : (
              selectedMembers.map((id) => {
                const f = friendsList.find((x) => x.user_id === id);
                return (
                  <span key={id} className="ng-chip">
                    {f?.fullname || f?.username}
                  </span>
                );
              })
            )}
          </div>
        </div>

        <div className="ng-search">
          <input
            type="text"
            placeholder="Search contacts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ng-input ng-search-input"
          />
        </div>

        {/* --- SEPARATE SELECT ALL CHECKBOX --- */}
        <div className="d-flex align-items-center px-3 py-2 border-bottom bg-light">
           <input 
              type="checkbox" 
              id="globalSelectAll"
              className="form-check-input me-2"
              checked={isEverythingSelected}
              onChange={handleSelectAll}
              style={{ cursor: 'pointer' }}
           />
           <label htmlFor="globalSelectAll" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Select All
           </label>
        </div>

        <div className="ng-list">
          {filteredFriends.length === 0 ? (
            <div className="ng-empty">No contacts</div>
          ) : (
            filteredFriends.map((friend) => {
              const checked = selectedMembers.includes(friend.user_id);
              return (
                <div
                  key={friend.user_id}
                  className={`ng-list-item ${checked ? "selected" : ""}`}
                  onClick={() => toggleMember(friend)}
                >
                  <div className="ng-avatar">
                    <img
                      src={friend.profilePic || "/images/good_baby_pfp.jpeg"}
                      alt={friend.fullname || friend.username}
                    />
                  </div>
                  <div className="ng-meta">
                    <div className="ng-name">
                      {friend.fullname || friend.username}
                    </div>
                    <div className="ng-desc small text-muted">
                      @{friend.username}
                    </div>
                  </div>
                  <div className="ng-check">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMember(friend)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="ng-footer">
        <button className="btn btn-secondary ng-cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary ng-create"
          onClick={handleCreate}
          disabled={!groupName.trim() || selectedMembers.length === 0}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default NewGroup;