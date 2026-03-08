import React from "react"

export default function ProfilePhoto({setShowImageModal,modalImageName,modalImageSrc}){
    return(
        <div
          className="modal-overlay img_modal"
          onClick={() => setShowImageModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="img_modal_2">
            <button
              onClick={() => setShowImageModal(false)}
              className="modal-close-button"
              aria-label="Close"
            >
              &times;
            </button>
            <h5 className="text-center my-2">{modalImageName}</h5>
            <img src={modalImageSrc} alt="Profile" className="modal-image" />
          </div>
        </div>
    )
}