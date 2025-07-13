import { FriendRequestStatus, MessageTypes } from "./Status_MessageTypes";
import { useState } from "react";

export default function SidebarFriendRequests(props) {
  let { friendRequest, setFriendRequest, setShowSidebar, socket } = props;
  let [requestView, setRequestView] = useState("friend_request");
  const timestamp = new Date().toISOString();

  const handleAccept = (friendRequest) => {
    console.log(friendRequest);
    alert(`Accepted request from ${friendRequest.sender}`);

    setFriendRequest((prev) =>
      prev.filter((u) => u.sender_id !== friendRequest.sender_id)
    );

    const friend_req_status = {
      message_type: MessageTypes.FRIEND_REQ_RESPONSE,
      sender_id: friendRequest.receiver_id,
      sender: friendRequest.receiver,
      receiver_id: friendRequest.sender_id,
      receiver: friendRequest.sender,
      request_status: FriendRequestStatus.ACCEPTED,
      timestamp: timestamp,
    };

    console.log(friend_req_status);
    socket.send(JSON.stringify(friend_req_status));
  };

  const handleDecline = (friendRequest) => {
    alert(`Declined request from ${friendRequest.sender}`);

    setFriendRequest((prev) =>
      prev.filter((u) => u.sender_id !== friendRequest.sender_id)
    );

    const friend_req_status = {
      message_type: MessageTypes.FRIEND_REQ_RESPONSE,
      sender_id: friendRequest.receiver_id,
      sender: friendRequest.receiver,
      receiver_id: friendRequest.sender_id,
      receiver: friendRequest.sender,
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
            friendRequest.map((req) => (
              <div
                key={req.sender_id}
                className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom"
              >
                <img
                  src={req.profile_url || "/images/icons/user.png"}
                  alt="profile"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <div className="flex-grow-1 ms-3">
                  <div className="fw-semibold">{req.display_name}</div>
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                    @{req.sender}
                  </div>
                </div>
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
              </div>
            ))
          ) : (
            <p className="text-muted mt-3">No pending requests.</p>
          )}

          <img src="/images/icons/bell.png" alt="" className="bottom-bell" onClick={() => setRequestView("notification")} />
        </>
      )}

      {
        requestView == "notification" && (
          <>
          <i className="bi bi-arrow-left" onClick={()=> setRequestView("friend_request")} style={{cursor: "pointer" , fontSize: "25px"}}></i>

          </>
        )
      }
    </div>
  );
}
