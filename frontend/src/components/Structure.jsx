import { useState, useEffect, useRef } from "react";
import Style from "./Structure.module.css";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { default as MuiAvatar } from "@mui/material/Avatar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";

import { useContacts } from "../hooks/useContact.js";
import { useContactContext } from "../context/contactContext.jsx";
import { useAuthContext } from "../context/authContext.jsx";
import useLogout from "../hooks/useLogout.js";
import useSendMessage from "../hooks/useSendMessage.js";
import useUpdateProfile from "./../hooks/useUpdateProfile";
import { useSocketContext } from "./../context/socketContext.jsx";
import { Toaster } from "react-hot-toast";

// icons
import chatnodeIcon from "../assets/icons/chatnode.png";

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

// eslint-disable-next-line react/prop-types
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
// eslint-disable-next-line react/prop-types
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

// eslint-disable-next-line react/prop-types
const Contacts = ({ searchQuery, setToggleSidebar }) => {
  const { contacts } = useContactContext();
  const { loading, getContacts } = useContacts();
  const [filteredUsers, setFilteredUsers] = useState(contacts || []);
  const { onlineUsers } = useSocketContext();

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
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-dots loading-lg self-center"></span>
        </div>
      ) : contacts && contacts.length ? (
        filteredUsers.map((c) => (
          <Contact
            key={c._id}
            contact={c}
            isOnline={onlineUsers.includes(c._id)}
            setToggleSidebar={setToggleSidebar}
          />
        ))
      ) : (
        "no contact found"
      )}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const Contact = ({ contact, isOnline, setToggleSidebar }) => {
  const {  setSelectedContact, selectedContact } = useContactContext();
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
        setSelectedContact((prev) => {
          setToggleSidebar(prev ? true : false);
          return prev?._id == contact._id ? null : contact;
        })
      }
    >
      {selectedContact?._id == contact._id && (
        <div className="h-[100%] w-1 bg-green-600 absolute left-0"></div>
      )}
      <Avatar profilePic={contact.profilePicture} isOnline={isOnline} />
      <div>
        <h3 className="font-semibold text-gray-200">{contact.username}</h3>
        <p>{contact.messages[contact.messages.length - 1]?.message}</p>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const Sidebar = ({ toggleSidebar, setToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <section
      className={`${Style.sidebar} ${toggleSidebar ? "" : Style.sidebarActive}`}
    >
      <Profile />
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Contacts searchQuery={searchQuery} setToggleSidebar={setToggleSidebar} />
    </section>
  );
};

// eslint-disable-next-line react/prop-types
const Bubble = ({ message, position, time, profilePic, shake }) => {
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
      <div className={`chat-bubble ${shake}`}>{message}</div>
      <div className="chat-footer opacity-50">
        <time className="text-xs opacity-50">{showTime(time)}</time>
      </div>
    </div>
  );
};

const ChatBubble = () => {
  const { authUser } = useAuthContext();
  const { contacts,selectedContact } = useContactContext();
  const lastMsgRef = useRef(null);
  const loading = false;

  useEffect(() => {
    setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [contacts, selectedContact]);

  return (
    <div
      className={`flex-grow overflow-scroll flex flex-col p-4 ${
        loading ? "justify-center" : ""
      }`}
    >
      {loading ? (
        <span className="loading loading-dots loading-lg self-center"></span>
      ) : selectedContact.messages.length ? (
        selectedContact.messages.map((message) => (
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
              shake={message.shouldShake ? "shake" : ""}
            />
          </div>
        ))
      ) : (
        <div className="h-full flex items-center justify-center">
          {"👋 Say hello to " + selectedContact.username}
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const ChatProfile = ({ setToggleSidebar }) => {
  const { onlineUsers } = useSocketContext();
  const { setSelectedContact, selectedContact } = useContactContext();

  function handleBackBtnClick() {
    setSelectedContact(null);
    setToggleSidebar(true);
  }

  return (
    <div className=" min-h-[75px] flex items-center border-b border-gray-600">
      <Button
        className="h-[100%] hidden"
        variant="text"
        color="primary"
        onClick={() => handleBackBtnClick()}
        sx={{ minWidth: 20 }}
      >
        <ArrowBackIosIcon aria-label="back" />
      </Button>
      <div className="flex gap-4 items-center">
        <Avatar
          profilePic={selectedContact?.profilePicture}
          isOnline={onlineUsers.includes(selectedContact?._id)}
        />
        <div className="">
          <h3 className="font-semibold text-slate-200">
            {selectedContact?.username}
          </h3>
          <p className="italic ">
            {onlineUsers.includes(selectedContact?._id) ? "online" : "offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

const InputMessageBox = () => {
  const [inputMessage, setInputMessage] = useState("");
  const { contacts, setSelectedContact, selectedContact } = useContactContext();
  const { loading, sendMessage } = useSendMessage();
  function handleSendMessage() {
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
const ChatWindow = ({ setToggleSidebar }) => {
  const { selectedContact } = useContactContext();

  return (
    <section
      className={`${Style.windoww} flex-grow flex flex-col overflow-hidden `}
    >
      {selectedContact !== null ? (
        <>
          <ChatProfile setToggleSidebar={setToggleSidebar} />
          <ChatBubble />
          <InputMessageBox />
        </>
      ) : (
        <div className="h-full flex justify-center items-center flex-col opacity-[90%]">
          <img src={chatnodeIcon} alt="chatnode icon" />
          <p className="text-gray-500">Select a chat to read messages</p>
        </div>
      )}
    </section>
  );
};

const UpdateProfile = () => {
  const { authUser } = useAuthContext();
  const { loading, logout } = useLogout();
  const { loading: updateLoading, updateProfile } = useUpdateProfile();

  const [inputs, setInputs] = useState({
    fullname: authUser.fullname,
    username: authUser.username,
    passowrd: "",
    confirmPassword: "",
  });

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box pt-1">
        {/* close button at top right corner */}
        <form
          method="dialog"
          className="sticky top-0 h-0 flex flex-row-reverse"
        >
          <button className="btn btn-sm btn-circle btn-ghost ">
            <div className="flex items-center gap-2">
              <kbd className="kbd kbd-sm">ESC</kbd>✕
            </div>
          </button>
        </form>

        <h3 className="font-bold text-lg pb-4 sticky top-0">Profile</h3>
        <div className="flex gap-3 justify-center items-center flex-wrap">
          <MuiAvatar
            variant="circular"
            src={authUser?.profilePicture}
            alt="user profile picture"
            sx={{ width: "70px", height: "70px" }}
          />
          <div>
            <h3 className="font-semibold text-gray-200 text-xl pl-2">
              {authUser?.username}
            </h3>
            <Button variant="text" color="primary" onClick={() => logout()}>
              <p>logout </p>
              <LogoutIcon sx={{ fontSize: 18, marginLeft: "10px" }} />
            </Button>
          </div>
        </div>

        <div className="flex gap-3 justify-center items-center flex-wrap p-4">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text uppercase">fullname</span>
            </div>
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full max-w-xs"
              value={inputs.fullname}
              onChange={(e) =>
                setInputs({ ...inputs, fullname: e.target.value })
              }
            />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text uppercase">Username</span>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Username"
                value={inputs.username}
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
              />
            </label>
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text uppercase">New Password</span>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                className="grow"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
              />
            </label>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text uppercase">Confirm Password</span>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                className="grow"
                value={inputs.confirmPassword}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </label>
          </label>
          <label className="w-full max-w-xs flex flex-row-reverse">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                updateProfile(inputs);
              }}
            >
              update
            </Button>
          </label>
        </div>
      </div>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            backgroundColor: "rgba(255,255,255, .9)",
            // color: "#713200",
            zIndex: "99",
          },
        }}
      />
    </dialog>
  );
};
const Structure = () => {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  return (
    <div className={Style.body}>
      <main className={Style.structure}>
        <Sidebar
          toggleSidebar={toggleSidebar}
          setToggleSidebar={setToggleSidebar}
        />
        <ChatWindow setToggleSidebar={setToggleSidebar} />
        <UpdateProfile />
      </main>
    </div>
  );
};

export default Structure;
