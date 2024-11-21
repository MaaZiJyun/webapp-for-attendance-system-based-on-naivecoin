import { useEffect, useState } from "react";
import { UserClass } from "../_modules/UserClass";
import { PlusIcon } from "@heroicons/react/24/outline";
import { EventClass } from "../_modules/EventClass";
import PasswordWidget from "./PasswordWidget";

interface ventFormProps {
  userInfo: UserClass;
}
const EventForm: React.FC<ventFormProps> = ({ userInfo }) => {
  const [user, setUser] = useState<UserClass>(userInfo);
  const [loading, setLoading] = useState<boolean>(true);

  // Define state for each form field
  const [assignedPassword, setAssignedPassword] = useState("");
  const [eventName, setEventName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [remark, setRemark] = useState("");
  const [show, setShow] = useState("");
  const [display, setDisplay] = useState(false);

  // Handle change for each input field
  const handlePasswordChange = (e: any) => setAssignedPassword(e.target.value);
  const handleEventNameChange = (e: any) => setEventName(e.target.value);
  const handleDeadlineChange = (e: any) => setDeadline(e.target.value);
  const handleRemarkChange = (e: any) => setRemark(e.target.value);

  const handlePasswordSubmit = (password: string) => {
    setAssignedPassword(password);
  };

  useEffect(() => {
    if (assignedPassword) {
      console.log("Password assigned:", assignedPassword);
      createEvent();
    }
  }, [assignedPassword]);

  const changeDisplay = () => {
    setDisplay(!display);
  };

  const createEvent = async () => {
    if (user) {
      const data = await createTransaction(
        assignedPassword,
        eventName,
        deadline,
        remark
      );
      if (data) {
        setShow(data);
        changeDisplay();
      }
    } else {
      throw new Error(`Error: Failed to add address`);
    }
  };

  const createTransaction = async (
    password: string,
    eventId: string,
    deadline: string,
    remark: string
  ) => {
    // 创建请求体
    const fromAddress = user?.address;
    const toAddress = user?.address;
    const walletId = user?.walletId;
    const teacherId = user?.userID;
    const stuId = "";
    const amount = 0;
    const changeAddress = user?.address;
    const newEvent = new EventClass(
      fromAddress,
      toAddress,
      amount,
      changeAddress,
      stuId,
      teacherId,
      eventId + "-create",
      deadline,
      remark
    );

    console.log("submit:" + JSON.stringify(newEvent));
    // 发送 POST 请求

    const response = await fetch(
      `http://localhost:3001/operator/wallets/${walletId}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          password, // 将密码放在请求头中
        },
        body: JSON.stringify(newEvent),
      }
    );

    // 检查响应
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message}`);
    }

    return response.json(); // 返回响应数据
  };

  return (
    <>
      {show ? (
        <p>{JSON.stringify(show)}</p>
      ) : (
        <button
          className="flex w-full text-black justify-between items-center"
          onClick={changeDisplay}
        >
          <h1 className="text-2xl font-bold">Events</h1>
          <div className="flex hover:text-blue-500">
            <PlusIcon className="h-6 w-6 mr-2" />
            <span>Create a new Event</span>
          </div>
        </button>
      )}

      {display && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="w-full lg:w-1/3 bg-white p-5 rounded-lg shadow-lg">
            <div id="transactionForm" className="w-full py-6 space-y-6">
              {/* Event Name Field */}
              <div className="flex flex-col">
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  required
                  value={eventName}
                  onChange={handleEventNameChange}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the event name"
                />
              </div>

              {/* Deadline Field */}
              <div className="flex flex-col">
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  required
                  value={deadline}
                  onChange={handleDeadlineChange}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Remark Field */}
              <div className="flex flex-col">
                <textarea
                  id="remark"
                  name="remark"
                  value={remark}
                  onChange={handleRemarkChange}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a remark (optional)"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <PasswordWidget
                  buttonText="Create Event"
                  buttonClass="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onSubmit={handlePasswordSubmit}
                />
                <button
                  type="button"
                  onClick={changeDisplay}
                  className="w-full bg-gray-500 text-white font-medium py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default EventForm;