import { FriendRequestStatus, MessageTypes } from "./Status_MessageTypes";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SidebarFriendRequests(props) {
  let { friendRequest, setFriendRequest, setShowSidebar, socket } = props;
  let [requestView, setRequestView] = useState("friend_request");
  const timestamp = new Date().toISOString();

  const calculateDaysAgo = (requestTimestamp) => {
    const requestDate = new Date(requestTimestamp);
  
    // Handle invalid date input gracefully
    if (isNaN(requestDate.getTime())) {
      return "Invalid Date";
    }
  
    const today = new Date();
    // Set both dates to midnight to ensure accurate day comparison,
    // regardless of the time of day the request was made or the current time.
    requestDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    const diffTime = today.getTime() - requestDate.getTime(); // Direct difference in milliseconds
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Round to nearest whole day
  
    if (diffDays === 0) {
      return "today";
    } else if (diffDays === 1) {
      return "yesterday";
    } else if (diffDays > 1) {
      return `${diffDays} days ago`;
    } else {
      // This case would handle future dates if the requestTimestamp is in the future
      // You might want to adjust the message here based on your requirements
      return `${Math.abs(diffDays)} days in the future`;
    }
  };
  const handleAccept = (req) => {
    console.log(req);
    // alert(`Accepted request from ${req.sender}`);
    toast.success(`Accepted request from ${req.sender}`);

    setFriendRequest((prev) =>
      prev.filter((u) => u.sender_id !== req.sender_id)
    );

    const friend_req_status = {
      message_type: MessageTypes.FRIEND_REQ_RESPONSE,
      sender_id: req.receiver_id,
      sender: req.receiver,
      name_of_sender: req.name_of_receiver,
      receiver_id: req.sender_id,
      receiver: req.sender,
      name_of_receiver: req.name_of_sender,
      request_status: FriendRequestStatus.ACCEPTED,
      timestamp: timestamp,
    };

    console.log(friend_req_status);
    socket.send(JSON.stringify(friend_req_status));
  };

  const handleDecline = (req) => {
    // alert(`Declined request from ${req.sender}`);
    toast.info(`Declined request from ${req.sender}`);

    setFriendRequest((prev) =>
      prev.filter((u) => u.sender_id !== req.sender_id)
    );

    const friend_req_status = {
      message_type: MessageTypes.FRIEND_REQ_RESPONSE,
      sender_id: req.receiver_id,
      sender: req.receiver,
      name_of_sender: req.name_of_receiver,
      receiver_id: req.sender_id,
      receiver: req.sender,
      name_of_receiver: req.name_of_sender,
      request_status: FriendRequestStatus.REJECTED,
      timestamp: timestamp,
    };

    console.log(friend_req_status);
    socket.send(JSON.stringify(friend_req_status));
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white border-start sidebar-friend-requests">
      {requestView == "friend_request" && (
        <>
          <i
            className="bi bi-x-lg"
            style={{
              fontSize: "1.2rem",
              cursor: "pointer",
              position: "absolute",
              top: 20,
              right: 20,
            }}
            onClick={() => setShowSidebar(false)}
          ></i>

          <h5 className="mt-4 mb-3">Friend Requests</h5>

          {friendRequest && friendRequest.length > 0 ? (
            friendRequest.map((req, index) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom"
              >
                <img
                  src={req.profile_url || "/images/icons/user.png"}
                  alt="profile"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <div className="flex-grow-1 ms-3">
                  <div className="fw-semibold">{req.name_of_sender}</div>
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                    @{req.sender}
                  </div>
                  {req.msg && (
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      Message: {req.msg}
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column align-items-end"> 
                  <div className="d-flex gap-2"> 
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      onClick={() => handleAccept(req)}
                      title="Accept"
                    ></i>
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      onClick={() => handleDecline(req)}
                      title="Decline"
                    ></i>
                  </div>
                  {req.timestamp && (
                    <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                      ({calculateDaysAgo(req.timestamp)})
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted mt-3">No pending requests.</p>
          )}

          <img
            src="/images/icons/bell.png"
            alt=""
            className="bottom-bell"
            onClick={() => setRequestView("notification")}
          />
        </>
      )}

      {requestView == "notification" && (
        <>
          <i
            className="bi bi-arrow-left"
            onClick={() => setRequestView("friend_request")}
            style={{ cursor: "pointer", fontSize: "25px" }}
          ></i>
        </>
      )}
    </div>
  );
}