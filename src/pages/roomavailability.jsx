import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faDoorClosed, faStairs, faTimes } from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/room-availability.css";
import "../styles/navbarvariant1.css";

const floors = Array.from({ length: 13 }, (_, i) => {
  const floor = i + 3;
  return floor === 13 ? null : `${floor}${floor === 3 ? 'rd' : 'th'} Floor`;
}).filter(Boolean);

const RoomAvailability = () => {
  const [selectedFloor, setSelectedFloor] = useState("3rd Floor");
  const [roomData, setRoomData] = useState({});
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const docRef = doc(db, "roomAvailability", "floors");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRoomData(docSnap.data());
        } else {
          console.warn("No such document in roomAvailability!");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchRoomData();
  }, []);

  // Debug: Log the room data for the selected floor (room numbers)
  console.log(
    'roomData for', 
    selectedFloor, 
    roomData[selectedFloor]?.map((item, i) => item && item.room ? item.room : item)
  );

  const handleRoomClick = (room, available) => {
    if (available) {
      navigate("/reservation-form", { 
        state: { room },
        replace: true
      });
      window.scrollTo(0, 0);
    } else {
      setSelectedRoom(room);
      setShowSuggestionModal(true);
    }
  };

  // Helper function to determine which side a room belongs to
  const getRoomSide = (room) => {
    if (!room) return null;
    if (room.startsWith('A')) return 'Side A (Left)';
    if (room.startsWith('B')) return 'Side B';
    if (room.startsWith('F')) return 'Front';

    // Extract the last two digits for the room number
    const match = room.match(/(\d{2,3})$/);
    if (match) {
      const num = parseInt(match[1].slice(-2), 10); // last two digits
      if (num >= 1 && num <= 5) return 'Side A (Left)';
      if (num >= 6 && num <= 9) return 'Front';
      if (num >= 10 && num <= 13) return 'Side A (Right)';
    }
    return null;
  };

  const getAvailableRoomsInSide = (side) => {
    // Group available rooms by floor
    const grouped = {};
    Object.entries(roomData).forEach(([floor, rooms]) => {
      rooms.forEach((roomData) => {
        if (roomData && roomData.room && roomData.available) {
          const roomSide = getRoomSide(roomData.room);
          if (roomSide === side) {
            if (!grouped[floor]) grouped[floor] = [];
            grouped[floor].push(roomData.room);
          }
        }
      });
    });
    return grouped;
  };

  const SuggestionModal = ({ isOpen, onClose, room }) => {
    const [bodyOverflow, setBodyOverflow] = React.useState('');
    React.useEffect(() => {
      if (isOpen) {
        setBodyOverflow(document.body.style.overflow);
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = bodyOverflow || '';
      }
      return () => {
        document.body.style.overflow = bodyOverflow || '';
      };
    }, [isOpen, bodyOverflow]);

    if (!isOpen || !room) return null;

    const roomSide = getRoomSide(room);
    if (!roomSide) {
      return (
        <div className="modal-overlay">
          <div className="modern-modal">
            <div className="modal-header">
              <div className="modal-title">Room {room} is Occupied</div>
              <button className="modal-close" aria-label="Close suggestions" onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="no-rooms">Unable to determine the side for this room.</div>
            </div>
            <div className="modern-actions">
              <button className="back-btn" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      );
    }

    const availableRoomsByFloor = getAvailableRoomsInSide(roomSide);
    // Sort floors in ascending order (numeric sort)
    const floorsWithRooms = Object.keys(availableRoomsByFloor).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    });

    // Side color mapping for badge
    const sideColors = {
      'Side A (Left)': '#4e8d7c',
      'Side A (Right)': '#3b5998',
      'Front': '#b48a3e',
      'Side B': '#b91c1c',
    };

    return (
      <div className="modal-overlay">
        <button className="modal-close" aria-label="Close suggestions" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="modern-modal modern-glass">
          <div className="modal-header modern-header">
            <div className="modal-title modern-title">
              <span className="side-badge" style={{background: sideColors[roomSide] || '#888'}}>{roomSide}</span>
              <span style={{fontWeight: 600, fontSize: '1.1rem'}}>Room {room} is occupied</span>
            </div>
          </div>
          <div className="modal-body modern-body">
            <div className="modal-tip modern-tip">
              <FontAwesomeIcon icon={faDoorClosed} style={{color: '#b91c1c', marginRight: 8}} />
              Sorry, this room is not available. Here are all available rooms on <b>{roomSide}</b>:
            </div>
            <hr className="modal-divider modern-divider" />
            <div className="grouped-list modern-grouped-list">
              {floorsWithRooms.length > 0 ? (
                floorsWithRooms.map(floor => (
                  <div key={floor} className="floor-group modern-floor-group">
                    <div className="floor-label modern-floor-label">{floor}</div>
                    <div className="rooms-grid modern-grid">
                      {availableRoomsByFloor[floor].map(availableRoom => (
                        <div key={availableRoom} className="room-card modern-room-card">
                          <div className="room-number modern-room-number">{availableRoom}</div>
                          <button 
                            className="reserve-btn modern-reserve-btn"
                            onClick={() => {
                              navigate("/reservation-form", { 
                                state: { room: availableRoom },
                                replace: true
                              });
                              window.scrollTo(0, 0);
                            }}
                          >
                            Reserve
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-rooms modern-no-rooms">
                  No available rooms in {roomSide} at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  console.log('Hovered room:', hoveredRoom);

  return (
    <div className="virtual-tour-container">
      <div className="tour-header">
        <h1>Room Availability</h1>
        <p>Select a floor to see available rooms and their status.</p>
      </div>
      <div className="room-availability-container">
        <select
          className="floor-selector"
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
        >
          {floors.map(floor => (
            <option key={floor} value={floor}>{floor}</option>
          ))}
        </select>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color occupied"></div>
            <span>Occupied</span>
          </div>
        </div>
        <div className="reservation-note">
          <span>Reservation Tip:</span> Click on any <span>green room</span> to proceed with your reservation.
        </div>
        <div className="floorplan-wrapper" style={{ position: 'relative' }}>
          {/* Red: Side B (top) */}
          <div className="room-label-simple room-label-sideb">Side B Units</div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
            {/* Yellow: Side A (left) */}
            <div className="room-label-simple room-label-sidea">Side A Units</div>
            <div style={{ flex: 1 }}>
              <div className="parent">
                {Array.from({ length: 20 }, (_, index) => {
                  const data = roomData[selectedFloor]?.[index];
                  if (index < 13 && data) {
                    const { room, available } = data;
                    return (
                      <div
                        key={index}
                        className={`room-box ${available ? "available" : "occupied"} div${index + 1}`}
                        onMouseEnter={() => setHoveredRoom(room)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        onTouchStart={() => setHoveredRoom(room)}
                        onTouchEnd={() => setHoveredRoom(null)}
                        onClick={() => handleRoomClick(room, available)}
                        style={{ cursor: "pointer", overflow: "visible" }}
                      >
                        <FontAwesomeIcon icon={available ? faDoorOpen : faDoorClosed} />
                        {room}
                        {hoveredRoom === room && (
                          <div className="tooltip" style={{ visibility: 'visible', opacity: 1, zIndex: 100 }}>
                            {available
                              ? "Available — click to reserve!"
                              : "Occupied — click it to suggest more rooms with this side"}
                          </div>
                        )}
                      </div>
                    );
                  } else if (index < 19) {
                    return <div key={index} className={`hallway div${index + 1}`}>Hallway</div>;
                  } else {
                    return (
                      <div key={index} className="stairs div20">
                        <FontAwesomeIcon icon={faStairs} />
                        Stairs
                      </div>
                    );
                  }
                })}
              </div>
              {/* Blue: Front (bottom, after grid) */}
              <div className="room-label-simple room-label-front">Front Units</div>
            </div>
            {/* Yellow: Side A (right) */}
            <div className="room-label-simple room-label-sidea-right">Side A Units</div>
          </div>
        </div>
      </div>
      <SuggestionModal 
        isOpen={showSuggestionModal}
        onClose={() => setShowSuggestionModal(false)}
        room={selectedRoom}
      />
    </div>
  );
};

export default RoomAvailability; 