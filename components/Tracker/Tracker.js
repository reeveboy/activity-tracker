import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Modal from "../Modal";

const Tracker = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const form = () => {
    return (
      <div>
        <form className="flex flex-col items-center">
          <select className="mt-2 rounded-md bg-white border border-black w-[300px] px-3 py-2">
            <option disabled selected hidden value="category">
              Category
            </option>
            <option value="general">General</option>
            <option value="project">Project</option>
            <option value="mdlw">MDLW</option>
            <option value="support">Support</option>
          </select>
          <input
            className="mt-2 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            placeholder="project no."
          />
          <input
            className="mt-2 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            placeholder="customer"
          />
          <input
            className="mt-2 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            placeholder="task"
          />
          <input
            className="mt-2 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            placeholder="hrs planned"
          />
          <div className="mt-2">
            <button className="py-2 px-5 bg-orange rounded-lg">Add</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex items-center">
        <span className="mr-3">Week #27</span>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="30"
            height="30"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24">
            <path
              fill="black"
              d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z"
            />
          </svg>
        </button>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="20"
              height="20"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m11 5l-7 7l7 7m-7-7h16"
              />
            </svg>
          </button>
          <span className="ml-2 mr-2"> Jul 1 </span>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="20"
              height="20"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 12h16m-7-7l7 7l-7 7"
              />
            </svg>
          </button>
        </div>
        <div>
          <select
            className="px-5 py-3 w-[200px] border-none bg-white"
            name="user"
            id="select_user">
            <option selected value="You">
              You
            </option>
            <option value="Donovan">Donovan</option>
          </select>
        </div>
      </div>
      <div>
        <button
          onClick={() => (modalOpen ? close() : open())}
          className="py-2 px-3 bg-orange rounded-lg">
          Add Task
        </button>
      </div>

      <table class="mt-4 table-auto border border-slate-600 rounded-lg bg-white">
        <thead>
          <tr className="text-left text-lg border-b border-slate-500">
            <th className="py-3 px-4">Category</th>
            <th>Project No.</th>
            <th>Customer</th>
            <th>Task</th>
            <th>Planned Hrs</th>
            <th>Actual Hrs</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-left border-b border-slate-500">
            <td className="py-3 px-4">General</td>
            <td>PG2220</td>
            <td>N/A</td>
            <td>Reading & Responding to mails</td>
            <td>2</td>
            <td>00:25:00</td>
            <td>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="30"
                height="30"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 36 36">
                <path
                  fill="black"
                  d="M8.07 31.6A2.07 2.07 0 0 1 6 29.53V6.32a2.07 2.07 0 0 1 3-1.85l23.21 11.61a2.07 2.07 0 0 1 0 3.7L9 31.38a2.06 2.06 0 0 1-.93.22Zm0-25.34L8 6.32v23.21l.1.06L31.31 18a.06.06 0 0 0 0-.06Z"
                  className="clr-i-outline clr-i-outline-path-1"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
            </td>
          </tr>
          <tr className="text-left border-b border-slate-500">
            <td className="py-3 px-4">Project</td>
            <td>P7956</td>
            <td>MSN U4</td>
            <td>DB Transfer + LDAP Testing & Group Permissions</td>
            <td>2</td>
            <td>00:00:00</td>
            <td>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="30"
                height="30"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 36 36">
                <path
                  fill="black"
                  d="M8.07 31.6A2.07 2.07 0 0 1 6 29.53V6.32a2.07 2.07 0 0 1 3-1.85l23.21 11.61a2.07 2.07 0 0 1 0 3.7L9 31.38a2.06 2.06 0 0 1-.93.22Zm0-25.34L8 6.32v23.21l.1.06L31.31 18a.06.06 0 0 0 0-.06Z"
                  className="clr-i-outline clr-i-outline-path-1"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
            </td>
          </tr>
          <tr className="text-left border-b border-slate-500">
            <td className="py-3 px-4">Project</td>
            <td>P7983</td>
            <td>Syngenta</td>
            <td>SOP discussions</td>
            <td>2</td>
            <td>01:17:13</td>
            <td>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="30"
                height="30"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 36 36">
                <path
                  fill="black"
                  d="M8.07 31.6A2.07 2.07 0 0 1 6 29.53V6.32a2.07 2.07 0 0 1 3-1.85l23.21 11.61a2.07 2.07 0 0 1 0 3.7L9 31.38a2.06 2.06 0 0 1-.93.22Zm0-25.34L8 6.32v23.21l.1.06L31.31 18a.06.06 0 0 0 0-.06Z"
                  class="clr-i-outline clr-i-outline-path-1"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <span>Hrs Completed = </span>
        <span className="text-lg">2.0 / 37.5</span>
      </div>

      <AnimatePresence
        initial={false}
        onExitComplete={() => null}
        exitBeforeEnter={true}>
        {modalOpen && (
          <Modal handleClose={close} modalOpen={modalOpen} text={form()} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tracker;
