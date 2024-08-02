"use client";

import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  query,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "400px",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: 5,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [alert, setAlert] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenSearch = () => setOpenSearch(true);
  const handleCloseSearch = () => setOpenSearch(false);

  const [itemName, setItemName] = useState("");

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
    // Also clear search results if pantry is updated
    setSearchResults([]);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    await deleteDoc(docRef);
    await updatePantry();
  };

  const search = async (item) => {
    if (!item.trim()) {
      // Reset search results if input is empty
      setSearchResults([]);
      return;
    }
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSearchResults([{ name: item, ...docSnap.data() }]);
    } else {
      setSearchResults([]);
    }
  };

  const reduceItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      sx={{
        backgroundImage: `url(/bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
        overflow: "hidden",
      }}
    >
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            fontFamily={"Quicksand Variable"}
            textAlign="center"
          >
            Add Item
          </Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleCloseAdd();
              }}
              sx={{
                backgroundColor: "rgba(193,177,160, 0.5)",
                color: "rgba(40,40,40, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(89,70,48, 0.6)",
                  color: "white",
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openSearch}
        onClose={handleCloseSearch}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            fontFamily={"Quicksand Variable"}
            textAlign="center"
          >
            Search Item
          </Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                search(itemName);
                setItemName("");
                handleCloseSearch();
              }}
              sx={{
                backgroundColor: "rgba(193,177,160, 0.5)",
                color: "rgba(40,40,40, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(89,70,48, 0.6)",
                  color: "white",
                },
              }}
            >
              Search
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={2}
        sx={{
          width: "100%",
          maxWidth: "500px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpenAdd}
          sx={{
            backgroundColor: "rgba(193,177,160, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(89,70,48, 0.6)",
              color: "white",
            },
            width: "100%",
            maxWidth: "240px",
          }}
        >
          Add
        </Button>
        <Button
          variant="contained"
          onClick={handleOpenSearch}
          sx={{
            backgroundColor: "rgba(193,177,160, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(89,70,48, 0.6)",
              color: "white",
            },
            width: "100%",
            maxWidth: "240px",
          }}
        >
          Search
        </Button>
      </Stack>

      <Box
        width="100%"
        maxWidth="600px"
        height="auto"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        borderRadius={4}
        marginBottom={2}
        sx={{
          backgroundColor: "rgba(193,177,160, 0.5)",
        }}
      >
        <Typography
          variant={"h2"}
          color={"#333"}
          textAlign={"center"}
          fontFamily={"Quicksand Variable"}
          paddingY={2}
          fontSize={{ xs: "h4.fontSize", sm: "h2.fontSize" }}
        >
          Pantry Items
        </Typography>
      </Box>

      <Box
        width="100%"
        maxWidth="600px"
        height="300px"
        sx={{
          overflowX: "auto",
          overflowY: "auto",
          px: 2,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Stack spacing={2}>
          {(searchResults.length > 0 ? searchResults : pantry).map(
            ({ name, count }) => (
              <Box
                key={name}
                width="100%"
                minHeight="70px"
                display={"flex"}
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                borderRadius="16px"
                paddingX={2}
                paddingY={1}
                sx={{
                  backgroundColor: "rgba(255,255,255, 0.7)",
                }}
              >
                <Stack
                  spacing={1}
                  width="100%"
                  textAlign={{ xs: "center", sm: "left" }}
                >
                  <Typography
                    variant={"h4"}
                    color={"#333"}
                    fontFamily={"Quicksand Variable"}
                    fontSize={{ xs: "h6.fontSize", sm: "h4.fontSize" }}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography
                    variant={"h5"}
                    color={"#333"}
                    fontFamily={"Quicksand Variable"}
                    fontSize={{ xs: "body1.fontSize", sm: "h5.fontSize" }}
                  >
                    Available: {count}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <IconButton aria-label="add" onClick={() => addItem(name)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="remove"
                    onClick={() => reduceItem(name)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => removeItem(name)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            )
          )}
        </Stack>
      </Box>
    </Box>
  );
}
