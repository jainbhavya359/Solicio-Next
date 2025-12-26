import React, { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Tips() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(true);

  //const { isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/tips`
        );
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const date = new Date().getDate();
  const tip = data.length ? data[(date * 7) % data.length] : null;

  if ({/*!isAuthenticated*/} || loading || error || !tip) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="
              relative flex items-center gap-4
              px-6 py-3 rounded-full
              backdrop-blur-xl bg-white/10
              border border-white/20
              shadow-[0_10px_40px_rgba(0,0,0,0.6)]
            "
          >
            {/* Glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500/30 via-pink-500/30 to-amber-400/30 blur-lg -z-10" />

            {/* Icon */}
            <span className="text-xl">💡</span>

            {/* Text */}
            <p className="text-sm text-slate-200 leading-snug">
              <span className="font-semibold text-white">
                Did you know?
              </span>{" "}
              {tip.tip}
            </p>

            {/* Close */}
            <button
              onClick={() => setVisible(false)}
              className="ml-2 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



// import React, { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function Tips(){

//     const [ error, setError] = useState(null);
//     const [ loading, setLoading] = useState(true);
//     const [ data, setData] = useState([]);

//     const {isAuthenticated} = useAuth0();

//     useEffect(() => {
//         const fetchData = async ()=> {
//             try{
//                 const respose = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tips`);
//                 const data = await respose.json();
//                 setData(data);
//             }catch (err){
//                 alert("Error Occured", err);
//                 setError(err);
//             }finally{
//                 setLoading(false);
//             }
//         }
//         fetchData();
//     }, []);

//     const date = new Date().getDate();
//     const tips = data.length ? data[date*7%(data.length)] : null;

//     return (
//         <>
//             {loading ? <div className="flex justify-center items-center py-10">
//                 <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//                 </div> : error ? <p> error occured </p> : isAuthenticated ?
//                 <div className="sticky bottom-0 rounded-xl shadow-xl flex justify-center itmes-center z-40">
//                     <div className="flex flex-col justify-center items-center shadow-md shadow-emerald-200/50 bg-emerald-100/50 rounded-3xl px-7 py-2 mb-9 backdrop-blur-sm">
//                         <p>Did you know : {tips?.tip}</p>
//                     </div>
//                 </div>
//             : null}
//         </>
//     );
// }