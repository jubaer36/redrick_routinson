import {
  Box,
  SimpleGrid,
  Button,
  Text,
  Spinner,
  Input,
  HStack,
  IconButton,
  useToast,
  Flex,
  Badge
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { db } from "../../firebase.js";
import "./AdminGenerateSeatPlan.css";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

const GenerateSeatPlan = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomNo, setNewRoomNo] = useState("");
  const [newTotalSeats, setNewTotalSeats] = useState("");
  const [addRoomNo, setAddRoomNo] = useState("");
  const [addTotalSeats, setAddTotalSeats] = useState("");
  const [showAddRoom, setShowAddRoom] = useState(false); // Toggle state for showing the input field
  const [totalStudentDay, setTotalStudentDay] = useState(0);
  const [totalStudentMorning, setTotalStudentMorning] = useState(0);
  const [totalSeats, setTotalSeats] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showLessStudent, setShowLessStudent] = useState(null);

  const handleGenerateClick = (shift) => {
    if (totalStudentDay <= totalSeats && totalStudentMorning <= totalSeats) {
      setSelectedShift(shift);
      setShowConfirmation(true);
    }
    else {
      setShowLessStudent(true);
    }

  };
  const handleConfirmGeneration = async () => {
    setShowConfirmation(false);
    if (selectedShift == "summer") {
      handleSeatPlanSummerClick();
    }
    if (selectedShift == "winter") {
      handleSeatPlanWinterClick();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total students
        const totalStudentDoc = await getDocs(collection(db, "totalStudent"));
        if (!totalStudentDoc.empty) {
          const studentData = totalStudentDoc.docs[0].data(); // Assuming one document
          setTotalStudentDay(studentData.totalStudentDay || 0);
          setTotalStudentMorning(studentData.totalStudentMorning || 0);
        }

        // Fetch total seats
        const querySnapshot = await getDocs(collection(db, "seat_plan_rooms"));
        let seatsCount = 0;
        const roomList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          seatsCount += Number(data.total_seats) || 0; // Sum total seats
          return { id: doc.id, ...data };
        });

        setTotalSeats(seatsCount);
        setRooms(roomList.sort((a, b) => a.room_no.localeCompare(b.room_no)));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchData();
  }, [rooms]);


  const handleSeatPlanSummerClick = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/seat-plan-admin-summer"
      );

      console.log("✅ Full Response:", response.data); // Debug entire response
      setMessage("✅ Summer seat plan successfully generated!");
    } catch (error) {
      console.error(
        "❌ Error in seat plan admin frontend: ",
        error.response?.data?.message || error.message
      );
      setMessage("❌ Failed to generate Summer seat plan. Try again.");
    }
    setLoading(false);
  };

  const handleSeatPlanWinterClick = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/seat-plan-admin-winter"
      );

      console.log("✅ Full Response:", response.data); // Debug entire response

      setMessage("✅ Winter seat plan successfully generated!");
    } catch (error) {
      console.error(
        "❌ Error in seat plan admin frontend: ",
        error.response?.data?.message || error.message
      );
      setMessage("❌ Failed to generate Summer seat plan. Try again.");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (message.includes("successfully generated")) {
      setTimeout(() => navigate("/admin-home/admin-manage-seat-plan"));
    }
  }, [message, navigate]);

  // Fetch rooms from Firebase
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "seat_plan_rooms"));
        const roomList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => a.room_no.localeCompare(b.room_no)); // Sort rooms as string
        setRooms(roomList);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setRoomsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Handle selecting/deselecting a room
  const handleRoomSelect = (room) => {
    if (selectedRoom && selectedRoom.id === room.id) {
      setSelectedRoom(null); // Deselect if clicked again
    } else {
      setSelectedRoom(room);
      setNewRoomNo(room.room_no);
    }
  };

  // Handle deleting a room from Firebase
  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;
    try {
      await deleteDoc(doc(db, "seat_plan_rooms", selectedRoom.id));
      setRooms(rooms.filter((room) => room.id !== selectedRoom.id));
      setSelectedRoom(null);
      toast({
        title: "Room deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete room.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("❌ Error deleting room:", error);
    }
  };

  // Handle updating a room number in Firebase
  const handleEditRoom = async () => {
    if (!selectedRoom || !newRoomNo.trim() || !newTotalSeats.trim()) return;
    if (parseInt(newTotalSeats) % 2 !== 0) {
      toast({
        title: "Only even number of seats are permissible.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const roomRef = doc(db, "seat_plan_rooms", selectedRoom.id);
      await updateDoc(roomRef, {
        room_no: newRoomNo,
        total_seats: newTotalSeats,
      });
      setRooms(
        rooms.map((room) =>
          room.id === selectedRoom.id
            ? { ...room, room_no: newRoomNo, total_seats: newTotalSeats }
            : room
        )
      );
      setSelectedRoom(null);
      toast({
        title: "Room updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update room.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle adding a new room
  // const handleAddRoom = async () => {
  //     if (!addRoomNo.trim()) return;
  //     try {
  //         const newRoomRef = doc(collection(db, "seat_plan_rooms"));
  //         await setDoc(newRoomRef, { room_no: addRoomNo });
  //         setRooms([...rooms, { id: newRoomRef.id, room_no: addRoomNo }].sort((a, b) => a.room_no.localeCompare(b.room_no)));
  //         setAddRoomNo("");
  //         toast({ title: "Room added successfully!", status: "success", duration: 3000, isClosable: true });
  //     } catch (error) {
  //         toast({ title: "Failed to add room.", status: "error", duration: 3000, isClosable: true });
  //         console.error("❌ Error adding room:", error);
  //     }
  // };
  const handleAddRoom = async () => {
    if (!addRoomNo.trim() || !addTotalSeats.trim()) return;
    if (parseInt(addTotalSeats) % 2 !== 0) {
      toast({
        title: "Only even number of seats are permissible.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const newRoomRef = doc(collection(db, "seat_plan_rooms"));
      await setDoc(newRoomRef, {
        room_no: addRoomNo,
        total_seats: addTotalSeats,
      });
      setRooms(
        [
          ...rooms,
          { id: newRoomRef.id, room_no: addRoomNo, total_seats: addTotalSeats },
        ].sort((a, b) => a.room_no.localeCompare(b.room_no))
      );
      setAddRoomNo("");
      setAddTotalSeats("");
      toast({
        title: "Room added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to add room.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("❌ Error updating room:", error);
    }
  };
  return (

    <div className="container">

      <Flex align="center" justify="space-between" className="header">
        <h1 className="title">Generate Seat Plan</h1>
        <IconButton
          variant="ghost"
          icon={showAddRoom ? <MinusIcon boxSize={4} /> : <AddIcon boxSize={4} />}
          colorScheme={showAddRoom ? "red" : "green"}
          onClick={() => setShowAddRoom(!showAddRoom)}
          width="80px"
          marginBottom="20px"
        />
      </Flex>

      {showConfirmation && (
        <div className="confirmation-popup">
          <Box className="popup-box">
            <Text fontSize="lg" fontWeight="bold">Confirm Generation</Text>
            <Text>Are you sure you want to generate the {selectedShift} semester seat plan?</Text>
            <HStack spacing={4} marginTop={3}>
              <Button backgroundColor="rgb(242, 140, 140)" onClick={() => setShowConfirmation(false)}>Cancel</Button>
              <Button backgroundColor="rgb(138, 183, 147)" onClick={handleConfirmGeneration}>Proceed</Button>
            </HStack>
          </Box>
        </div>
      )}
      {showLessStudent && (
        <div className="confirmation-popup">
          <Box className="popup-box">
            <Text fontSize="lg" fontWeight="bold">Less Seats</Text>
            <HStack spacing={4} marginTop={3}>
              <Button colorScheme="red" onClick={() => setShowLessStudent(false)}>OK</Button>
            </HStack>
          </Box>
        </div>
      )}

      {showAddRoom && (
        <HStack className="add-room-container">
          <Input
            type="text"
            value={addRoomNo}
            onChange={(e) => setAddRoomNo(e.target.value)}
            placeholder="Enter room number"
            className="input-field"
          />
          <Input
            type="number"
            value={addTotalSeats}
            onChange={(e) => setAddTotalSeats(e.target.value)}
            placeholder="Total seats"
            className="input-field"
          />
          <Button colorScheme="blue" onClick={handleAddRoom} marginBottom="25px">
            Add Room
          </Button>
        </HStack>
      )}

      {loading && (
        <div className="loading-overlay">
          <Spinner size="xl" />
          <p>Generating Seat Plan, please wait...</p>
        </div>
      )}
      <Flex
        align="center"
        justify="space-between"
        bg="blue.50"
        p={4}
        borderRadius="md"
        boxShadow="sm"
        className="header"
      >
        <Box textAlign="center" flex={1}>
          <Text fontSize="lg" fontWeight="bold" color="blue.800">
            Total Day Students:{" "}
            <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
              {totalStudentDay}
            </Badge>
          </Text>
        </Box>
        <Box textAlign="center" flex={1}>
          <Text fontSize="lg" fontWeight="bold" color="blue.800">
            Total Morning Students:{" "}
            <Badge colorScheme="green" fontSize="lg" px={3} py={1}>
              {totalStudentMorning}
            </Badge>
          </Text>
        </Box>
        <Box textAlign="center" flex={1}>
          <Text fontSize="lg" fontWeight="bold" color="blue.800">
            Total Seats:{" "}
            <Badge colorScheme="purple" fontSize="lg" px={3} py={1}>
              {totalSeats}
            </Badge>
          </Text>
        </Box>
      </Flex>


      <HStack justify="space-between" width="100%" className="title-row">
        <h2 className="subtitle">Available Rooms</h2>
        {selectedRoom && (
          <HStack spacing={2} className="room-actions">
            <Input
              type="text"
              value={newRoomNo}
              onChange={(e) => setNewRoomNo(e.target.value)}
              placeholder="Enter new room number"
              className="input-field"
            />
            <Input
              type="number"
              value={newTotalSeats}
              onChange={(e) => setNewTotalSeats(e.target.value)}
              placeholder="Enter total seats"
              className="input-field"
            />
            <Button
              backgroundColor="rgb(169, 195, 221)"
              onClick={handleEditRoom}
              size="md" 
              _hover={{ opacity: 0.9 }} 
              marginBottom="25px"
              
            >
              Save
            </Button>
            <Button
              backgroundColor="rgb(238, 153, 153)"
              onClick={handleEditRoom}
              size="md" 
              _hover={{ opacity: 0.9 }} 
              marginBottom="25px"
            >
              Remove
            </Button>
            <Button
              backgroundColor="rgb(195, 194, 194)"
              onClick={handleEditRoom}
              size="md" 
              _hover={{ opacity: 0.9 }} 
              marginBottom="25px"
            >
              Cancel
            </Button>
          </HStack>
        )}
      </HStack>

      {roomsLoading ? (
        <Spinner size="lg" />
      ) : (
        <SimpleGrid
          columns={{ base: 2, md: 4, lg: 6 }}
          spacing={5}
          className="room-grid"
        >
          {rooms.map((room) => (
            <Box
              key={room.id}
              className={`room-box ${selectedRoom?.id === room.id ? "selected" : ""
                }`}
              onClick={() => handleRoomSelect(room)}
            >
              <Text fontSize="lg" fontWeight="bold">
                Room {room.room_no} ({room.total_seats || "N/A"} seats)
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <div className="button-container">
        <Button
          onClick={() => handleGenerateClick("summer")}
          backgroundColor="rgb(169, 201, 245)"
          isLoading={loading}
        >
          Generate Summer Semester
        </Button>
        <Button
          onClick={() => handleGenerateClick("winter")}
          backgroundColor="rgb(211, 200, 248)"
          isLoading={loading}
        >
          Generate Winter Semester
        </Button>
      </div>

      {message && <p className="status-message">{message}</p>}
    </div>

  );
};

export default GenerateSeatPlan;
