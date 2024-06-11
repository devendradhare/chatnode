import { useState, useEffect, useRef } from "react";
import Style from "./Structure.module.css";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { default as MuiAvatar } from "@mui/material/Avatar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SendIcon from "@mui/icons-material/Send";

import { useContacts } from "../hooks/useContact.js";
import { useContactContext } from "../context/contactContext.jsx";
import { useAuthContext } from "../context/authContext.jsx";
import useLogout from "../hooks/useLogout.js";
import useSendMessage from "../hooks/useSendMessage.js";
import useGetMessages from "./../hooks/useGetMessages";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Avatar = ({ profilePic, isOnline }) => {
  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      variant={isOnline ? "dot" : ""}
    >
      <MuiAvatar alt="Remy Sharp" src={profilePic} />
    </StyledBadge>
  );
};

const Profile = () => {
  const { authUser } = useAuthContext();
  function handleProfileClick() {
    console.log("profileClick");
    document.getElementById("my_modal_3").showModal();
  }
  return (
    <div className=" h-20 p-4 flex items-center justify-between">
      <h1 className="text-lg font-bold from-neutral-100 text-slate-50 uppercase">
        chatnode
      </h1>
      <Button onClick={() => handleProfileClick()}>
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-300">{authUser.username}</h2>
          <Avatar profilePic={authUser.profilePicture} isOnline={true} />
        </div>
      </Button>
    </div>
  );
};

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
    <label className="input input-bordered flex items-center gap-2 bg-[#5a5c66] border-none m-4 rounded h-16">
      <input
        type="text"
        className="grow"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4 opacity-70"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
    </label>
  );
};

const Contacts = ({ searchQuery }) => {
  const { contacts } = useContactContext();
  const { loading, getContacts } = useContacts();
  const [filteredUsers, setFilteredUsers] = useState(contacts || []);

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    if (contacts === null) return;
    const results = contacts.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchQuery, contacts]);

  return (
    <div className="h-fit grid grid-cols-1 divide-y divide-slate-500 overflow-scroll">
      {contacts && contacts.length
        ? filteredUsers.map((c) => <Contact key={c._id} contact={c} />)
        : "no contact found"}
    </div>
  );
};

const Contact = ({ contact }) => {
  const { setSelectedContact, selectedContact } = useContactContext();
  useEffect(() => {
    return () => {
      setSelectedContact(null);
    };
  }, []);
  return (
    <div
      className={`p-4 flex items-center gap-4 relative ${
        selectedContact?._id == contact._id ? "bg-gray-700" : ""
      }`}
      onClick={() =>
        setSelectedContact((prev) =>
          prev?._id == contact._id ? null : contact
        )
      }
    >
      {selectedContact?._id == contact._id && (
        <div className="h-[100%] w-1 bg-green-600 absolute left-0"></div>
      )}
      <Avatar profilePic={contact.profilePicture} isOnline={true} />
      <div>
        <h3 className="font-semibold text-gray-200">{contact.username}</h3>
        <p>last message</p>
      </div>
    </div>
  );
};

const Sidebar = ({ toggleSidebar, handleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <section
      className={`${Style.sidebar} ${toggleSidebar ? Style.sidebarActive : ""}`}
    >
      <Profile />
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Contacts searchQuery={searchQuery} />

      {/* close sidebar button for small devices */}
      <div className="md:hidden">
        <IconButton
          className={`${toggleSidebar ? "" : Style.sidebarActive}`}
          aria-label="close"
          onClick={() => handleSidebar()}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </section>
  );
};

const Bubble = ({ message, position, time, profilePic }) => {
  function showTime(mongoTime) {
    const timestamp = mongoTime;
    const date = new Date(timestamp);
    // IST is UTC+5:30
    const istOffset = 5.5 * 60 * 60 * 1000; // milliseconds
    const istDate = new Date(date.getTime() + istOffset);

    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
  }
  return (
    <div className={`chat ${position}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={profilePic} />
        </div>
      </div>
      <div className="chat-bubble">{message}</div>
      <div className="chat-footer opacity-50">
        <time className="text-xs opacity-50">{showTime(time)}</time>
      </div>
    </div>
  );
};

const ChatProfile = ({ handleSidebar }) => {
  const {
    contacts,
    setSelectedContact,
    selectedContact,
    messages,
    setMessages,
  } = useContactContext();

  return (
    <div className=" min-h-[75px] flex items-center border-b border-gray-600">
      <Button
        className="h-[100%] hidden"
        variant="text"
        color="primary"
        onClick={() => handleSidebar()}
        sx={{ minWidth: 20 }}
      >
        <ArrowBackIosIcon aria-label="back" />
      </Button>
      <div className="flex gap-4 items-center">
        <Avatar profilePic={selectedContact?.profilePicture} isOnline={true} />
        <div className="">
          <h3 className="font-semibold text-slate-200">
            {selectedContact?.username}
          </h3>
          <p className="italic ">online</p>
        </div>
      </div>
    </div>
  );
};

const ChatBubble = () => {
  const { loading, messages } = useGetMessages();
  const { authUser } = useAuthContext();
  const { contacts, setSelectedContact, selectedContact } = useContactContext();
  const lastMsgRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div
      className={`flex-grow overflow-scroll flex flex-col p-4 ${
        loading ? "justify-center" : ""
      }`}
    >
      {loading ? (
        <span className="loading loading-dots loading-lg self-center"></span>
      ) : messages.length ? (
        messages.map((message) => (
          <div key={message._id} ref={lastMsgRef}>
            <Bubble
              message={message.message}
              position={
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }
              time={message.createdAt}
              profilePic={
                message.senderId === authUser._id
                  ? authUser.profilePicture
                  : selectedContact.profilePicture
              }
            />
          </div>
        ))
      ) : (
        "no messages found"
      )}
    </div>
  );
};

const InputMessageBox = () => {
  const [inputMessage, setInputMessage] = useState("");
  const { contacts, setSelectedContact, selectedContact } = useContactContext();
  const { loading, sendMessage } = useSendMessage();
  function handleSendMessage() {
    console.log(inputMessage);
    sendMessage(inputMessage);
    setInputMessage("");
  }
  return (
    <label className="input input-bordered flex items-center gap-2 !outline-none pr-0 min-h-[50px]">
      <input
        type="text"
        className="grow"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <Button
        variant="text"
        color="primary"
        sx={{ height: "100%" }}
        onClick={() => handleSendMessage()}
      >
        {loading ? (
          <span className="loading loading-dots loading-sm"></span>
        ) : (
          <SendIcon />
        )}
      </Button>
    </label>
  );
};

// eslint-disable-next-line react/prop-types
const ChatWindow = ({ handleSidebar }) => {
  const { contacts, setSelectedContact, selectedContact } = useContactContext();

  return (
    <section
      className={`${Style.windoww} flex-grow flex flex-col overflow-hidden `}
    >
      {selectedContact !== null ? (
        <>
          <ChatProfile handleSidebar={handleSidebar} />
          <ChatBubble />
          <InputMessageBox />
        </>
      ) : (
        "select an contact"
      )}
    </section>
  );
};

const Structure = () => {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const { loading, logout } = useLogout();

  function handleSidebar() {
    setToggleSidebar((prev) => !prev);
  }

  return (
    <div className={Style.body}>
      <main className={Style.structure}>
        <Sidebar toggleSidebar={toggleSidebar} handleSidebar={handleSidebar} />
        <ChatWindow handleSidebar={handleSidebar} />
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click on ✕ button to close</p>
            <Button variant="outlined" color="primary" onClick={() => logout()}>
              logout
            </Button>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default Structure;
